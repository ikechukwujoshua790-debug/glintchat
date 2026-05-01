import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { Logo } from "../components/Logo";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useRegisterUser } from "../hooks/useBackend";

// Validates phone number: allows +, digits, spaces, dashes, parens; min 7 digits
function isValidPhone(phone: string): boolean {
  const stripped = phone.replace(/[\s\-().+]/g, "");
  return /^\d{7,15}$/.test(stripped);
}

export function SignupPage() {
  const [realName, setRealName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const navigate = useNavigate();
  const registerUser = useRegisterUser();

  function validateName(value: string): string | null {
    if (!value.trim()) return "Full name is required.";
    if (value.trim().split(" ").filter(Boolean).length < 2)
      return "Please enter your first and last name.";
    return null;
  }

  function validatePhone(value: string): string | null {
    if (!value.trim()) return "Phone number is required.";
    if (!isValidPhone(value))
      return "Enter a valid phone number (e.g. +1 555 000 0000).";
    return null;
  }

  const handleNameBlur = () => setNameError(validateName(realName));
  const handlePhoneBlur = () => setPhoneError(validatePhone(phone));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nErr = validateName(realName);
    const pErr = validatePhone(phone);
    setNameError(nErr);
    setPhoneError(pErr);
    if (nErr || pErr) return;

    try {
      await registerUser.mutateAsync({
        realName: realName.trim(),
        phone: phone.trim(),
      });
      navigate({ to: "/chats" });
    } catch {
      // error shown via registerUser.isError below
    }
  };

  const canSubmit =
    !registerUser.isPending && !!realName.trim() && !!phone.trim();

  return (
    <Layout showNav={false}>
      <div className="flex flex-col items-center justify-center min-h-full bg-background px-6 py-12">
        <div data-ocid="signup.page" className="w-full max-w-sm space-y-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-3">
            <Logo size={56} />
            <div className="text-center">
              <h1 className="font-display text-2xl font-bold text-foreground">
                Create Account
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                GlintChat uses your real name and phone.
                <br />
                No usernames — just you.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="realName">Full Name</Label>
              <Input
                id="realName"
                data-ocid="signup.name_input"
                type="text"
                placeholder="e.g. Sofia Alvarez"
                value={realName}
                onChange={(e) => {
                  setRealName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                onBlur={handleNameBlur}
                required
                autoComplete="name"
                aria-invalid={!!nameError}
                aria-describedby={nameError ? "name-error" : undefined}
                className={nameError ? "border-destructive" : ""}
              />
              {nameError && (
                <p
                  id="name-error"
                  data-ocid="signup.name_field_error"
                  className="text-destructive text-xs mt-1"
                  role="alert"
                >
                  {nameError}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                data-ocid="signup.phone_input"
                type="tel"
                placeholder="+1 555 000 0000"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) setPhoneError(null);
                }}
                onBlur={handlePhoneBlur}
                required
                autoComplete="tel"
                aria-invalid={!!phoneError}
                aria-describedby={phoneError ? "phone-error" : undefined}
                className={phoneError ? "border-destructive" : ""}
              />
              {phoneError && (
                <p
                  id="phone-error"
                  data-ocid="signup.phone_field_error"
                  className="text-destructive text-xs mt-1"
                  role="alert"
                >
                  {phoneError}
                </p>
              )}
            </div>

            {/* Server error */}
            {registerUser.isError && (
              <p
                data-ocid="signup.error_state"
                className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg"
                role="alert"
              >
                Registration failed. Please try again.
              </p>
            )}

            <Button
              data-ocid="signup.submit_button"
              type="submit"
              className="w-full h-12 font-semibold"
              disabled={!canSubmit}
            >
              {registerUser.isPending ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center">
            Your data stays private.{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Read our Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}

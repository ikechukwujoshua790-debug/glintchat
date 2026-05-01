import { useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  Copy,
  ImageIcon,
  Loader2,
  Lock,
  Shield,
  Upload,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { AuthGuard } from "../components/AuthGuard";
import { Layout } from "../components/Layout";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  useCallerProfile,
  useMyVerificationRequest,
  useRequestMediaUploadUrl,
  useSubmitVerificationRequest,
} from "../hooks/useBackend";
import { VerificationStatus } from "../types";

const BANK_DETAILS = {
  bank: "Opay",
  accountName: "Isaiah Friday Sam",
  accountNumber: "9164292815",
};

const STEPS = [
  "Transfer ₦9,000 to the account below",
  "Take a clear screenshot of your receipt",
  "Upload the screenshot here",
  "Submit your request for admin review",
];

function CopyableField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-border last:border-0">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-foreground font-mono truncate">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${label}`}
        className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
      >
        <Copy size={12} />
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

// ─── Already verified state ───────────────────────────────────────────────────

function AlreadyVerified() {
  const navigate = useNavigate();
  return (
    <div
      data-ocid="verify.already_verified"
      className="flex flex-col items-center justify-center h-full bg-background gap-6 px-6 py-12"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="w-24 h-24 rounded-full bg-blue-500/15 border border-blue-400/30 flex items-center justify-center"
      >
        <BadgeCheck size={44} className="text-blue-400" />
      </motion.div>
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center space-y-2 max-w-sm"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Already Verified
          </h1>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 text-xs">
            ✓ Active
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Your account already has the verified badge. Your blue{" "}
          <span className="text-blue-400 font-bold">✓</span> checkmark is
          visible on your profile.
        </p>
      </motion.div>
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <Button
          data-ocid="verify.back_button"
          variant="outline"
          onClick={() => navigate({ to: "/chats" })}
          className="transition-smooth"
        >
          Back to Chats
        </Button>
      </motion.div>
    </div>
  );
}

// ─── Pending / submitted state ────────────────────────────────────────────────

function PendingState({ status }: { status: VerificationStatus }) {
  const navigate = useNavigate();
  const isPending = status === VerificationStatus.pending;

  return (
    <div
      data-ocid="verify.pending_state"
      className="flex flex-col items-center justify-center h-full bg-background gap-6 px-6 py-12"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className={`w-24 h-24 rounded-full flex items-center justify-center border ${
          isPending
            ? "bg-amber-500/10 border-amber-400/30"
            : "bg-destructive/10 border-destructive/30"
        }`}
      >
        {isPending ? (
          <Clock size={44} className="text-amber-400" />
        ) : (
          <X size={44} className="text-destructive" />
        )}
      </motion.div>
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-center space-y-2 max-w-sm"
      >
        <h1 className="font-display text-2xl font-bold text-foreground">
          {isPending ? "Pending Review" : "Request Rejected"}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {isPending
            ? "Your verification request has been submitted. You'll receive your blue checkmark once the admin confirms your payment."
            : "Your verification request was rejected. Please contact support or resubmit with a valid receipt."}
        </p>
      </motion.div>
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <Button
          data-ocid="verify.back_button"
          variant="outline"
          onClick={() => navigate({ to: "/chats" })}
          className="transition-smooth"
        >
          Back to Chats
        </Button>
      </motion.div>
    </div>
  );
}

// ─── Main Verify Form ─────────────────────────────────────────────────────────

function VerifyForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const requestUploadUrl = useRequestMediaUploadUrl();
  const submitRequest = useSubmitVerificationRequest();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setUploadError("Please select a JPEG or PNG image.");
      return;
    }
    setUploadError(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setUploadError(null);

    try {
      // Step 1: compute SHA-256 blobHash
      const arrayBuffer = await selectedFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const blobHash = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Step 2: get upload URL from backend
      const cert = await requestUploadUrl.mutateAsync(blobHash);

      // Step 3: upload to gateway
      const uploadResponse = await fetch(cert.method, {
        method: "PUT",
        body: selectedFile,
        headers: { "Content-Type": selectedFile.type },
      });
      if (!uploadResponse.ok) throw new Error("Receipt upload failed");

      // Step 4: submit verification request with blobHash as storageKey
      await submitRequest.mutateAsync(blobHash);
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setUploadError(message);
    }
  };

  const isPending = requestUploadUrl.isPending || submitRequest.isPending;

  if (submitted) {
    return (
      <motion.div
        data-ocid="verify.success_state"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="flex flex-col items-center gap-5 py-8 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-primary" />
        </div>
        <div className="space-y-2 max-w-xs">
          <h2 className="font-display text-xl font-bold text-foreground">
            Request Submitted!
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You'll receive your blue checkmark once the admin confirms your
            payment.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-5">
      {/* Hero */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-400/25 flex items-center justify-center">
            <Shield size={36} className="text-blue-400" />
          </div>
          <span className="absolute -top-1 -right-1 text-xl">✓</span>
        </div>
        <div className="text-center space-y-1">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Get Verified
          </h1>
          <p className="text-muted-foreground text-sm">
            Prove your identity and earn the blue checkmark
          </p>
        </div>
      </motion.div>

      {/* Fee banner */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.08 }}
        className="flex items-center justify-between bg-blue-500/10 border border-blue-400/25 rounded-xl px-5 py-3"
      >
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">
            Verification Fee
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-foreground">
              ₦9,000
            </span>
            <span className="text-muted-foreground text-sm">
              / $6 USD · one-time
            </span>
          </div>
        </div>
        <BadgeCheck size={32} className="text-blue-400 opacity-80 shrink-0" />
      </motion.div>

      {/* Bank details */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl bg-card border border-border overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Transfer To
          </p>
        </div>
        <div className="px-4 py-1">
          <CopyableField label="Bank" value={BANK_DETAILS.bank} />
          <CopyableField
            label="Account Name"
            value={BANK_DETAILS.accountName}
          />
          <CopyableField
            label="Account Number"
            value={BANK_DETAILS.accountNumber}
          />
        </div>
      </motion.div>

      {/* Steps */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.22 }}
        className="rounded-xl bg-card border border-border px-4 py-4 space-y-3"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          How it works
        </p>
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm text-foreground leading-snug">{step}</p>
          </div>
        ))}
      </motion.div>

      {/* Receipt upload */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <p className="text-sm font-medium text-foreground">
          Upload Transfer Receipt <span className="text-destructive">*</span>
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          className="sr-only"
          onChange={handleFileChange}
          data-ocid="verify.receipt_input"
        />

        {!selectedFile ? (
          <button
            type="button"
            data-ocid="verify.upload_button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center gap-3 border-2 border-dashed border-border hover:border-primary/50 rounded-xl py-8 px-4 transition-colors cursor-pointer bg-muted/20 hover:bg-muted/40"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload size={22} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Click to upload receipt
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                JPEG or PNG · Screenshot of your transfer proof
              </p>
            </div>
          </button>
        ) : (
          <div
            data-ocid="verify.receipt_preview"
            className="relative rounded-xl border border-border bg-card overflow-hidden"
          >
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Receipt preview"
                className="w-full max-h-48 object-cover"
              />
            )}
            <div className="flex items-center gap-3 px-3 py-2.5 border-t border-border">
              <ImageIcon size={15} className="text-muted-foreground shrink-0" />
              <p className="text-sm text-foreground truncate flex-1 min-w-0">
                {selectedFile.name}
              </p>
              <button
                type="button"
                data-ocid="verify.remove_receipt_button"
                onClick={handleRemoveFile}
                aria-label="Remove receipt"
                className="shrink-0 p-1 rounded-md hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Error messages */}
      {(uploadError || submitRequest.isError) && (
        <motion.p
          data-ocid="verify.error_state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-destructive text-sm text-center bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3"
        >
          {uploadError ??
            (submitRequest.error instanceof Error
              ? submitRequest.error.message
              : "Submission failed. Please try again.")}
        </motion.p>
      )}

      {/* Submit */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.38 }}
        className="space-y-3 pb-4"
      >
        <Button
          data-ocid="verify.submit_button"
          onClick={handleSubmit}
          disabled={!selectedFile || isPending}
          className="w-full h-12 text-base font-semibold transition-smooth"
          size="lg"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Submitting…
            </>
          ) : (
            "Submit Verification Request"
          )}
        </Button>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock size={11} />
          <span>Your request is reviewed manually by the admin</span>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Page shell ───────────────────────────────────────────────────────────────

export function VerifyPage() {
  const { data: profile, isLoading: profileLoading } = useCallerProfile();
  const { data: verificationRequest, isLoading: verLoading } =
    useMyVerificationRequest();

  if (profileLoading || verLoading) {
    return (
      <AuthGuard>
        <Layout>
          <div className="flex items-center justify-center h-full bg-background">
            <Loader2 size={28} className="text-muted-foreground animate-spin" />
          </div>
        </Layout>
      </AuthGuard>
    );
  }

  // Already approved / verified
  if (
    profile?.isVerified ||
    verificationRequest?.status === VerificationStatus.approved
  ) {
    return (
      <AuthGuard>
        <Layout>
          <AlreadyVerified />
        </Layout>
      </AuthGuard>
    );
  }

  // Pending or rejected — show status screen
  if (
    verificationRequest?.status === VerificationStatus.pending ||
    verificationRequest?.status === VerificationStatus.rejected
  ) {
    return (
      <AuthGuard>
        <Layout>
          <PendingState status={verificationRequest.status} />
        </Layout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Layout>
        <div className="flex flex-col items-center justify-start min-h-full bg-background px-4 py-8 overflow-y-auto">
          <VerifyForm />
        </div>
      </Layout>
    </AuthGuard>
  );
}

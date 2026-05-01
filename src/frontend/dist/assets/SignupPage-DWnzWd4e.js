import { r as reactExports, u as useNavigate, j as jsxRuntimeExports, L as Logo } from "./index-DFLYPydE.js";
import { d as useRegisterUser, L as Layout } from "./Layout-81mP_Nwv.js";
import { B as Button } from "./button-CQxG3T_J.js";
import { I as Input } from "./input-CD0LSYIs.js";
import { L as Label } from "./label-HwO092Ix.js";
import "./index-15HxH_qF.js";
function isValidPhone(phone) {
  const stripped = phone.replace(/[\s\-().+]/g, "");
  return /^\d{7,15}$/.test(stripped);
}
function SignupPage() {
  const [realName, setRealName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [phoneError, setPhoneError] = reactExports.useState(null);
  const [nameError, setNameError] = reactExports.useState(null);
  const navigate = useNavigate();
  const registerUser = useRegisterUser();
  function validateName(value) {
    if (!value.trim()) return "Full name is required.";
    if (value.trim().split(" ").filter(Boolean).length < 2)
      return "Please enter your first and last name.";
    return null;
  }
  function validatePhone(value) {
    if (!value.trim()) return "Phone number is required.";
    if (!isValidPhone(value))
      return "Enter a valid phone number (e.g. +1 555 000 0000).";
    return null;
  }
  const handleNameBlur = () => setNameError(validateName(realName));
  const handlePhoneBlur = () => setPhoneError(validatePhone(phone));
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nErr = validateName(realName);
    const pErr = validatePhone(phone);
    setNameError(nErr);
    setPhoneError(pErr);
    if (nErr || pErr) return;
    try {
      await registerUser.mutateAsync({
        realName: realName.trim(),
        phone: phone.trim()
      });
      navigate({ to: "/chats" });
    } catch {
    }
  };
  const canSubmit = !registerUser.isPending && !!realName.trim() && !!phone.trim();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { showNav: false, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center min-h-full bg-background px-6 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "signup.page", className: "w-full max-w-sm space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { size: 56 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Create Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-1", children: [
          "GlintChat uses your real name and phone.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "No usernames — just you."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", noValidate: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "realName", children: "Full Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "realName",
            "data-ocid": "signup.name_input",
            type: "text",
            placeholder: "e.g. Sofia Alvarez",
            value: realName,
            onChange: (e) => {
              setRealName(e.target.value);
              if (nameError) setNameError(null);
            },
            onBlur: handleNameBlur,
            required: true,
            autoComplete: "name",
            "aria-invalid": !!nameError,
            "aria-describedby": nameError ? "name-error" : void 0,
            className: nameError ? "border-destructive" : ""
          }
        ),
        nameError && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            id: "name-error",
            "data-ocid": "signup.name_field_error",
            className: "text-destructive text-xs mt-1",
            role: "alert",
            children: nameError
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Phone Number" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "phone",
            "data-ocid": "signup.phone_input",
            type: "tel",
            placeholder: "+1 555 000 0000",
            value: phone,
            onChange: (e) => {
              setPhone(e.target.value);
              if (phoneError) setPhoneError(null);
            },
            onBlur: handlePhoneBlur,
            required: true,
            autoComplete: "tel",
            "aria-invalid": !!phoneError,
            "aria-describedby": phoneError ? "phone-error" : void 0,
            className: phoneError ? "border-destructive" : ""
          }
        ),
        phoneError && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            id: "phone-error",
            "data-ocid": "signup.phone_field_error",
            className: "text-destructive text-xs mt-1",
            role: "alert",
            children: phoneError
          }
        )
      ] }),
      registerUser.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          "data-ocid": "signup.error_state",
          className: "text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg",
          role: "alert",
          children: "Registration failed. Please try again."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          "data-ocid": "signup.submit_button",
          type: "submit",
          className: "w-full h-12 font-semibold",
          disabled: !canSubmit,
          children: registerUser.isPending ? "Creating account…" : "Create Account"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-center", children: [
      "Your data stays private.",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/privacy", className: "text-primary hover:underline", children: "Read our Privacy Policy" })
    ] })
  ] }) }) });
}
export {
  SignupPage
};

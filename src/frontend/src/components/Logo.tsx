interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 36, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="GlintChat logo"
    >
      {/* White square background with rounded corners */}
      <rect width="36" height="36" rx="8" fill="white" />

      {/* Green speech bubble */}
      <path
        d="M7 10C7 8.343 8.343 7 10 7H26C27.657 7 29 8.343 29 10V22C29 23.657 27.657 25 26 25H20L15 30V25H10C8.343 25 7 23.657 7 22V10Z"
        fill="#2d8a5e"
      />

      {/* Textured golden G */}
      <text
        x="18"
        y="22"
        textAnchor="middle"
        fontSize="14"
        fontWeight="800"
        fontFamily="Georgia, serif"
        fill="url(#goldGrad)"
        style={{ letterSpacing: "-0.5px" }}
      >
        G
      </text>

      {/* Gold gradient definition */}
      <defs>
        <linearGradient
          id="goldGrad"
          x1="13"
          y1="10"
          x2="23"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#f5c842" />
          <stop offset="40%" stopColor="#d4a017" />
          <stop offset="70%" stopColor="#f0b429" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogoWithText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo size={32} />
      <span className="font-display font-bold text-lg tracking-tight text-foreground">
        GlintChat
      </span>
    </div>
  );
}

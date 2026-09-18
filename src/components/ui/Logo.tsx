// Custom FamilyCare logo — communicates family + care + health + home.
// NOT a generic medical cross.

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="FamilyCare logo"
      role="img"
    >
      {/* House / home shape — bottom */}
      <path
        d="M8 28L24 14L40 28V42H30V33H18V42H8V28Z"
        fill="#F0E6D3"
        stroke="#6B4636"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Roof highlight */}
      <path
        d="M24 14L40 28"
        stroke="#B86F52"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M24 14L8 28"
        stroke="#B86F52"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Heart in the center of the house */}
      <path
        d="M24 37C24 37 17 32.5 17 28C17 25.8 18.8 24 21 24C22.2 24 23.3 24.6 24 25.5C24.7 24.6 25.8 24 27 24C29.2 24 31 25.8 31 28C31 32.5 24 37 24 37Z"
        fill="#B86F52"
      />

      {/* Small family figures above roof — parent + child silhouettes */}
      {/* Parent left */}
      <circle cx="18" cy="8" r="3" fill="#6B4636" />
      <path d="M18 11V17" stroke="#6B4636" strokeWidth="2" strokeLinecap="round" />

      {/* Parent right */}
      <circle cx="30" cy="8" r="3" fill="#6B4636" />
      <path d="M30 11V17" stroke="#6B4636" strokeWidth="2" strokeLinecap="round" />

      {/* Child center — slightly smaller */}
      <circle cx="24" cy="9.5" r="2.5" fill="#927565" />
      <path d="M24 12V17" stroke="#927565" strokeWidth="1.8" strokeLinecap="round" />

      {/* Leaf accent — sage green, top right */}
      <path
        d="M38 6C38 6 42 8 42 12C42 12 38 12 36 10C36 8 38 6 38 6Z"
        fill="#7C9274"
        opacity="0.8"
      />
    </svg>
  );
}

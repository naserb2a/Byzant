import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["600"] });

interface ByzantLogoProps {
  size?: number | string;
  color?: string;
  className?: string;
}

export default function ByzantLogo({
  size = 22,
  color = "#ffffff",
  className,
}: ByzantLogoProps) {
  return (
    <svg
      viewBox="0 0 70 22"
      role="img"
      aria-label="Byzant"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        height: typeof size === "number" ? `${size}px` : size,
        width: "auto",
        display: "block",
      }}
    >
      <text
        x="0"
        y="17"
        fontFamily={inter.style.fontFamily}
        fontWeight={600}
        fontSize="20"
        letterSpacing="-0.01em"
        fill={color}
      >
        Byzant
      </text>
    </svg>
  );
}

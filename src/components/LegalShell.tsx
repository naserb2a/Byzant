import Link from "next/link";
import ByzantLogo from "@/components/ByzantLogo";

export const BG = "#000000";
export const INK = "#ffffff";
export const MUTED = "#94a3b8";
export const TEAL = "#99E1D9";
export const BORDER = "rgba(255,255,255,0.06)";
export const SYS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
export const DISPLAY = "var(--font-sora)";

export default function LegalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: BG,
        color: INK,
        minHeight: "100vh",
        fontFamily: SYS,
      }}
    >
      <header
        style={{
          padding: "24px 40px",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <Link
          href="/"
          aria-label="Byzant home"
          style={{ display: "inline-flex", alignItems: "center" }}
        >
          <ByzantLogo size={22} color={INK} />
        </Link>
      </header>
      <main
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "80px 24px 120px",
        }}
      >
        {children}
      </main>
    </div>
  );
}

const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: DISPLAY,
  fontSize: 22,
  fontWeight: 600,
  letterSpacing: "-0.01em",
  color: TEAL,
  margin: "48px 0 12px",
};

const paragraphStyle: React.CSSProperties = {
  fontFamily: SYS,
  fontSize: 15,
  lineHeight: 1.7,
  color: INK,
  margin: "0 0 14px",
};

const listStyle: React.CSSProperties = {
  fontFamily: SYS,
  fontSize: 15,
  lineHeight: 1.7,
  color: MUTED,
  paddingLeft: 20,
  margin: "0 0 14px",
};

const reviewPillStyle: React.CSSProperties = {
  display: "inline-block",
  fontFamily: SYS,
  fontSize: 11,
  fontWeight: 600,
  color: "var(--db-amber)",
  background: "var(--db-amber-dim)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  padding: "2px 8px",
  borderRadius: 999,
  marginLeft: 8,
  verticalAlign: "middle",
};

export function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1
      style={{
        fontFamily: DISPLAY,
        fontSize: 40,
        fontWeight: 600,
        letterSpacing: "-0.02em",
        color: INK,
        margin: 0,
        lineHeight: 1.15,
      }}
    >
      {children}
    </h1>
  );
}

export function LastUpdated({ date }: { date: string }) {
  return (
    <p
      style={{
        fontFamily: SYS,
        fontSize: 13,
        color: MUTED,
        margin: "8px 0 0",
      }}
    >
      Last updated: {date}
    </p>
  );
}

export function Section({
  number,
  title,
  needsReview = false,
  children,
}: {
  number: number;
  title: string;
  needsReview?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 style={sectionHeadingStyle}>
        {number}. {title}
        {needsReview && (
          <span style={reviewPillStyle}>[Requires lawyer review]</span>
        )}
      </h2>
      {children}
    </section>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p style={paragraphStyle}>{children}</p>;
}

export function UL({ children }: { children: React.ReactNode }) {
  return <ul style={listStyle}>{children}</ul>;
}

export function ReviewPill() {
  return <span style={reviewPillStyle}>[Requires lawyer review]</span>;
}

export function MailLink({ email }: { email: string }) {
  return (
    <a
      href={`mailto:${email}`}
      style={{
        color: TEAL,
        textDecoration: "none",
      }}
    >
      {email}
    </a>
  );
}

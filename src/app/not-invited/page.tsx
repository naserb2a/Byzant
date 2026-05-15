import ByzantLogo from "@/components/ByzantLogo";

const SYS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export default function NotInvitedPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        fontFamily: SYS,
        padding: "40px 24px",
      }}
    >
      <ByzantLogo size={28} color="#ffffff" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: SYS,
            fontSize: 22,
            fontWeight: 500,
            color: "#ffffff",
            letterSpacing: "-0.01em",
          }}
        >
          You&rsquo;re not on the list yet.
        </h1>
        <p
          style={{
            margin: 0,
            fontFamily: SYS,
            fontSize: 14,
            color: "#666666",
          }}
        >
          Join the waitlist at byzant.ai
        </p>
      </div>
    </main>
  );
}

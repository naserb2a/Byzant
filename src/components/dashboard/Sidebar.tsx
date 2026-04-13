"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MONO = "var(--font-geist-mono)";
const SANS = "var(--font-geist-sans)";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width={15} height={15} viewBox="0 0 15 15" fill="none">
        <rect x="1" y="1" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
    badge: null,
  },
  {
    label: "Approvals",
    href: "/approvals",
    icon: (
      <svg width={15} height={15} viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5 7.5l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    badge: "3",
  },
  {
    label: "Marketplace",
    href: "/marketplace",
    icon: (
      <svg width={15} height={15} viewBox="0 0 15 15" fill="none">
        <rect x="1.5" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5 4V3a2.5 2.5 0 015 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
    badge: null,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: (
      <svg width={15} height={15} viewBox="0 0 15 15" fill="none">
        <path d="M2 12l3.5-4 3 3L13 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    badge: null,
  },
  {
    label: "Agent Log",
    href: "/log",
    icon: (
      <svg width={15} height={15} viewBox="0 0 15 15" fill="none">
        <rect x="2" y="1.5" width="11" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5 5h5M5 7.5h5M5 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    badge: null,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 200,
      minWidth: 200,
      height: "100vh",
      position: "sticky",
      top: 0,
      background: "var(--db-bg2)",
      borderRight: "1px solid var(--db-border)",
      display: "flex",
      flexDirection: "column",
      padding: "0",
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: "18px 16px", borderBottom: "1px solid var(--db-border)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "var(--db-blue-dim)", border: "1px solid var(--db-border-mid)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1.5" fill="var(--db-blue)" fillOpacity="0.9" />
              <rect x="8" y="1" width="5" height="5" rx="1.5" fill="var(--db-blue)" fillOpacity="0.45" />
              <rect x="1" y="8" width="5" height="5" rx="1.5" fill="var(--db-blue)" fillOpacity="0.45" />
              <rect x="8" y="8" width="5" height="5" rx="1.5" fill="var(--db-blue)" fillOpacity="0.7" />
            </svg>
          </div>
          <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 500, letterSpacing: 0 }}>
            <span style={{ color: "#99E1D9", fontFamily: "var(--font-geist-sans)", fontWeight: 700, letterSpacing: 0, WebkitTextStroke: "0.5px rgba(255,255,255,0.4)" }}>Byzant</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 10px", borderRadius: 8,
                color: active ? "var(--db-blue)" : "var(--db-ink-muted)",
                background: active ? "var(--db-blue-dim)" : "transparent",
                borderLeft: active ? "2px solid var(--db-blue)" : "2px solid transparent",
                fontSize: 13, fontWeight: active ? 600 : 400,
                textDecoration: "none", transition: "background 0.15s, color 0.15s",
                fontFamily: SANS,
                position: "relative",
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "var(--db-bg3)"; e.currentTarget.style.color = "var(--db-ink)"; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--db-ink-muted)"; } }}
            >
              <span style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 999,
                  background: "var(--db-red-dim)", color: "var(--db-red)",
                  fontFamily: MONO,
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* System section */}
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--db-border)" }}>
          <div style={{ fontSize: 9, color: "var(--db-ink-faint)", fontFamily: MONO, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 10px 6px" }}>System</div>
          <Link
            href="/settings"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 10px", borderRadius: 8,
              color: "var(--db-ink-muted)", textDecoration: "none",
              fontSize: 13, fontFamily: SANS, transition: "background 0.15s",
              borderLeft: "2px solid transparent",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--db-bg3)"; e.currentTarget.style.color = "var(--db-ink)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--db-ink-muted)"; }}
          >
            <svg width={15} height={15} viewBox="0 0 15 15" fill="none">
              <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3" />
              <path d="M7.5 1.5v1M7.5 12.5v1M1.5 7.5h1M12.5 7.5h1M3.4 3.4l.7.7M10.9 10.9l.7.7M3.4 11.6l.7-.7M10.9 4.1l.7-.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Settings
          </Link>
        </div>
      </nav>

      {/* User footer */}
      <div style={{
        padding: "12px 14px", borderTop: "1px solid var(--db-border)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: "var(--db-blue-mid)", border: "1px solid var(--db-border-mid)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 700, color: "var(--db-blue)", fontFamily: MONO,
        }}>
          NM
        </div>
        <div style={{ overflow: "hidden" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--db-ink)", lineHeight: 1.2, fontFamily: SANS }}>Nas</div>
          <div style={{ fontSize: 10, color: "var(--db-blue)", fontFamily: MONO, letterSpacing: "0.04em" }}>Founder Access</div>
        </div>
      </div>
    </aside>
  );
}

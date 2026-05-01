"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CheckCircle2,
  Store,
  LineChart,
  FileText,
  Settings as SettingsIcon,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SYSTEM_FONT, TEAL, tokens, useTheme } from "./ThemeProvider";

type NavItem = { label: string; href: string; Icon: LucideIcon; badge?: number };

const PENDING_APPROVALS = 3;

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
  { label: "Approvals", href: "/approvals", Icon: CheckCircle2, badge: PENDING_APPROVALS },
  { label: "Marketplace", href: "/marketplace", Icon: Store },
  { label: "Analytics", href: "/analytics", Icon: LineChart },
  { label: "Agent Log", href: "/log", Icon: FileText },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({
  item,
  active,
  textMuted,
  textPrimary,
  accentText,
}: {
  item: NavItem;
  active: boolean;
  textMuted: string;
  textPrimary: string;
  accentText: string;
}) {
  return (
    <Link
      href={item.href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        height: 36,
        padding: "0 10px 0 8px",
        borderRadius: 6,
        textDecoration: "none",
        color: active ? accentText : textMuted,
        background: active ? "rgba(153,225,217,0.08)" : "transparent",
        borderLeft: `2px solid ${active ? TEAL : "transparent"}`,
        fontSize: 13,
        fontWeight: active ? 500 : 400,
        lineHeight: 1.2,
        transition: "color 0.12s, background 0.12s",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.color = textPrimary;
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.color = textMuted;
      }}
    >
      <item.Icon size={16} strokeWidth={1.5} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {typeof item.badge === "number" && item.badge > 0 && (
        <span
          aria-label={`${item.badge} pending`}
          style={{
            minWidth: 18,
            height: 18,
            padding: "0 6px",
            borderRadius: 999,
            background: TEAL,
            color: "#0a0a0a",
            fontSize: 10,
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const t = tokens(theme);

  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return;
    }
    let cancelled = false;
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!cancelled && user?.email) setEmail(user.email);
      });
    } catch {
      // Supabase client unavailable — leave placeholder values.
    }
    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = email ? email.split("@")[0] : "Nas";
  const displayEmail = email ?? "";

  return (
    <aside
      style={{
        width: 220,
        minWidth: 220,
        height: "100vh",
        position: "sticky",
        top: 0,
        background: t.sidebarBg,
        borderRight: `1px solid ${t.sidebarBorder}`,
        display: "flex",
        flexDirection: "column",
        fontFamily: SYSTEM_FONT,
      }}
    >
      {/* Header */}
      <div style={{ padding: "16px 16px 14px" }}>
        <Link
          href="/"
          style={{
            color: t.accentText,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 0,
            textDecoration: "none",
            display: "block",
          }}
        >
          Byzant
        </Link>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: "4px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflowY: "auto",
        }}
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(pathname, item.href)}
            textMuted={t.textMuted}
            textPrimary={t.textPrimary}
            accentText={t.accentText}
          />
        ))}
      </nav>

      {/* User identity + Settings pinned bottom */}
      <div
        style={{
          padding: "10px 8px 16px",
          borderTop: `1px solid ${t.sidebarBorder}`,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "4px 10px 4px 8px",
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: TEAL,
              color: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              minWidth: 0,
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: t.textPrimary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1.2,
              }}
            >
              {displayName}
            </div>
            {displayEmail && (
              <div
                style={{
                  fontSize: 11,
                  color: t.textMuted,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  lineHeight: 1.2,
                }}
              >
                {displayEmail}
              </div>
            )}
          </div>
        </div>

        <NavLink
          item={{ label: "Settings", href: "/settings", Icon: SettingsIcon }}
          active={isActive(pathname, "/settings")}
          textMuted={t.textMuted}
          textPrimary={t.textPrimary}
          accentText={t.accentText}
        />
      </div>
    </aside>
  );
}

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

type NavItem = { label: string; href: string; Icon: LucideIcon };

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
  { label: "Approvals", href: "/approvals", Icon: CheckCircle2 },
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
}: {
  item: NavItem;
  active: boolean;
  textMuted: string;
  textPrimary: string;
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
        color: active ? TEAL : textMuted,
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
      <span>{item.label}</span>
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
            color: TEAL,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 0,
            textDecoration: "none",
            display: "block",
          }}
        >
          Byzant
        </Link>
        <div
          style={{
            marginTop: 6,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            minWidth: 0,
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
              }}
            >
              {displayEmail}
            </div>
          )}
        </div>
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
          />
        ))}
      </nav>

      {/* Settings pinned bottom */}
      <div style={{ padding: "8px 8px 16px" }}>
        <NavLink
          item={{ label: "Settings", href: "/settings", Icon: SettingsIcon }}
          active={isActive(pathname, "/settings")}
          textMuted={t.textMuted}
          textPrimary={t.textPrimary}
        />
      </div>
    </aside>
  );
}

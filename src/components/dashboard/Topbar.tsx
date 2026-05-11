"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SYSTEM_FONT, TEAL, tokens, useTheme } from "./ThemeProvider";

const PAGE_TITLES: { prefix: string; label: string }[] = [
  { prefix: "/dashboard", label: "Dashboard" },
  { prefix: "/approvals", label: "Approvals" },
  { prefix: "/marketplace", label: "Marketplace" },
  { prefix: "/analytics", label: "Analytics" },
  { prefix: "/whale-tracker", label: "Whale Tracker" },
  { prefix: "/congressional-tracker", label: "Congressional Tracker" },
  { prefix: "/log", label: "Agent Log" },
  { prefix: "/roadmap", label: "Roadmap" },
  { prefix: "/settings", label: "Settings" },
];

function resolveTitle(pathname: string): string {
  const match = PAGE_TITLES.find(
    (t) => pathname === t.prefix || pathname.startsWith(t.prefix + "/")
  );
  return match?.label ?? "Dashboard";
}

export default function Topbar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const t = tokens(theme);

  const [initial, setInitial] = useState("N");

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
        if (!cancelled && user?.email) {
          setInitial(user.email.charAt(0).toUpperCase());
        }
      });
    } catch {
      // Supabase client unavailable — leave the default initial.
    }
    return () => {
      cancelled = true;
    };
  }, []);

  const title = resolveTitle(pathname);

  return (
    <header
      style={{
        position: "relative",
        height: 48,
        flexShrink: 0,
        background: t.topbarBg,
        borderBottom: `1px solid ${t.topbarBorder}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 20px",
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 13,
          fontWeight: 500,
          color: t.textPrimary,
          fontFamily: SYSTEM_FONT,
          pointerEvents: "none",
        }}
      >
        {title}
      </div>

      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: TEAL,
          color: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 600,
          fontFamily: SYSTEM_FONT,
        }}
      >
        {initial}
      </div>
    </header>
  );
}

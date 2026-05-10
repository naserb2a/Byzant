"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ByzantLogo from "@/components/ByzantLogo";

const DISPLAY = "var(--font-inter)";
const TEAL = "#99E1D9";
const SURFACE = "#0a0a0a";
const INK = "#ffffff";
const MUTED = "#94a3b8";

const PRODUCT_ITEMS: { name: string; desc: string; href: string }[] = [
  {
    name: "Whale Tracker",
    desc: "Monitor institutional money movements in real time",
    href: "/marketplace",
  },
  {
    name: "Risk Agent",
    desc: "Enforce your rules. Never break them emotionally.",
    href: "/marketplace",
  },
  {
    name: "Congressional Tracker",
    desc: "Monitor congressional trading disclosures in real time",
    href: "/marketplace",
  },
  {
    name: "Trailing Stop Bot",
    desc: "Automate stop losses as positions move in your favor",
    href: "/marketplace",
  },
  {
    name: "Wheel Strategy Bot",
    desc: "Run the wheel options strategy automatically",
    href: "/marketplace",
  },
];

function TealPill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: TEAL,
        color: "#000000",
        fontFamily: DISPLAY,
        fontSize: 14,
        fontWeight: 500,
        padding: "10px 18px",
        borderRadius: 999,
        textDecoration: "none",
        letterSpacing: "-0.005em",
        transition: "opacity 0.15s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {children}
    </Link>
  );
}

function ProductDropdown() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          fontFamily: DISPLAY,
          fontSize: 14,
          fontWeight: 400,
          color: open ? INK : "rgba(255,255,255,0.85)",
          background: "transparent",
          border: 0,
          padding: "8px 0",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          transition: "color 0.15s ease",
        }}
      >
        Product
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.18s ease",
            opacity: 0.7,
          }}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: 76,
              right: 32,
              width: "min(1100px, calc(100vw - 64px))",
              background: SURFACE,
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
              zIndex: 100,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 4,
              }}
            >
              {PRODUCT_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="nav-dd-item"
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block",
                    padding: "18px 20px",
                    borderRadius: 10,
                    textDecoration: "none",
                    transition: "background 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      fontFamily: DISPLAY,
                      fontSize: 15,
                      fontWeight: 500,
                      color: INK,
                      marginBottom: 6,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontFamily: DISPLAY,
                      fontSize: 13,
                      color: MUTED,
                      lineHeight: 1.45,
                    }}
                  >
                    {item.desc}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const isPricing = pathname === "/pricing";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        className="nav-row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 80px",
          height: 64,
        }}
      >
        <Link
          href="/"
          style={{ textDecoration: "none", display: "flex", alignItems: "center" }}
        >
          <ByzantLogo size={22} color="#ffffff" />
        </Link>

        <div
          className="nav-desktop"
          style={{ display: "flex", alignItems: "center", gap: 24 }}
        >
          <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <ProductDropdown />
            <Link
              href="/pricing"
              style={{
                fontFamily: DISPLAY,
                fontSize: 14,
                fontWeight: 400,
                color: isPricing ? INK : "rgba(255,255,255,0.85)",
                textDecoration: "none",
                padding: "8px 0",
                transition: "color 0.15s ease",
              }}
            >
              Pricing
            </Link>
          </nav>

          <span
            aria-hidden
            style={{
              width: 1,
              height: 16,
              background: "rgba(255,255,255,0.15)",
            }}
          />

          <Link
            href="/auth"
            className="nav-signin"
            style={{
              fontFamily: DISPLAY,
              fontSize: 14,
              fontWeight: 400,
              color: "rgba(255,255,255,0.85)",
              textDecoration: "none",
            }}
          >
            Sign In
          </Link>

          <TealPill href="/signup">Join Waitlist</TealPill>
        </div>
      </div>

      <style jsx global>{`
        .nav-dd-item:hover {
          background: rgba(255, 255, 255, 0.04);
        }
        @media (max-width: 1024px) {
          .nav-row {
            padding: 16px 32px !important;
          }
        }
      `}</style>
    </header>
  );
}

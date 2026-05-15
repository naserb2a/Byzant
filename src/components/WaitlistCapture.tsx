"use client";

import { useEffect, useRef, useState } from "react";

const TEAL = "#99E1D9";
const INK = "#ffffff";
const BG = "#000000";
const RED = "#f87171";
const DISPLAY = "var(--font-inter)";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "capturing" | "loading" | "success" | "error";

export default function WaitlistCapture() {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "capturing" || status === "error") {
      inputRef.current?.focus();
    }
  }, [status]);

  const submit = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmed)) {
      setErrorMsg("Enter a valid email.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) {
        setErrorMsg("Something went wrong. Try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("Something went wrong. Try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          fontFamily: DISPLAY,
          fontSize: 14,
          fontWeight: 500,
          color: TEAL,
          letterSpacing: "-0.005em",
          padding: "10px 18px",
        }}
      >
        You&rsquo;re on the list. We&rsquo;ll be in touch.
      </span>
    );
  }

  if (status === "idle") {
    return (
      <button
        type="button"
        onClick={() => setStatus("capturing")}
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
          border: "none",
          cursor: "pointer",
          letterSpacing: "-0.005em",
          transition: "transform 0.15s ease, opacity 0.15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Join Waitlist
      </button>
    );
  }

  const showError = status === "error";
  const isLoading = status === "loading";

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: BG,
          border: `1px solid ${TEAL}`,
          borderRadius: 999,
          padding: "4px 4px 4px 14px",
          minWidth: 280,
          transition: "all 0.15s ease",
        }}
      >
        <input
          ref={inputRef}
          type="email"
          value={email}
          disabled={isLoading}
          placeholder="you@email.com"
          onChange={(e) => {
            setEmail(e.target.value);
            if (showError) {
              setErrorMsg("");
              setStatus("capturing");
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            } else if (e.key === "Escape" && email.length === 0) {
              setStatus("idle");
            }
          }}
          style={{
            flex: 1,
            minWidth: 0,
            background: "transparent",
            border: "none",
            outline: "none",
            color: INK,
            fontFamily: DISPLAY,
            fontSize: 14,
            fontWeight: 400,
            letterSpacing: "-0.005em",
            padding: "6px 8px 6px 0",
          }}
        />
        <button
          type="button"
          onClick={submit}
          disabled={isLoading}
          aria-label="Submit email"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: TEAL,
            color: "#000000",
            border: "none",
            cursor: isLoading ? "default" : "pointer",
            fontFamily: DISPLAY,
            fontSize: 14,
            fontWeight: 600,
            transition: "opacity 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (!isLoading) e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          {isLoading ? (
            <span
              aria-hidden
              style={{
                width: 12,
                height: 12,
                border: "2px solid rgba(0,0,0,0.25)",
                borderTopColor: "#000000",
                borderRadius: "50%",
                animation: "wl-spin 0.7s linear infinite",
                display: "inline-block",
              }}
            />
          ) : (
            "→"
          )}
        </button>
      </div>
      {showError && (
        <span
          style={{
            fontFamily: DISPLAY,
            fontSize: 12,
            color: RED,
            paddingLeft: 14,
          }}
        >
          {errorMsg}
        </span>
      )}
      <style jsx global>{`
        @keyframes wl-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const SORA = "var(--font-sora)";
const BG = "#0a0a0a";
const TEAL = "#99E1D9";
const TEAL_DIM = "rgba(153,225,217,0.10)";
const TEAL_MID = "rgba(153,225,217,0.35)";
const BORDER = "rgba(255,255,255,0.08)";
const BORDER_HI = "rgba(255,255,255,0.18)";
const INK = "#F5F5F5";
const INK_MUTED = "#64748b";
const SURFACE = "#111318";

type AgentType = "claude" | "gpt-4" | "gemini" | "grok" | "openclaw" | "other";
type AccountSize = "under_10k" | "10_50k" | "50_100k" | "100k_plus";
type RiskTolerance = "conservative" | "moderate" | "aggressive";
type Experience = "beginner" | "intermediate" | "advanced";

const DISCLAIMER = `DISCLAIMER — NOT FINANCIAL ADVICE

Byzant is a data and infrastructure marketplace. We do not provide financial advice, investment recommendations, or trading signals.

The modules available on Byzant provide data feeds and infrastructure tools for use by AI agents. Byzant does not build, operate, or control your AI agent. Your agent is independently operated by you or a third-party provider.

Every trade executed through any agent connected to Byzant requires your explicit manual approval. You are solely responsible for all trading decisions you approve.

Byzant does not guarantee the accuracy, completeness, or timeliness of any data provided through its modules. Past performance of any module, strategy, or data feed does not guarantee future results.

By using Byzant, you acknowledge that:
• You are the sole decision-maker for all trades you approve
• Byzant provides infrastructure and data only
• You may lose money trading — this is your sole responsibility
• Byzant is not liable for any trading losses or agent behavior

You are the arbiter. Always.`;

const AGENT_OPTIONS: {
  key: AgentType;
  name: string;
  desc: string;
}[] = [
  {
    key: "claude",
    name: "Claude (Anthropic)",
    desc: "Native MCP support. Fully compatible with all Byzant modules.",
  },
  {
    key: "gpt-4",
    name: "GPT-4 (OpenAI)",
    desc: "Fully compatible via MCP-enabled agent frameworks.",
  },
  {
    key: "gemini",
    name: "Gemini (Google)",
    desc: "Fully compatible via MCP-enabled agent frameworks.",
  },
  {
    key: "grok",
    name: "Grok (xAI)",
    desc: "Fully compatible via MCP-enabled agent frameworks.",
  },
  {
    key: "openclaw",
    name: "OpenClaw",
    desc: "Open-source autonomous trading agent. Native MCP support.",
  },
  {
    key: "other",
    name: "Other / Custom",
    desc: "Any MCP-compatible agent works with Byzant.",
  },
];

const ACCOUNT_SIZES: { key: AccountSize; label: string }[] = [
  { key: "under_10k", label: "Under $10k" },
  { key: "10_50k", label: "$10k–$50k" },
  { key: "50_100k", label: "$50k–$100k" },
  { key: "100k_plus", label: "$100k+" },
];

const RISK_LEVELS: { key: RiskTolerance; label: string }[] = [
  { key: "conservative", label: "Conservative" },
  { key: "moderate", label: "Moderate" },
  { key: "aggressive", label: "Aggressive" },
];

const EXPERIENCE_LEVELS: { key: Experience; label: string }[] = [
  { key: "beginner", label: "Beginner" },
  { key: "intermediate", label: "Intermediate" },
  { key: "advanced", label: "Advanced" },
];

function Wordmark() {
  return (
    <Link
      href="/"
      style={{
        fontFamily: SORA,
        fontSize: 20,
        fontWeight: 600,
        color: TEAL,
        letterSpacing: "-0.01em",
        textDecoration: "none",
      }}
    >
      Byzant
    </Link>
  );
}

function ProgressDots({ step }: { step: number }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
      }}
    >
      {[0, 1, 2, 3].map((i) => {
        const active = i === step;
        const done = i < step;
        return (
          <span
            key={i}
            style={{
              width: active ? 24 : 6,
              height: 6,
              borderRadius: 999,
              background: active ? TEAL : done ? TEAL_MID : BORDER,
              transition: "width 0.25s ease, background 0.25s ease",
            }}
          />
        );
      })}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  loading,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
}) {
  const inactive = disabled || loading;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={inactive}
      style={{
        width: "100%",
        height: 52,
        borderRadius: 999,
        border: "1px solid " + (inactive ? BORDER : TEAL),
        background: inactive ? "rgba(153,225,217,0.18)" : TEAL,
        color: inactive ? INK_MUTED : "#0a0a0a",
        fontFamily: SORA,
        fontSize: 15,
        fontWeight: 500,
        cursor: inactive ? "not-allowed" : "pointer",
        transition: "background 0.15s, opacity 0.15s",
        opacity: inactive ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!inactive) e.currentTarget.style.background = "#B2EBE5";
      }}
      onMouseLeave={(e) => {
        if (!inactive) e.currentTarget.style.background = TEAL;
      }}
    >
      {loading ? "Saving…" : children}
    </button>
  );
}

function stepVariants() {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };
}

function SegmentedGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              border: "1px solid " + (active ? TEAL : BORDER),
              background: active ? TEAL_DIM : "transparent",
              color: active ? TEAL : INK,
              fontFamily: SORA,
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.borderColor = BORDER_HI;
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.borderColor = BORDER;
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 0
  const [agreed, setAgreed] = useState(false);

  // Step 1
  const [brokerMessage, setBrokerMessage] = useState<string | null>(null);

  // Step 2
  const [agent, setAgent] = useState<AgentType | null>(null);

  // Step 3
  const [accountSize, setAccountSize] = useState<AccountSize | null>(null);
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canContinueStep0 = agreed;
  const canContinueStep2 = agent !== null;
  const canFinish =
    accountSize !== null && riskTolerance !== null && experience !== null;

  async function handleFinish() {
    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Session expired. Please sign in again.");
      setSubmitting(false);
      return;
    }

    const { error: upsertError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        agent_type: agent,
        account_size: accountSize,
        risk_tolerance: riskTolerance,
        experience_level: experience,
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (upsertError) {
      setError(upsertError.message);
      setSubmitting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        color: INK,
        fontFamily: SORA,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Wordmark />
        <ProgressDots step={step} />
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 560 }}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step-0"
                variants={stepVariants()}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <StepHeader
                  eyebrow="Step 1 of 4"
                  title="Before you begin."
                  subtitle="Please read and agree to the following before accessing Byzant."
                />

                <div
                  style={{
                    background: SURFACE,
                    border: "1px solid " + BORDER,
                    borderRadius: 8,
                    padding: 20,
                    maxHeight: 240,
                    overflowY: "auto",
                    fontFamily: SORA,
                    fontSize: 13,
                    lineHeight: 1.7,
                    color: INK_MUTED,
                    whiteSpace: "pre-wrap",
                    marginBottom: 20,
                  }}
                >
                  {DISCLAIMER}
                </div>

                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    marginBottom: 24,
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <span
                    onClick={() => setAgreed((v) => !v)}
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      border: "1px solid " + (agreed ? TEAL : BORDER_HI),
                      background: agreed ? TEAL : "transparent",
                      flexShrink: 0,
                      marginTop: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                  >
                    {agreed && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2.5 6.2 5 8.5l4.5-5"
                          stroke="#0a0a0a"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
                    tabIndex={-1}
                  />
                  <span
                    style={{
                      fontFamily: SORA,
                      fontSize: 13,
                      color: INK,
                      lineHeight: 1.5,
                    }}
                  >
                    I have read and agree to the Terms of Service and Risk
                    Disclaimer. I understand Byzant is not a financial advisor
                    and I am solely responsible for my trading decisions.
                  </span>
                </label>

                <PrimaryButton
                  disabled={!canContinueStep0}
                  onClick={() => setStep(1)}
                >
                  Continue
                </PrimaryButton>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step-1"
                variants={stepVariants()}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <StepHeader
                  eyebrow="Step 2 of 4 (Optional)"
                  title="Connect your broker."
                  subtitle="Connect your brokerage to enable one-click trade execution with your approval. Or skip — all Byzant data modules work without a connected broker."
                />

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ width: "100%", maxWidth: 480 }}>
                    <BrokerCard
                      name="Alpaca"
                      desc="Commission-free API trading"
                      available
                      onConnect={() =>
                        setBrokerMessage(
                          "Coming soon — Alpaca connection will be available at launch."
                        )
                      }
                    />
                  </div>
                </div>

                {brokerMessage && (
                  <p
                    style={{
                      marginTop: 16,
                      fontFamily: SORA,
                      fontSize: 13,
                      color: INK_MUTED,
                      textAlign: "center",
                    }}
                  >
                    {brokerMessage}
                  </p>
                )}

                <p
                  style={{
                    marginTop: 24,
                    marginBottom: 20,
                    fontFamily: SORA,
                    fontSize: 14,
                    color: INK_MUTED,
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                >
                  More brokers coming soon.{" "}
                  <a
                    href="https://tally.so/r/byzant-broker-request"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: TEAL,
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    Vote for yours →
                  </a>
                </p>

                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div
                    style={{
                      width: "100%",
                      maxWidth: 480,
                      background: SURFACE,
                      border: "1px solid " + BORDER,
                      borderRadius: 10,
                      padding: 18,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: SORA,
                          fontSize: 15,
                          fontWeight: 500,
                          color: INK,
                          marginBottom: 4,
                        }}
                      >
                        Data modules only
                      </div>
                      <p
                        style={{
                          fontFamily: SORA,
                          fontSize: 12,
                          color: INK_MUTED,
                          margin: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        Use Byzant market intelligence without trade
                        execution. Connect a broker anytime later.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      style={{
                        width: "100%",
                        height: 38,
                        borderRadius: 999,
                        border: "1px solid " + BORDER,
                        background: "#1f1f1f",
                        color: INK,
                        fontFamily: SORA,
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "background 0.15s, border-color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#2a2a2a";
                        e.currentTarget.style.borderColor = BORDER_HI;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#1f1f1f";
                        e.currentTarget.style.borderColor = BORDER;
                      }}
                    >
                      Continue without broker →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                variants={stepVariants()}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <StepHeader
                  eyebrow="Step 3 of 4"
                  title="Which model powers your agent?"
                  subtitle="Byzant modules work with any MCP-compatible AI agent."
                />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    marginBottom: 24,
                  }}
                >
                  {AGENT_OPTIONS.map((opt) => {
                    const selected = agent === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setAgent(opt.key)}
                        style={{
                          textAlign: "left",
                          background: selected ? TEAL_DIM : SURFACE,
                          border:
                            "1px solid " + (selected ? TEAL : BORDER),
                          borderRadius: 8,
                          padding: "18px 20px",
                          cursor: "pointer",
                          transition:
                            "background 0.15s, border-color 0.15s",
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: 16,
                          fontFamily: SORA,
                        }}
                        onMouseEnter={(e) => {
                          if (!selected)
                            e.currentTarget.style.borderColor = BORDER_HI;
                        }}
                        onMouseLeave={(e) => {
                          if (!selected)
                            e.currentTarget.style.borderColor = BORDER;
                        }}
                      >
                        <span style={{ flex: 1 }}>
                          <span
                            style={{
                              display: "block",
                              fontFamily: SORA,
                              fontSize: 15,
                              fontWeight: 500,
                              color: INK,
                              marginBottom: 4,
                            }}
                          >
                            {opt.name}
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              color: INK_MUTED,
                              lineHeight: 1.5,
                              display: "block",
                            }}
                          >
                            {opt.desc}
                          </span>
                        </span>
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 999,
                            border:
                              "1px solid " + (selected ? TEAL : BORDER_HI),
                            flexShrink: 0,
                            marginTop: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {selected && (
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: 999,
                                background: TEAL,
                              }}
                            />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <BackButton onClick={() => setStep(1)} />
                  <PrimaryButton
                    disabled={!canContinueStep2}
                    onClick={() => setStep(3)}
                  >
                    Continue
                  </PrimaryButton>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                variants={stepVariants()}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <StepHeader
                  eyebrow="Step 4 of 4"
                  title="Set your risk profile."
                  subtitle="This helps your Risk Agent enforce the right rules for your account."
                />

                <QuestionBlock label="Account size">
                  <SegmentedGroup
                    options={ACCOUNT_SIZES}
                    value={accountSize}
                    onChange={setAccountSize}
                  />
                </QuestionBlock>

                <QuestionBlock label="Risk tolerance">
                  <SegmentedGroup
                    options={RISK_LEVELS}
                    value={riskTolerance}
                    onChange={setRiskTolerance}
                  />
                </QuestionBlock>

                <QuestionBlock label="Trading experience">
                  <SegmentedGroup
                    options={EXPERIENCE_LEVELS}
                    value={experience}
                    onChange={setExperience}
                  />
                </QuestionBlock>

                {error && (
                  <div
                    style={{
                      marginTop: 8,
                      marginBottom: 12,
                      padding: "10px 12px",
                      borderRadius: 8,
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      color: "#f87171",
                      fontFamily: SORA,
                      fontSize: 12,
                    }}
                  >
                    {error}
                  </div>
                )}

                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <BackButton onClick={() => setStep(2)} />
                  <PrimaryButton
                    disabled={!canFinish}
                    loading={submitting}
                    onClick={handleFinish}
                  >
                    Enter Byzant →
                  </PrimaryButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StepHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          fontFamily: SORA,
          fontSize: 12,
          fontWeight: 500,
          color: INK_MUTED,
          letterSpacing: "0.04em",
          marginBottom: 12,
        }}
      >
        {eyebrow}
      </div>
      <h1
        style={{
          fontFamily: SORA,
          fontSize: 28,
          fontWeight: 500,
          color: INK,
          letterSpacing: "-0.02em",
          margin: "0 0 10px",
          lineHeight: 1.2,
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontFamily: SORA,
          fontSize: 14,
          color: INK_MUTED,
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}

function QuestionBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          fontFamily: SORA,
          fontSize: 13,
          fontWeight: 500,
          color: INK,
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function BrokerCard({
  name,
  desc,
  available,
  onConnect,
}: {
  name: string;
  desc: string;
  available: boolean;
  onConnect?: () => void;
}) {
  return (
    <div
      style={{
        background: SURFACE,
        border: "1px solid " + (available ? TEAL : BORDER),
        borderRadius: 10,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        opacity: available ? 1 : 0.72,
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontFamily: SORA,
              fontSize: 15,
              fontWeight: 500,
              color: INK,
            }}
          >
            {name}
          </span>
          {!available && (
            <span
              style={{
                fontFamily: SORA,
                fontSize: 10,
                fontWeight: 500,
                color: INK_MUTED,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid " + BORDER,
                padding: "2px 8px",
                borderRadius: 999,
              }}
            >
              Coming soon
            </span>
          )}
        </div>
        <p
          style={{
            fontFamily: SORA,
            fontSize: 12,
            color: INK_MUTED,
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {desc}
        </p>
      </div>

      <button
        type="button"
        disabled={!available}
        onClick={onConnect}
        style={{
          width: "100%",
          height: 38,
          borderRadius: 999,
          border: "1px solid " + (available ? TEAL : BORDER),
          background: available ? TEAL : "transparent",
          color: available ? "#0a0a0a" : INK_MUTED,
          fontFamily: SORA,
          fontSize: 13,
          fontWeight: 500,
          cursor: available ? "pointer" : "not-allowed",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
          if (available) e.currentTarget.style.background = "#B2EBE5";
        }}
        onMouseLeave={(e) => {
          if (available) e.currentTarget.style.background = TEAL;
        }}
      >
        {available ? "Connect" : "Unavailable"}
      </button>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 52,
        padding: "0 24px",
        borderRadius: 999,
        border: "1px solid " + BORDER,
        background: "transparent",
        color: INK,
        fontFamily: SORA,
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
        transition: "background 0.15s, border-color 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = BORDER_HI;
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = BORDER;
        e.currentTarget.style.background = "transparent";
      }}
    >
      Back
    </button>
  );
}

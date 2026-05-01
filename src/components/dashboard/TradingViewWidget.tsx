"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

const SCRIPT_SRC =
  "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

export default function TradingViewWidget({
  symbol,
  height = 360,
  style = "1",
  onSymbolChange,
  onPriceChange,
}: {
  symbol: string;
  height?: number | string;
  style?: string;
  onSymbolChange?: (symbol: string) => void;
  onPriceChange?: (price: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  const onSymbolChangeRef = useRef(onSymbolChange);
  const onPriceChangeRef = useRef(onPriceChange);
  useEffect(() => {
    onSymbolChangeRef.current = onSymbolChange;
  }, [onSymbolChange]);
  useEffect(() => {
    onPriceChangeRef.current = onPriceChange;
  }, [onPriceChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const widgetHost = document.createElement("div");
    widgetHost.className = "tradingview-widget-container__widget";
    widgetHost.style.height = "100%";
    widgetHost.style.width = "100%";
    widgetHost.style.maxWidth = "100%";
    widgetHost.style.overflow = "hidden";
    container.appendChild(widgetHost);

    const config = {
      autosize: true,
      symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme,
      style,
      locale: "en",
      hide_top_toolbar: false,
      hide_legend: false,
      hide_side_toolbar: true,
      left_toolbar_hidden: true,
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      withdateranges: true,
      backgroundColor: theme === "dark" ? "#0a0a0a" : "#ffffff",
      gridColor: theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
      support_host: "https://www.tradingview.com",
    };

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify(config);
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [symbol, theme, style]);

  useEffect(() => {
    function extractSymbol(d: unknown): string | null {
      if (!d || typeof d !== "object") return null;
      const o = d as Record<string, unknown>;
      const candidates: unknown[] = [
        o.symbol,
        (o.data as Record<string, unknown> | undefined)?.symbol,
        (o.payload as Record<string, unknown> | undefined)?.symbol,
        o.ticker,
        (o.data as Record<string, unknown> | undefined)?.ticker,
      ];
      for (const c of candidates) {
        if (typeof c === "string" && c.length > 0 && c.length < 30) {
          const cleaned = c.includes(":") ? c.split(":").pop()! : c;
          if (/^[A-Z0-9._-]{1,20}$/.test(cleaned)) return cleaned;
        }
      }
      return null;
    }

    function extractPrice(d: unknown): number | null {
      if (!d || typeof d !== "object") return null;
      const o = d as Record<string, unknown>;
      const data = o.data as Record<string, unknown> | undefined;
      const candidates: unknown[] = [
        o.last_price,
        o.price,
        o.lp,
        data?.last_price,
        data?.price,
        data?.lp,
        data?.close,
      ];
      for (const c of candidates) {
        if (typeof c === "number" && isFinite(c) && c > 0) return c;
        if (typeof c === "string") {
          const n = parseFloat(c);
          if (isFinite(n) && n > 0) return n;
        }
      }
      return null;
    }

    const handle = (e: MessageEvent) => {
      const sym = extractSymbol(e.data);
      if (sym) onSymbolChangeRef.current?.(sym);
      const price = extractPrice(e.data);
      if (price !== null) onPriceChangeRef.current?.(price);
    };
    window.addEventListener("message", handle);
    return () => window.removeEventListener("message", handle);
  }, []);

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container"
      style={{
        width: "100%",
        height,
        minHeight: typeof height === "number" ? height : undefined,
        borderRadius: 6,
        overflow: "hidden",
      }}
    />
  );
}

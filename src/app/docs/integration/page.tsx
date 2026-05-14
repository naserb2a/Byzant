import type { Metadata } from "next";
import IntegrationGuide from "./IntegrationGuide";
import ByzantFooter from "@/components/ByzantFooter";

export const metadata: Metadata = {
  title: "Integration Guide — Byzant",
  description:
    "Connect your agent to Byzant's MCP marketplace. Available tools, code snippets for Claude Code, Claude Desktop, and custom agents.",
};

export default function IntegrationDocsPage() {
  return (
    <>
      <IntegrationGuide />
      <ByzantFooter />
    </>
  );
}

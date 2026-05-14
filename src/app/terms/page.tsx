import type { Metadata } from "next";
import LegalShell, {
  H1,
  LastUpdated,
  MailLink,
  P,
  Section,
  UL,
} from "@/components/LegalShell";
import ByzantFooter from "@/components/ByzantFooter";

export const metadata: Metadata = {
  title: "Terms of Service — Byzant",
  description:
    "Byzant Terms of Service. Byzant is a data and infrastructure marketplace for AI trading agents; users approve every trade.",
};

export default function TermsPage() {
  return (
    <>
      <LegalShell>
        <H1>Terms of Service</H1>
      <LastUpdated date="May 11, 2026" />

      <Section number={1} title="Acceptance of Terms" needsReview>
        <P>
          These Terms of Service (the &ldquo;Terms&rdquo;) govern your access to
          and use of Byzant (the &ldquo;Service&rdquo;), operated by Byzant LLC.
          (&ldquo;Byzant,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or
          &ldquo;us&rdquo;). By accessing, browsing, or using the Service, you
          agree to be bound by these Terms. If you do not agree, you must not
          access or use the Service.
        </P>
        <P>
          You must be at least 18 years old, legally capable of entering into a
          binding contract in your jurisdiction, and not prohibited from using
          the Service under applicable law to create an account.
        </P>
      </Section>

      <Section number={2} title="Description of Service">
        <P>
          Byzant is a data and infrastructure marketplace that connects users
          and their AI trading agents to modular capabilities, including market
          data feeds, signal modules, risk modules, and strategy bots. Byzant is
          the infrastructure layer; it is not a broker-dealer, investment
          adviser, or fiduciary, and does not execute trades directly.
        </P>
        <P>
          All trade execution occurs through brokerage accounts that you
          independently maintain with third-party brokers (Alpaca at launch).
          Every trade that an AI agent surfaces through Byzant requires your
          explicit approval before it is routed to your broker. You are the
          arbiter of every transaction. You retain full discretion to approve,
          modify, or decline any agent-proposed action.
        </P>
      </Section>

      <Section number={3} title="Not Financial Advice">
        <P>
          All content, signals, agent reasoning, module outputs, charts, and
          other information made available through the Service are provided for
          informational and educational purposes only. Nothing on the Service
          constitutes investment, financial, tax, legal, accounting, or other
          professional advice, nor a recommendation to buy, sell, or hold any
          security or other financial instrument.
        </P>
        <P>
          You are solely responsible for your own investment decisions and for
          consulting a qualified, licensed professional before acting on any
          information provided through the Service.
        </P>
      </Section>

      <Section number={4} title="User Responsibilities">
        <P>By using the Service, you agree to:</P>
        <UL>
          <li>Maintain the confidentiality and security of your account credentials.</li>
          <li>Comply with the terms of service of any connected broker.</li>
          <li>Comply with all applicable securities laws and regulations in your jurisdiction.</li>
          <li>Provide accurate, current, and complete information.</li>
          <li>Refrain from abusing rate limits, scraping, reverse-engineering, or attempting to bypass access controls.</li>
          <li>Use the Service only for lawful purposes and not on behalf of any prohibited person or entity.</li>
        </UL>
      </Section>

      <Section number={5} title="Risk Disclosure">
        <P>
          Trading securities, derivatives, options, and other financial
          instruments involves substantial risk of loss, including the possible
          loss of all principal invested. Past performance is not indicative of
          future results.
        </P>
        <P>
          AI agents and the modules surfaced through Byzant do not guarantee
          profitability or freedom from loss. Signals, conviction scores,
          institutional flow data, and any other quantitative output may be
          incomplete, delayed, inaccurate, or misleading. Options strategies,
          leveraged products, and unusual options activity flagged by Byzant
          modules carry heightened risk.
        </P>
        <P>
          You should only invest capital you can afford to lose, and you should
          carefully review the risk disclosures of your broker before trading.
        </P>
      </Section>

      <Section number={6} title="Subscription and Billing" needsReview>
        <P>
          Byzant operates on a pay-per-module subscription model. Each module
          you activate is billed at the price displayed at the time of
          activation, on a recurring monthly basis, until canceled.
          Subscriptions renew automatically at the end of each billing cycle.
        </P>
        <P>
          You may cancel any module subscription at any time from your account
          settings. Cancellation takes effect at the end of the current billing
          cycle; you retain access until that date. Refunds are at Byzant&rsquo;s
          sole discretion except where required by applicable law.
        </P>
      </Section>

      <Section number={7} title="Intellectual Property">
        <P>
          The Service, including all software, brand assets, module designs,
          data schemas, documentation, and user interface elements, is owned by
          Byzant or its licensors and is protected by copyright, trademark, and
          other intellectual property laws. We grant you a limited,
          non-exclusive, non-transferable, revocable license to access and use
          the Service in accordance with these Terms.
        </P>
        <P>
          You retain all rights to your own agent configurations, trading
          history, and any data you generate while using the Service, subject
          to the licenses granted to Byzant in the Privacy Policy for operating
          and improving the Service.
        </P>
      </Section>

      <Section number={8} title="Limitation of Liability" needsReview>
        <P>
          To the maximum extent permitted by applicable law, Byzant and its
          officers, employees, agents, and affiliates shall not be liable for
          any indirect, incidental, special, consequential, exemplary, or
          punitive damages, including without limitation loss of profits, loss
          of trading capital, loss of data, loss of goodwill, or any damages
          arising from third-party module performance, brokerage outages, data
          provider inaccuracies, or your own trading decisions.
        </P>
        <P>
          Byzant&rsquo;s total aggregate liability arising out of or related to
          the Service shall not exceed the amounts you paid to Byzant in the
          twelve (12) months preceding the event giving rise to the claim, or
          one hundred U.S. dollars ($100), whichever is greater.
        </P>
      </Section>

      <Section number={9} title="Termination">
        <P>
          Byzant may suspend or terminate your account at any time, with or
          without notice, for any breach of these Terms, suspected fraud or
          abuse, or for any other reason at our sole discretion. Upon
          termination, your right to access the Service ceases immediately.
        </P>
        <P>
          You may close your account at any time by contacting us. Sections
          relating to intellectual property, limitation of liability,
          governing law, and indemnification survive termination.
        </P>
      </Section>

      <Section number={10} title="Governing Law" needsReview>
        <P>
          These Terms are governed by and construed in accordance with the laws
          of the State of Delaware, without regard to its conflict of laws
          principles. Any dispute arising out of or in connection with these
          Terms shall be resolved exclusively in the state or federal courts
          located in Delaware, and you consent to the personal jurisdiction of
          such courts.
        </P>
      </Section>

      <Section number={11} title="Contact">
        <P>
          Questions about these Terms can be directed to{" "}
          <MailLink email="legal@byzant.ai" />.
        </P>
      </Section>
      </LegalShell>
      <ByzantFooter />
    </>
  );
}

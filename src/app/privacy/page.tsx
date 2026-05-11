import type { Metadata } from "next";
import LegalShell, {
  H1,
  LastUpdated,
  MailLink,
  P,
  Section,
  UL,
} from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy — Byzant",
  description:
    "Byzant Privacy Policy. How we collect, use, share, and protect your data — including broker OAuth tokens and usage analytics.",
};

export default function PrivacyPage() {
  return (
    <LegalShell>
      <H1>Privacy Policy</H1>
      <LastUpdated date="May 11, 2026" />

      <Section number={1} title="Information We Collect">
        <P>We collect the following categories of information:</P>
        <UL>
          <li>
            <strong>Account data</strong> — email address (via Supabase
            authentication), optional display name, password hash, account
            creation date, and authentication provider identifiers (e.g.
            Google OAuth subject identifier).
          </li>
          <li>
            <strong>Usage data</strong> — pages visited, modules activated,
            agent approvals and declines, search queries, IP address, device
            and browser metadata, and approximate geolocation derived from IP.
          </li>
          <li>
            <strong>Broker connection data</strong> — OAuth access and refresh
            tokens issued by your broker (Alpaca at launch), broker account
            identifiers, and the metadata required to read positions and submit
            user-approved orders.
          </li>
          <li>
            <strong>Agent configuration</strong> — model selection, system
            prompts you author, module installations, risk-rule settings, and
            other configuration you provide.
          </li>
        </UL>
      </Section>

      <Section number={2} title="How We Use Your Information">
        <P>We use the information we collect to:</P>
        <UL>
          <li>Operate, maintain, and improve the Service.</li>
          <li>
            Authenticate you, route approvals, and surface agent activity in
            your dashboard.
          </li>
          <li>
            Provide customer support and communicate with you about your
            account, security alerts, and Service updates.
          </li>
          <li>
            Detect, investigate, and prevent fraudulent, malicious, or abusive
            activity.
          </li>
          <li>Comply with applicable legal obligations and respond to lawful requests.</li>
          <li>
            Analyze aggregate usage to inform product decisions, in a manner
            that does not identify individual users.
          </li>
        </UL>
      </Section>

      <Section number={3} title="Data Sharing" needsReview>
        <P>
          We do not sell your personal information. We share information only
          in the following circumstances:
        </P>
        <UL>
          <li>
            With infrastructure providers operating under contractual data
            protection obligations, including Supabase (auth and database),
            Vercel (hosting), and Apify (data scraping infrastructure).
          </li>
          <li>
            With brokerage partners, only to the extent necessary to read your
            positions and submit orders that you have explicitly approved
            (Alpaca at launch).
          </li>
          <li>
            With law enforcement, regulators, or other parties where we
            reasonably believe disclosure is required by applicable law,
            subpoena, court order, or to protect the rights, property, or
            safety of Byzant, our users, or the public.
          </li>
          <li>
            With a successor entity in connection with a merger, acquisition,
            financing, reorganization, or sale of assets, subject to
            confidentiality protections.
          </li>
        </UL>
      </Section>

      <Section number={4} title="Data Security">
        <P>
          We employ industry-standard administrative, technical, and physical
          safeguards to protect your information, including encryption in
          transit (TLS) and at rest (managed encryption through our database
          provider), least-privilege access controls, role-based row-level
          security policies, and periodic security reviews.
        </P>
        <P>
          No system is perfectly secure. While we work to protect your data,
          we cannot guarantee absolute security and you use the Service at your
          own risk. Please notify us immediately if you believe your account
          has been compromised.
        </P>
      </Section>

      <Section number={5} title="Broker Data">
        <P>
          When you connect your brokerage account, you authorize Byzant to
          access it through your broker&rsquo;s OAuth flow. We store the OAuth
          access and refresh tokens issued by your broker in encrypted form so
          that we can read your positions and submit orders that you have
          explicitly approved.
        </P>
        <P>
          We <strong>do not</strong> store your broker login credentials,
          password, two-factor secrets, or any information that would allow us
          to log in to your brokerage account directly. The OAuth tokens we
          hold are scoped to the permissions you granted at connection time and
          can be revoked at any time through your broker&rsquo;s account
          settings or by disconnecting your broker in Byzant settings.
        </P>
      </Section>

      <Section number={6} title="Cookies and Analytics" needsReview>
        <P>
          We use cookies and similar technologies for two purposes:
        </P>
        <UL>
          <li>
            <strong>Functional</strong> — to keep you signed in, remember your
            preferences (such as theme), and operate the Service. These cannot
            be disabled without breaking the Service.
          </li>
          <li>
            <strong>Analytics</strong> — to understand aggregate, anonymous
            usage patterns and improve the Service.
          </li>
        </UL>
        <P>
          You can configure your browser to block or alert you about cookies,
          but some parts of the Service may not function correctly without
          them.
        </P>
      </Section>

      <Section number={7} title="User Rights" needsReview>
        <P>
          Depending on your jurisdiction, you may have the right to access,
          correct, port, restrict, or delete the personal information we hold
          about you, and to object to certain processing. To exercise any of
          these rights, contact us at{" "}
          <MailLink email="legal@byzant.ai" />. We will respond within the
          timeframe required by applicable law.
        </P>
        <P>
          You may also close your Byzant account at any time, which will
          initiate deletion of your personal information subject to the
          retention periods described below and any legal obligations that
          require us to retain certain records.
        </P>
      </Section>

      <Section number={8} title="Data Retention" needsReview>
        <P>
          We retain your personal information for as long as your account is
          active and for a limited period thereafter to comply with legal,
          accounting, regulatory, fraud-prevention, and audit obligations.
          Encrypted broker tokens are deleted promptly when you disconnect your
          broker or close your account. Aggregate, anonymized analytics may be
          retained indefinitely as it cannot be associated with any individual.
        </P>
      </Section>

      <Section number={9} title="Changes to This Policy">
        <P>
          We may update this Privacy Policy from time to time. When we make
          material changes, we will provide notice through the Service, by
          email to the address associated with your account, or both, at least
          30 days before the changes take effect. Your continued use of the
          Service after the effective date of the updated policy constitutes
          your acceptance of the changes.
        </P>
      </Section>

      <Section number={10} title="Contact">
        <P>
          Questions about this Privacy Policy, or requests to exercise the
          rights described above, can be directed to{" "}
          <MailLink email="legal@byzant.ai" />.
        </P>
      </Section>
    </LegalShell>
  );
}

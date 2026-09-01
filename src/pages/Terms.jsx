import { PageWrapper, Section, SectionLabel, Heading, GradText, useTheme } from "../components.jsx";

export default function Terms() {
  const { dark } = useTheme();
  const headingColor = dark ? "#fff"                 : "#1A1408";
  const mutedText    = dark ? "rgba(255,255,255,.5)"  : "rgba(26,20,8,.62)";
  const mutedText2   = dark ? "rgba(255,255,255,.4)"  : "rgba(26,20,8,.55)";
  const cardBg       = dark ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))" : "linear-gradient(135deg,rgba(255,255,255,.45),rgba(255,255,255,.2))";
  const cardBorder   = dark ? "rgba(255,255,255,.12)" : "rgba(26,20,8,.18)";

  const sections = [
    {
      title: "Agreement to Terms",
      body: "By accessing or using the Bode Conversion Lab website, free audit tool, or any paid service ('Services'), you agree to be bound by these Terms of Service. If you do not agree, please do not use our Services."
    },
    {
      title: "Description of Services",
      body: "Bode Conversion Lab provides e-commerce store audits, conversion rate optimization, ad management, landing page, and email flow services. The free audit tool provides an automated, estimate-based report on your store's technical and conversion performance — it is a diagnostic starting point, not a guarantee of any specific outcome."
    },
    {
      title: "No Guarantee of Results",
      body: "Revenue, conversion rate, ROAS, and traffic figures referenced on this site — including in case studies, testimonials, and audit reports — are illustrative or based on specific past results and are not a promise of similar outcomes for your store. E-commerce performance depends on many factors outside our control, including your market, product, pricing, and platform."
    },
    {
      title: "Paid Services & Payment",
      body: "Paid packages are billed as described at the time of purchase and processed securely through Paystack. By purchasing a package, you agree to pay the listed price. Specific scope, deliverables, and timelines for paid work will be confirmed with you directly before work begins."
    },
    {
      title: "Refunds & Cancellations",
      body: "Refund eligibility depends on the specific package and how much work has already been delivered at the time of a cancellation request. Contact us directly at bodeagencyofficial@gmail.com to discuss any refund or cancellation — we handle these on a case-by-case basis and will always respond in good faith."
    },
    {
      title: "Client Responsibilities",
      body: "To deliver our Services effectively, we may need timely access to your store, ad accounts, or other systems, and timely feedback/approvals from you. Delays in providing access or feedback may affect project timelines and results."
    },
    {
      title: "Intellectual Property",
      body: "All content on this website — including copy, design, the Bode Conversion Lab name and logo, and our audit methodology — is our property and may not be copied or reproduced without permission. Deliverables created specifically for a paying client (e.g. ad creative, landing pages) become that client's property upon full payment, unless otherwise agreed in writing."
    },
    {
      title: "Limitation of Liability",
      body: "Bode Conversion Lab is not liable for indirect, incidental, or consequential damages arising from use of our Services or website, including losses related to store downtime, third-party platform changes (e.g. Shopify, Meta, Google), or business decisions made based on our audit reports or recommendations."
    },
    {
      title: "Third-Party Platforms",
      body: "Our Services may involve third-party platforms (Shopify, Meta Ads, Google Ads, WhatsApp Business, payment processors, etc.). We are not responsible for outages, policy changes, or account actions taken by these third parties."
    },
    {
      title: "Termination",
      body: "We reserve the right to suspend or terminate access to our Services for any user who misuses the website, the free audit tool, or engages in fraudulent or abusive behavior."
    },
    {
      title: "Changes to These Terms",
      body: "We may update these Terms of Service from time to time. Continued use of our Services after changes are posted constitutes acceptance of the updated terms."
    },
    {
      title: "Governing Law",
      body: "These terms are governed by the laws of the State of New York, United States, without regard to conflict-of-law principles."
    },
    {
      title: "Contact Us",
      body: "If you have any questions about these Terms of Service, please reach out to us at bodeagencyofficial@gmail.com."
    },
  ];

  return (
    <PageWrapper>
      <Section>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 0" }}>
          <SectionLabel>Legal</SectionLabel>
          <Heading size="2rem">
            Terms of <GradText>Service</GradText>
          </Heading>
          <p style={{ fontSize: 13, color: mutedText2, marginTop: ".5rem", marginBottom: "2.5rem" }}>
            Last updated: August 2026
          </p>

          <p style={{ fontSize: 15, color: mutedText, lineHeight: 1.8, marginBottom: "2rem" }}>
            These Terms of Service ("Terms") govern your use of the Bode Conversion Lab website and
            services. Please read them carefully before using our free audit tool or purchasing a package.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {sections.map((s, i) => (
              <div
                key={i}
                style={{
                  background: cardBg,
                  border: `.5px solid ${cardBorder}`,
                  borderRadius: 16,
                  padding: "1.5rem 1.7rem",
                }}
              >
                <h3
                  style={{
                    fontFamily:"'Space Grotesk',sans-serif",
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    color: headingColor,
                    marginBottom: ".6rem",
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, color: mutedText, lineHeight: 1.75, margin: 0 }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
}
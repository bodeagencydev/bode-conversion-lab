import { PageWrapper, Section, SectionLabel, Heading, GradText, useTheme } from "../components.jsx";

export default function Privacy() {
  const { dark } = useTheme();
  const headingColor = dark ? "#fff"                 : "#1A1408";
  const mutedText    = dark ? "rgba(255,255,255,.5)"  : "rgba(26,20,8,.62)";
  const mutedText2   = dark ? "rgba(255,255,255,.4)"  : "rgba(26,20,8,.55)";
  const cardBg       = dark ? "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))" : "linear-gradient(135deg,rgba(255,255,255,.45),rgba(255,255,255,.2))";
  const cardBorder   = dark ? "rgba(255,255,255,.12)" : "rgba(26,20,8,.18)";

  const sections = [
    {
      title: "Who We Are",
      body: "This site is operated by Bode Conversion Lab, New York, United States. For any question about how your data is handled, or to exercise any of the rights below, contact us at bodeagencyofficial@gmail.com."
    },
    {
      title: "Information We Collect",
      body: "When you use Bode Conversion Lab's website, we may collect: your name and email address (via our contact form or free resource popups); your store URL (when you request an audit or submit an application); your phone number (optional, if provided for WhatsApp contact); and payment details (processed directly by our payment provider — we never see or store your card information)."
    },
    {
      title: "The Free Audit Tool",
      body: "When you submit a store URL to our free audit tool, we scan the publicly available version of that page using Google's PageSpeed Insights API to generate a performance and conversion report. We do not access any private or backend systems of your store."
    },
    {
      title: "How We Use Your Information",
      body: "We use the information you provide to: respond to your inquiries and applications; deliver requested resources (such as our free checklist); process payments for services purchased; send service-related updates via email or WhatsApp; and improve our website and services based on general visit patterns."
    },
    {
      title: "Payment Processing",
      body: "Payments made on this site are processed securely by Paystack. We do not store your card number, expiry date, or CVV on our servers at any point — that information is handled entirely within Paystack's secure payment environment."
    },
    {
      title: "WhatsApp Communication",
      body: "If you message us on WhatsApp, we may use automated tools to respond to common questions and route your message appropriately. Your message content and phone number are used solely to respond to your inquiry and are not shared with unrelated third parties."
    },
    {
      title: "Analytics & Site Visits",
      body: "We collect general, non-identifying visit information — such as device type, browser, approximate location, referral source, and pages viewed — to understand how visitors use our site and to improve it. This data is used internally and is not sold to third parties."
    },
    {
      title: "Third-Party Services",
      body: "We work with a small number of trusted third-party services to operate this site, including Paystack (payments), Formspree (form submissions), Google (PageSpeed API and fonts), Vercel (website hosting), and Meta's WhatsApp Business Platform (messaging). Each of these providers has its own privacy policy governing how they handle data."
    },
    {
      title: "Your Rights",
      body: "You can request access to, correction of, or deletion of any personal information we hold about you at any time by contacting us directly. We will respond to any such request within a reasonable timeframe. Depending on where you live, this may include rights under the EU/UK GDPR, Nigeria's Data Protection Act, or applicable US state privacy laws — we honor these requests the same way regardless of which region they come from."
    },
    {
      title: "Data Retention",
      body: "We keep the information you provide for as long as needed to respond to your inquiry, deliver a purchased service, or meet our own legal and accounting obligations — after that, it's deleted or anonymized. Payment records are retained only as long as required by Paystack and applicable financial regulations."
    },
    {
      title: "International Data Transfers",
      body: "Because we work with providers like Vercel, Google, Formspree, Paystack, and Meta, your information may be processed on servers located outside your own country, including in the United States. Each provider maintains its own safeguards for handling data across borders."
    },
    {
      title: "Children's Privacy",
      body: "Our services are directed at business owners and are not intended for anyone under 18. We do not knowingly collect personal information from children. If you believe a minor has provided us information, contact us and we'll remove it."
    },
    {
      title: "Cookies",
      body: "We use one preference cookie to remember your theme (dark/light mode), which is only set after you accept it in the cookie banner. We also use a short-lived, session-only marker to avoid showing you the same popup repeatedly during one visit — this clears itself when you close the tab and is treated as strictly necessary for the site to work as expected. We do not use third-party advertising or tracking cookies. You can change your choice anytime via \"Cookie Preferences\" in the footer."
    },
    {
      title: "Changes to This Policy",
      body: "We may update this privacy policy from time to time to reflect changes in our practices or for legal reasons. Any updates will be posted on this page."
    },
    {
      title: "Contact Us",
      body: "If you have any questions about this privacy policy or how your information is handled, please reach out to us at bodeagencyofficial@gmail.com."
    },
  ];

  return (
    <PageWrapper>
      <Section>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 0" }}>
          <SectionLabel>Legal</SectionLabel>
          <Heading size="2rem">
            Privacy <GradText>Policy</GradText>
          </Heading>
          <p style={{ fontSize: 13, color: mutedText2, marginTop: ".5rem", marginBottom: "2.5rem" }}>
            Last updated: July 2026
          </p>

          <p style={{ fontSize: 15, color: mutedText, lineHeight: 1.8, marginBottom: "2rem" }}>
            Bode Conversion Lab ("we," "us," or "our") respects your privacy. This policy explains what
            information we collect when you use our website, how we use it, and the choices you have.
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
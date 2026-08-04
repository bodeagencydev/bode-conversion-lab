import { Document, Page, Text, View, StyleSheet, Font, Svg, Path, Circle } from "@react-pdf/renderer";

/* ─────────────────────────────────────────────────────────
   BCL AUDIT PDF REPORTS
   Three separate documents: Problems, Fixes, Growth & Marketing.
   Design intent: this is a PRINTED REPORT, not the neon dark
   website. Top audit tools (Ahrefs, SEMrush, Hotjar-style PDFs)
   use light backgrounds, restrained accent color, real vector
   type, and generous whitespace — that's what reads as premium
   on paper/screen-as-paper. A black-and-neon PDF looks like a
   screenshot, not a report.
───────────────────────────────────────────────────────── */

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.ttf", fontWeight: 800 },
  ],
});

const GREEN = "#00A35C";
const INK = "#141414";
const MUTED = "#5B5B5B";
const FAINT = "#8C8C8C";
const LINE = "#E4E4E4";
const CARD = "#F7F8F7";
const SEV = { critical: "#D8382A", high: "#C97A12", medium: "#9A8600", low: GREEN };

const s = StyleSheet.create({
  page: { fontFamily: "Inter", fontSize: 10.5, color: INK, padding: "48 44 56", backgroundColor: "#FFFFFF" },
  coverPage: { fontFamily: "Inter", padding: "64 48", backgroundColor: "#FFFFFF", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  kicker: { fontSize: 9, color: GREEN, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 10 },
  h1: { fontSize: 26, fontWeight: 800, color: INK, lineHeight: 1.15, marginBottom: 8 },
  h2: { fontSize: 15, fontWeight: 800, color: INK, marginBottom: 4 },
  sub: { fontSize: 10.5, color: MUTED, lineHeight: 1.55 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottom: `1 solid ${LINE}`, paddingBottom: 10, marginBottom: 22 },
  brand: { fontSize: 10, fontWeight: 800, color: INK },
  brandTag: { fontSize: 8, color: FAINT },
  pageNum: { fontSize: 8, color: FAINT },
  sectionTitle: { fontSize: 13, fontWeight: 800, color: INK, marginTop: 22, marginBottom: 10, borderLeft: `3 solid ${GREEN}`, paddingLeft: 8 },
  card: { backgroundColor: CARD, borderRadius: 6, padding: 14, marginBottom: 10, border: `1 solid ${LINE}` },
  badgeRow: { flexDirection: "row", alignItems: "center", marginBottom: 6, gap: 6 },
  sevBadge: { fontSize: 7.5, fontWeight: 700, color: "#FFFFFF", paddingVertical: 2, paddingHorizontal: 6, borderRadius: 3, textTransform: "uppercase", marginRight: 6 },
  catLabel: { fontSize: 8, color: FAINT },
  itemTitle: { fontSize: 11.5, fontWeight: 700, color: INK, marginBottom: 4 },
  body: { fontSize: 9.7, color: MUTED, lineHeight: 1.6, marginBottom: 5 },
  impact: { fontSize: 9, color: INK, fontStyle: "italic" },
  metaGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 4, marginBottom: 18 },
  metaCell: { width: "25%", paddingRight: 10, marginBottom: 10 },
  metaLabel: { fontSize: 7.5, color: FAINT, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 },
  metaVal: { fontSize: 16, fontWeight: 800 },
  footer: { position: "absolute", bottom: 28, left: 44, right: 44, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, color: FAINT, borderTop: `0.5 solid ${LINE}`, paddingTop: 8 },
  phaseTag: { fontSize: 8.5, fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, marginTop: 16 },
  lockNote: { fontSize: 9, color: FAINT, fontStyle: "italic", marginTop: 4 },
});

function Header({ label }) {
  return (
    <View style={s.headerRow} fixed>
      <View><Text style={s.brand}>BODE CONVERSION LAB</Text><Text style={s.brandTag}>We don't run ads. We engineer ROAS.</Text></View>
      <Text style={s.brandTag}>{label}</Text>
    </View>
  );
}

function Footer({ domain }) {
  return (
    <View style={s.footer} fixed>
      <Text>bodeconversionlab.vercel.app · {domain}</Text>
      <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );
}

function ScoreRing({ score, size = 74 }) {
  const r = size / 2 - 6;
  const c = 2 * Math.PI * r;
  const dash = (Math.max(0, Math.min(100, score)) / 100) * c;
  const color = score > 74 ? GREEN : score > 49 ? "#C97A12" : "#D8382A";
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={size / 2} cy={size / 2} r={r} stroke="#E4E4E4" strokeWidth={6} fill="none" />
      <Circle
        cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={6} fill="none"
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <Text x={size / 2} y={size / 2 + 5} style={{ fontSize: 16, fontWeight: 800 }} textAnchor="middle">{score}</Text>
    </Svg>
  );
}

function Cover({ kicker, title, domain, date, overall, grade, extraNote }) {
  return (
    <Page size="A4" style={s.coverPage}>
      <View>
        <Text style={{ fontSize: 11, fontWeight: 800, marginBottom: 40 }}>BODE CONVERSION LAB</Text>
        <Text style={s.kicker}>{kicker}</Text>
        <Text style={s.h1}>{title}</Text>
        <Text style={s.sub}>{domain}</Text>
        <Text style={{ ...s.sub, marginTop: 4 }}>Generated {date}</Text>
      </View>

      {overall != null && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
          <ScoreRing score={overall} size={90} />
          <View>
            <Text style={{ fontSize: 9, color: FAINT, textTransform: "uppercase", letterSpacing: 1 }}>Overall Score</Text>
            <Text style={{ fontSize: 22, fontWeight: 800 }}>{overall}/100 · Grade {grade}</Text>
            {extraNote && <Text style={{ ...s.sub, marginTop: 4, maxWidth: 340 }}>{extraNote}</Text>}
          </View>
        </View>
      )}

      <View>
        <Text style={{ fontSize: 8, color: FAINT, lineHeight: 1.6 }}>
          This report is confidential and prepared specifically for the store owner named above. Figures are estimates based on automated technical analysis, not a guarantee of results.
        </Text>
      </View>
    </Page>
  );
}

/* ═══════════════ 1. PROBLEMS REPORT (free / diagnosis tier) ═══════════════
   Deliberately stops at "here's what's wrong and what it's costing you" —
   no fix instructions. That's the paid report's job. */
export function ProblemsPDF({ storeUrl, analysis, date }) {
  const domain = analysis.domain;
  return (
    <Document title={`BCL Problem Report — ${domain}`}>
      <Cover
        kicker="Store Diagnosis"
        title="What's Actually Wrong With Your Store"
        domain={domain}
        date={date}
        overall={analysis.overall}
        grade={analysis.grade}
        extraNote={analysis.verdict}
      />

      <Page size="A4" style={s.page}>
        <Header label="Problem Report" />
        <Text style={s.sectionTitle}>Where the revenue is leaking</Text>
        <View style={s.metaGrid}>
          {Object.values(analysis.metrics).map((v, i) => (
            <View key={i} style={s.metaCell}>
              <Text style={s.metaLabel}>{v.label}</Text>
              <Text style={{ ...s.metaVal, color: v.score > 74 ? GREEN : v.score > 49 ? "#C97A12" : "#D8382A" }}>{v.score}</Text>
            </View>
          ))}
        </View>

        <Text style={s.sectionTitle}>{analysis.findings.length} Problems Found</Text>
        {analysis.findings.map((f, i) => (
          <View key={i} style={s.card} wrap={false}>
            <View style={s.badgeRow}>
              <Text style={{ ...s.sevBadge, backgroundColor: SEV[f.severity] }}>{f.severity}</Text>
              <Text style={s.catLabel}>{f.category}</Text>
            </View>
            <Text style={s.itemTitle}>{f.title}</Text>
            <Text style={s.body}>{f.finding}</Text>
            <Text style={s.impact}>Estimated impact: {f.impact}</Text>
          </View>
        ))}

        <View style={{ ...s.card, backgroundColor: "#F1FBF6", border: `1 solid ${GREEN}`, marginTop: 8 }} wrap={false}>
          <Text style={{ ...s.itemTitle, color: GREEN }}>This report shows you what's broken — not how to fix it</Text>
          <Text style={s.body}>
            The exact fix for each issue above, in priority order with implementation detail, is in the separate Fixes Report.
            The plan to turn this into consistent traffic and revenue is in the Growth & Marketing Report. Both unlock with a paid package.
          </Text>
        </View>
        <Footer domain={domain} />
      </Page>
    </Document>
  );
}

/* ═══════════════ 2. FIXES REPORT (paid) ═══════════════ */
export function FixesPDF({ analysis, solution, date }) {
  const domain = analysis.domain;
  const { fixing } = solution;
  return (
    <Document title={`BCL Fixes Report — ${domain}`}>
      <Cover kicker="Priority Action Plan" title="The Fixes — In Priority Order" domain={domain} date={date} />
      <Page size="A4" style={s.page}>
        <Header label="Fixes Report" />
        <Text style={s.sub}>Stop the bleeding first. Fix in this order — each phase builds on the last.</Text>
        {fixing.phases.map((phase, pi) => (
          <View key={pi}>
            <Text style={s.phaseTag}>{phase.phase}</Text>
            {phase.items.map((item, i) => (
              <View key={i} style={s.card} wrap={false}>
                <Text style={s.itemTitle}>{item.title}</Text>
                <Text style={s.body}>{item.action}</Text>
                <Text style={{ fontSize: 8.5, color: GREEN, fontWeight: 700 }}>{item.metric}</Text>
              </View>
            ))}
          </View>
        ))}
        <Footer domain={domain} />
      </Page>
    </Document>
  );
}

/* ═══════════════ 3. GROWTH & MARKETING REPORT (paid) ═══════════════ */
export function GrowthMarketingPDF({ analysis, solution, date }) {
  const domain = analysis.domain;
  const { growth, marketing } = solution;
  return (
    <Document title={`BCL Growth & Marketing Plan — ${domain}`}>
      <Cover kicker="90–120 Day System" title="Growth & Marketing Plan" domain={domain} date={date} />
      <Page size="A4" style={s.page}>
        <Header label="Growth & Marketing Report" />
        <Text style={s.sectionTitle}>{growth.title}</Text>
        <Text style={s.sub}>{growth.subtitle}</Text>
        {growth.phases.map((phase, pi) => (
          <View key={pi}>
            <Text style={s.phaseTag}>{phase.phase}</Text>
            {phase.items.map((item, i) => (
              <View key={i} style={s.card} wrap={false}>
                <Text style={s.itemTitle}>{item.title}</Text>
                <Text style={s.body}>{item.action}</Text>
                <Text style={{ fontSize: 8.5, color: GREEN, fontWeight: 700 }}>{item.metric}</Text>
              </View>
            ))}
          </View>
        ))}

        <Text style={s.sectionTitle}>{marketing.title}</Text>
        <Text style={s.sub}>{marketing.subtitle}</Text>
        {marketing.phases.map((phase, pi) => (
          <View key={pi}>
            <Text style={s.phaseTag}>{phase.phase}</Text>
            {phase.items.map((item, i) => (
              <View key={i} style={s.card} wrap={false}>
                <Text style={s.itemTitle}>{item.title}</Text>
                <Text style={s.body}>{item.action}</Text>
                <Text style={{ fontSize: 8.5, color: GREEN, fontWeight: 700 }}>{item.metric}</Text>
              </View>
            ))}
          </View>
        ))}
        <Footer domain={domain} />
      </Page>
    </Document>
  );
}

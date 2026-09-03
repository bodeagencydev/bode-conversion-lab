import { Document, Page, Text, View, StyleSheet, Font, Svg, Path, Circle } from "@react-pdf/renderer";

/* ─────────────────────────────────────────────────────────
   BCL AUDIT PDF REPORTS — v2
   Modeled directly on the Ahrefs/SEOptimer report language:
   big score gauge on the cover, a pass/warn/fail checklist
   with colored status dots for Core Web Vitals, issues grouped
   by category with compact status-dot rows (not one big padded
   card per issue), and an issue-count summary strip up top.
───────────────────────────────────────────────────────── */

Font.register({
  family: "IBM Plex Sans",
  fonts: [
    { src: "/fonts/IBMPlexSans-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/IBMPlexSans-SemiBold.ttf", fontWeight: 600 },
    { src: "/fonts/IBMPlexSans-Bold.ttf", fontWeight: 700 },
  ],
});

Font.register({
  family: "Space Grotesk",
  fonts: [
    { src: "/fonts/SpaceGrotesk-Medium.ttf", fontWeight: 500 },
    { src: "/fonts/SpaceGrotesk-Bold.ttf", fontWeight: 700 },
  ],
});

const GREEN = "#00C853";
const RED   = "#FF3B30";
const AMBER = "#FF9500";
const INK   = "#141414";
const MUTED = "#5B5B5B";
const FAINT = "#8C8C8C";
const LINE  = "#E4E4E4";
const CARD  = "#F7F8F7";
const SEV   = { critical: RED, high: AMBER, medium: "#9A8600", low: GREEN };
const STATUS = { good: GREEN, warn: AMBER, fail: RED };

const s = StyleSheet.create({
  page: { fontFamily:"IBM Plex Sans", fontSize: 9.5, color: INK, padding: "44 42 56", backgroundColor: "#FFFFFF" },
  coverPage: { fontFamily:"IBM Plex Sans", padding: "60 48", backgroundColor: "#FFFFFF", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  kicker: { fontSize: 9, color: GREEN, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 10 },
  h1: { fontFamily:"Space Grotesk", fontSize: 30, fontWeight: 700, color: INK, lineHeight: 1.12, marginBottom: 10 },
  sub: { fontSize: 10, color: MUTED, lineHeight: 1.55 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottom: `1 solid ${LINE}`, paddingBottom: 9, marginBottom: 16 },
  brand: { fontSize: 9.5, fontWeight: 800, color: INK },
  brandTag: { fontSize: 7.5, color: FAINT },
  sectionTitle: { fontFamily:"Space Grotesk", fontSize: 15, fontWeight: 700, color: INK, marginTop: 18, marginBottom: 8 },
  footer: { position: "absolute", bottom: 26, left: 42, right: 42, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, color: FAINT, borderTop: `0.5 solid ${LINE}`, paddingTop: 8 },

  // Cover: filled stat row (replaces blank space when there's no score gauge)
  coverStatRow: { flexDirection: "row", border: `1 solid ${LINE}`, borderRadius: 10, overflow: "hidden" },
  coverStatCell: { flex: 1, padding: "20 14", borderRight: `1 solid ${LINE}` },
  coverStatNum: { fontFamily:"Space Grotesk", fontSize: 30, fontWeight: 700, color: GREEN },
  coverStatLabel: { fontSize: 8, color: FAINT, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 },
  coverIntro: { fontSize: 10.5, color: MUTED, lineHeight: 1.75, maxWidth: 420, marginTop: 22 },
  coverPhaseChip: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  coverPhaseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: GREEN, marginRight: 8 },
  coverPhaseText: { fontSize: 9.5, color: INK, fontWeight: 600 },

  summaryStrip: { flexDirection: "row", border: `1 solid ${LINE}`, borderRadius: 6, overflow: "hidden", marginBottom: 4 },
  summaryCell: { flex: 1, padding: "12 10", borderRight: `1 solid ${LINE}` },
  summaryNum: { fontSize: 20, fontWeight: 800 },
  summaryLabel: { fontSize: 7.5, color: FAINT, textTransform: "uppercase", letterSpacing: 0.4, marginTop: 2 },

  tableHead: { flexDirection: "row", borderBottom: `1 solid ${INK}`, paddingBottom: 5, marginBottom: 2 },
  thStatus: { width: 16 },
  thMain: { flex: 1, fontSize: 7.5, fontWeight: 700, color: FAINT, textTransform: "uppercase", letterSpacing: 0.4 },
  thSide: { width: 90, fontSize: 7.5, fontWeight: 700, color: FAINT, textTransform: "uppercase", letterSpacing: 0.4, textAlign: "right" },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 7, borderBottom: `0.5 solid ${LINE}` },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 0 },
  rowTitle: { fontSize: 9.5, fontWeight: 700, color: INK, marginBottom: 1.5 },
  rowDesc: { fontSize: 8.3, color: MUTED, lineHeight: 1.45 },
  rowSide: { width: 90, fontSize: 8.5, fontWeight: 700, textAlign: "right" },

  catHeader: { flexDirection: "row", alignItems: "center", backgroundColor: CARD, paddingVertical: 6, paddingHorizontal: 8, marginTop: 14, marginBottom: 2, borderRadius: 3 },
  catTitle: { fontSize: 9, fontWeight: 800, color: INK, textTransform: "uppercase", letterSpacing: 0.4 },
  catCount: { fontSize: 8, color: FAINT, marginLeft: "auto" },

  phaseTag: { fontSize: 8.5, fontWeight: 700, color: GREEN, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, marginTop: 14 },
  taskRow: { flexDirection: "row", paddingVertical: 8, borderBottom: `0.5 solid ${LINE}` },
  taskNum: { width: 20, fontSize: 9, fontWeight: 800, color: GREEN },
  taskTitle: { fontSize: 9.7, fontWeight: 700, color: INK, marginBottom: 2 },
  taskBody: { fontSize: 8.3, color: MUTED, lineHeight: 1.5, marginBottom: 3 },
  taskMetric: { fontSize: 7.8, color: GREEN, fontWeight: 700 },

  lockCard: { backgroundColor: "#F1FBF6", border: `1 solid ${GREEN}`, borderRadius: 6, padding: 12, marginTop: 12 },
});

function Dot({ color }) {
  return <View style={{ ...s.dot, backgroundColor: color }} />;
}

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

function ScoreGauge({ score, grade, size = 150 }) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  const dash = (Math.max(0, Math.min(100, score)) / 100) * c;
  const color = score > 74 ? GREEN : score > 49 ? AMBER : RED;
  return (
    <View style={{ alignItems: "center" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="#EAEAEA" strokeWidth={11} fill="none" />
        <Circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={11} fill="none"
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <Text x={size / 2} y={size / 2 - 2} style={{ fontSize: 34, fontWeight: 800 }} textAnchor="middle">{score}</Text>
        <Text x={size / 2} y={size / 2 + 18} style={{ fontSize: 9, fill: "#8C8C8C" }} textAnchor="middle">/ 100</Text>
      </Svg>
      <View style={{ backgroundColor: color, borderRadius: 4, paddingVertical: 3, paddingHorizontal: 12, marginTop: 6 }}>
        <Text style={{ fontSize: 10, fontWeight: 800, color: "#FFFFFF" }}>GRADE {grade}</Text>
      </View>
    </View>
  );
}

function Cover({ kicker, title, domain, date, overall, grade, verdict }) {
  return (
    <Page size="A4" style={s.coverPage}>
      <View>
        <Text style={{ fontSize: 10.5, fontWeight: 800, marginBottom: 46 }}>BODE CONVERSION LAB</Text>
        <Text style={s.kicker}>{kicker}</Text>
        <Text style={s.h1}>{title}</Text>
        <Text style={s.sub}>{domain}  ·  Generated {date}</Text>
      </View>

      {overall != null && (
        <View style={{ alignItems: "center" }}>
          <ScoreGauge score={overall} grade={grade} />
          {verdict && <Text style={{ ...s.sub, marginTop: 14, maxWidth: 320, textAlign: "center" }}>{verdict}</Text>}
        </View>
      )}

      <Text style={{ fontSize: 7.5, color: FAINT, lineHeight: 1.6 }}>
        Confidential — prepared for the store owner named above. Figures are estimates from automated technical analysis, not a guarantee of results.
      </Text>
    </Page>
  );
}

function GrowthCover({ kicker, title, domain, date, growth, marketing }) {
  const totalPhases = (growth?.phases?.length || 0) + (marketing?.phases?.length || 0);
  const totalItems = [...(growth?.phases || []), ...(marketing?.phases || [])]
    .reduce((sum, p) => sum + (p.items?.length || 0), 0);

  return (
    <Page size="A4" style={s.coverPage}>
      <View>
        <Text style={{ fontSize: 10.5, fontWeight: 800, marginBottom: 46 }}>BODE CONVERSION LAB</Text>
        <Text style={s.kicker}>{kicker}</Text>
        <Text style={s.h1}>{title}</Text>
        <Text style={s.sub}>{domain}  ·  Generated {date}</Text>

        <Text style={s.coverIntro}>
          A complete, sequenced plan to fix what's costing {domain} sales today, then build the traffic and marketing system to grow consistently — no guesswork, no generic advice.
        </Text>

        <View style={{ ...s.coverStatRow, marginTop: 28 }}>
          <View style={s.coverStatCell}>
            <Text style={s.coverStatNum}>{totalPhases}</Text>
            <Text style={s.coverStatLabel}>Phases</Text>
          </View>
          <View style={s.coverStatCell}>
            <Text style={s.coverStatNum}>{totalItems}</Text>
            <Text style={s.coverStatLabel}>Action Items</Text>
          </View>
          <View style={{ ...s.coverStatCell, borderRight: "none" }}>
            <Text style={s.coverStatNum}>120</Text>
            <Text style={s.coverStatLabel}>Days to Execute</Text>
          </View>
        </View>

        <View style={{ marginTop: 26 }}>
          {growth?.title && (
            <View style={s.coverPhaseChip}>
              <View style={s.coverPhaseDot} />
              <Text style={s.coverPhaseText}>{growth.title}</Text>
            </View>
          )}
          {marketing?.title && (
            <View style={s.coverPhaseChip}>
              <View style={s.coverPhaseDot} />
              <Text style={s.coverPhaseText}>{marketing.title}</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={{ fontSize: 7.5, color: FAINT, lineHeight: 1.6 }}>
        Confidential — prepared for the store owner named above. Figures are estimates from automated technical analysis, not a guarantee of results.
      </Text>
    </Page>
  );
}

function CountCell({ n, label, color }) {
  return (
    <View style={{ ...s.summaryCell }}>
      <Text style={{ ...s.summaryNum, color }}>{n}</Text>
      <Text style={s.summaryLabel}>{label}</Text>
    </View>
  );
}

function VitalsTable({ vitals }) {
  const rows = Object.values(vitals);
  return (
    <View>
      <View style={s.tableHead}>
        <View style={s.thStatus} />
        <Text style={s.thMain}>Core Web Vital</Text>
        <Text style={s.thSide}>Measured</Text>
      </View>
      {rows.map((v, i) => (
        <View key={i} style={s.row}>
          <View style={s.thStatus}><Dot color={STATUS[v.status]} /></View>
          <Text style={{ flex: 1, fontSize: 9.5, fontWeight: 700 }}>{v.label}</Text>
          <Text style={{ ...s.rowSide, color: STATUS[v.status] }}>{v.value}</Text>
        </View>
      ))}
    </View>
  );
}

export function ProblemsPDF({ storeUrl, analysis, date }) {
  const domain = analysis.domain;
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  analysis.findings.forEach(f => { counts[f.severity] = (counts[f.severity] || 0) + 1; });

  const byCategory = {};
  analysis.findings.forEach(f => {
    (byCategory[f.category] ||= []).push(f);
  });

  return (
    <Document title={`BCL Problem Report — ${domain}`}>
      <Cover kicker="Store Diagnosis" title="What's Actually Wrong With Your Store" domain={domain} date={date} overall={analysis.overall} grade={analysis.grade} verdict={analysis.verdict} />

      <Page size="A4" style={s.page}>
        <Header label="Problem Report" />

        <View style={s.summaryStrip}>
          <CountCell n={counts.critical} label="Critical" color={RED} />
          <CountCell n={counts.high} label="High" color={AMBER} />
          <CountCell n={counts.medium} label="Medium" color="#9A8600" />
          <View style={{ ...s.summaryCell, borderRight: "none" }}>
            <Text style={{ ...s.summaryNum, color: INK }}>{analysis.findings.length}</Text>
            <Text style={s.summaryLabel}>Total Issues</Text>
          </View>
        </View>

        <Text style={s.sectionTitle}>Category Scores</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 6 }}>
          {Object.values(analysis.metrics).map((v, i) => (
            <View key={i} style={{ width: "25%", marginBottom: 10, paddingRight: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                <Dot color={v.score > 74 ? GREEN : v.score > 49 ? AMBER : RED} />
                <Text style={{ fontSize: 13, fontWeight: 800, marginLeft: 5 }}>{v.score}</Text>
              </View>
              <Text style={{ fontSize: 7.5, color: FAINT }}>{v.label}</Text>
            </View>
          ))}
        </View>

        <Text style={s.sectionTitle}>Core Web Vitals</Text>
        <VitalsTable vitals={analysis.vitals} />

        <Text style={s.sectionTitle}>{analysis.findings.length} Problems Found, By Category</Text>

        {Object.entries(byCategory).map(([cat, items], ci) => (
          <View key={ci}>
            <View style={s.catHeader}>
              <Text style={s.catTitle}>{cat}</Text>
              <Text style={s.catCount}>{items.length} issue{items.length !== 1 ? "s" : ""}</Text>
            </View>
            {items.map((f, i) => (
              <View key={i} style={s.row} wrap={false}>
                <View style={s.thStatus}><Dot color={SEV[f.severity]} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowTitle}>{f.title}</Text>
                  <Text style={s.rowDesc}>{f.finding}</Text>
                </View>
                <Text style={{ ...s.rowSide, color: SEV[f.severity], fontSize: 7.5, textTransform: "uppercase" }}>{f.severity}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={s.lockCard} wrap={false}>
          <Text style={{ fontSize: 10.5, fontWeight: 800, color: GREEN, marginBottom: 4 }}>This report shows you what's broken — not how to fix it</Text>
          <Text style={{ fontSize: 8.7, color: MUTED, lineHeight: 1.55 }}>
            The exact fix for each issue above, in priority order with implementation detail, is in the separate Fixes Report.
            The plan to turn this into consistent traffic and revenue is in the Growth & Marketing Report. Both unlock with a paid package.
          </Text>
        </View>
        <Footer domain={domain} />
      </Page>
    </Document>
  );
}

function TaskList({ phases }) {
  let n = 0;
  return phases.map((phase, pi) => (
    <View key={pi}>
      <Text style={s.phaseTag}>{phase.phase}</Text>
      {phase.items.map((item, i) => {
        n += 1;
        return (
          <View key={i} style={s.taskRow} wrap={false}>
            <Text style={s.taskNum}>{String(n).padStart(2, "0")}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.taskTitle}>{item.title}</Text>
              <Text style={s.taskBody}>{item.action}</Text>
              <Text style={s.taskMetric}>{item.metric}</Text>
            </View>
          </View>
        );
      })}
    </View>
  ));
}

function FixesCover({ kicker, title, domain, date, fixing }) {
  const totalItems = (fixing?.phases || []).reduce((sum, p) => sum + (p.items?.length || 0), 0);
  const totalPhases = fixing?.phases?.length || 0;

  return (
    <Page size="A4" style={s.coverPage}>
      <View>
        <Text style={{ fontSize: 10.5, fontWeight: 800, marginBottom: 46 }}>BODE CONVERSION LAB</Text>
        <Text style={s.kicker}>{kicker}</Text>
        <Text style={s.h1}>{title}</Text>
        <Text style={s.sub}>{domain}  ·  Generated {date}</Text>

        <Text style={s.coverIntro}>
          The exact fixes costing {domain} sales right now, ranked by impact and sequenced so each one builds on the last — start at the top, work down.
        </Text>

        <View style={{ ...s.coverStatRow, marginTop: 28 }}>
          <View style={s.coverStatCell}>
            <Text style={s.coverStatNum}>{totalPhases}</Text>
            <Text style={s.coverStatLabel}>Priority Tiers</Text>
          </View>
          <View style={{ ...s.coverStatCell, borderRight: "none" }}>
            <Text style={s.coverStatNum}>{totalItems}</Text>
            <Text style={s.coverStatLabel}>Fixes Identified</Text>
          </View>
        </View>

        <View style={{ marginTop: 26 }}>
          {fixing?.phases?.map((p, i) => (
            <View key={i} style={s.coverPhaseChip}>
              <View style={s.coverPhaseDot} />
              <Text style={s.coverPhaseText}>{p.phase}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={{ fontSize: 7.5, color: FAINT, lineHeight: 1.6 }}>
        Confidential — prepared for the store owner named above. Figures are estimates from automated technical analysis, not a guarantee of results.
      </Text>
    </Page>
  );
}

export function FixesPDF({ analysis, solution, date }) {
  const domain = analysis.domain;
  return (
    <Document title={`BCL Fixes Report — ${domain}`}>
      <FixesCover kicker="Priority Action Plan" title="The Fixes — In Priority Order" domain={domain} date={date} fixing={solution.fixing} />
      <Page size="A4" style={s.page}>
        <Header label="Fixes Report" />
        <Text style={s.sub}>Stop the bleeding first. Fix in this order — each phase builds on the last.</Text>
        <TaskList phases={solution.fixing.phases} />
        <Footer domain={domain} />
      </Page>
    </Document>
  );
}

export function GrowthMarketingPDF({ analysis, solution, date }) {
  const domain = analysis.domain;
  const { growth, marketing } = solution;
  return (
    <Document title={`BCL Growth & Marketing Plan — ${domain}`}>
      <GrowthCover kicker="90–120 Day System" title="Growth & Marketing Plan" domain={domain} date={date} growth={growth} marketing={marketing} />
      <Page size="A4" style={s.page}>
        <Header label="Growth & Marketing Report" />
        <Text style={s.sectionTitle}>{growth.title}</Text>
        <Text style={s.sub}>{growth.subtitle}</Text>
        <TaskList phases={growth.phases} />

        <Text style={{ ...s.sectionTitle, marginTop: 24 }}>{marketing.title}</Text>
        <Text style={s.sub}>{marketing.subtitle}</Text>
        <TaskList phases={marketing.phases} />

        {marketing.commitment && (
          <View style={s.lockCard} wrap={false}>
            <Text style={{ fontSize: 11.5, fontWeight: 800, color: GREEN, marginBottom: 5 }}>{marketing.commitment.title}</Text>
            <Text style={{ fontSize: 9, color: MUTED, lineHeight: 1.6 }}>{marketing.commitment.body}</Text>
          </View>
        )}
        <Footer domain={domain} />
      </Page>
    </Document>
  );
}

/* ─────────────────────────────────────────────────────────
   CLIENT SNAPSHOT — one-page branded "how much you're losing"
   graphic, built for Fiyin to generate on a call or in a DM with
   a prospect, not for the visitor-facing free download flow.
   Visuals are simplified (colored dots instead of icon art —
   react-pdf can't render arbitrary icon fonts) but the layout
   mirrors the reference: dark hero, bottom-line loss figure,
   calculation table, 5-way leak breakdown, health gauge, CTA footer.
───────────────────────────────────────────────────────── */
const snap = StyleSheet.create({
  page: { fontFamily:"IBM Plex Sans", fontSize: 9.5, color: INK, backgroundColor: "#FFFFFF" },
  hero: { backgroundColor: "#0A0F0C", padding: "30 36", },
  heroBrand: { fontSize: 12, fontWeight: 800, color: "#FFFFFF", marginBottom: 3 },
  heroKicker: { fontSize: 8, color: "#8C8C8C", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 },
  heroTitle1: { fontFamily:"Space Grotesk", fontSize: 15, fontWeight: 700, color: "#FFFFFF" },
  heroTitle2: { fontFamily:"Space Grotesk", fontSize: 26, fontWeight: 700, color: "#FFFFFF" },
  heroTitle2Red: { color: RED },
  heroSub: { fontSize: 9, color: "#B8B8B8", lineHeight: 1.6, maxWidth: 380, marginTop: 8 },
  body: { padding: "22 36" },
  card: { border: `1 solid ${LINE}`, borderRadius: 10, padding: 16, marginBottom: 14 },
  cardLabel: { fontSize: 8.5, fontWeight: 800, color: RED, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8 },
  bottomLineFigure: { fontFamily:"Space Grotesk", fontSize: 34, fontWeight: 700, color: RED, marginTop: 4 },
  bottomLineSuffix: { fontSize: 12, fontWeight: 700, color: INK, marginTop: 2 },
  bottomLineNote: { fontSize: 8, color: MUTED, marginTop: 8, lineHeight: 1.5 },
  calcRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5, borderBottom: `0.5 solid ${LINE}` },
  calcLabel: { fontSize: 8.5, color: MUTED },
  calcValue: { fontSize: 8.5, fontWeight: 700, color: INK },
  leakGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  leakCard: { width: "31.5%", border: `1 solid ${LINE}`, borderRadius: 8, padding: 10, marginBottom: 8 },
  leakDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: RED, marginBottom: 6 },
  leakTitle: { fontSize: 8.3, fontWeight: 800, color: INK, marginBottom: 4, lineHeight: 1.3 },
  leakDesc: { fontSize: 7, color: MUTED, lineHeight: 1.4, marginBottom: 6 },
  leakLoss: { fontSize: 7.8, fontWeight: 800, color: RED },
  healthRow: { flexDirection: "row", gap: 18, alignItems: "center" },
  bullet: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6 },
  bulletDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: RED, marginTop: 3.5, marginRight: 6 },
  footer: { backgroundColor: "#0A0F0C", padding: "16 36", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerBrand: { fontSize: 9.5, fontWeight: 800, color: "#FFFFFF" },
  footerTag: { fontSize: 7.5, color: "#8C8C8C", marginTop: 2 },
  ctaBox: { backgroundColor: GREEN, borderRadius: 8, padding: "9 14" },
  ctaText: { fontSize: 8.5, fontWeight: 800, color: "#0A0F0C" },
});

export function ClientSnapshotPDF({ domain, date, visitors, aov, currentCR, potentialCRLow, potentialCRHigh, lossLow, lossHigh, leaks, overall, grade, problemCount, criticalCount, topIssues, calendlyUrl }) {
  const fmt = n => "$" + Math.round(n).toLocaleString();
  return (
    <Document title={`BCL Client Snapshot — ${domain}`}>
      <Page size="A4" style={snap.page}>
        <View style={snap.hero}>
          <Text style={snap.heroBrand}>bodeconversionlab.vercel.app</Text>
          <Text style={snap.heroKicker}>E-Commerce Conversion Audit</Text>
          <Text style={snap.heroTitle1}>How Much <Text style={{ color: RED }}>{domain}</Text></Text>
          <Text style={snap.heroTitle2}>IS LOSING <Text style={snap.heroTitle2Red}>PER MONTH</Text></Text>
          <Text style={snap.heroSub}>Poor speed, user experience, and missing trust signals are costing your store real money every month.</Text>
        </View>

        <View style={snap.body}>
          <View style={{ flexDirection: "row", gap: 14 }}>
            <View style={{ ...snap.card, flex: 1 }}>
              <Text style={snap.cardLabel}>The Bottom Line</Text>
              <Text style={{ fontSize: 8.5, color: MUTED, lineHeight: 1.5 }}>Based on current traffic and conversion leaks, you're losing an estimated:</Text>
              <Text style={snap.bottomLineFigure}>{fmt(lossLow)} – {fmt(lossHigh)}</Text>
              <Text style={snap.bottomLineSuffix}>PER MONTH</Text>
              <Text style={snap.bottomLineNote}>That's {fmt(lossLow*12)} – {fmt(lossHigh*12)} per year in potential revenue walking away.</Text>
            </View>

            <View style={{ ...snap.card, flex: 1 }}>
              <Text style={{ ...snap.cardLabel, color: INK }}>How We Calculated This</Text>
              <View style={snap.calcRow}><Text style={snap.calcLabel}>Estimated Monthly Visitors</Text><Text style={snap.calcValue}>{visitors.toLocaleString()}</Text></View>
              <View style={snap.calcRow}><Text style={snap.calcLabel}>Current Conversion Rate (est.)</Text><Text style={snap.calcValue}>{currentCR}%</Text></View>
              <View style={snap.calcRow}><Text style={snap.calcLabel}>Potential Conversion Rate (fixed)</Text><Text style={snap.calcValue}>{potentialCRLow}% – {potentialCRHigh}%</Text></View>
              <View style={snap.calcRow}><Text style={snap.calcLabel}>Average Order Value</Text><Text style={snap.calcValue}>${aov}</Text></View>
              <View style={{ ...snap.calcRow, borderBottom: "none" }}><Text style={{ ...snap.calcLabel, fontWeight: 800, color: RED }}>Revenue Lost Per Month</Text><Text style={{ ...snap.calcValue, color: RED }}>{fmt(lossLow)} – {fmt(lossHigh)}</Text></View>
            </View>
          </View>

          <Text style={{ fontSize: 11, fontWeight: 800, color: INK, marginBottom: 8 }}>Where The Money Is Leaking</Text>
          <View style={snap.leakGrid}>
            {leaks.map((l, i) => (
              <View key={i} style={snap.leakCard}>
                <View style={snap.leakDot} />
                <Text style={snap.leakTitle}>{l.title}</Text>
                <Text style={snap.leakDesc}>{l.desc}</Text>
                <Text style={snap.leakLoss}>{fmt(l.lossLow)} – {fmt(l.lossHigh)}</Text>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: "row", gap: 14, marginTop: 6 }}>
            <View style={{ ...snap.card, flex: 1, backgroundColor: "#0A0F0C", borderColor: "#0A0F0C" }}>
              <Text style={{ fontSize: 8.5, fontWeight: 800, color: "#FFFFFF", marginBottom: 10 }}>Current Store Health</Text>
              <View style={snap.healthRow}>
                <ScoreGauge score={overall} grade={grade} size={90} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 8, color: "#B8B8B8", marginBottom: 3 }}>{problemCount} problems identified</Text>
                  {criticalCount > 0 && (
                    <View style={{ backgroundColor: RED, borderRadius: 4, paddingVertical: 2, paddingHorizontal: 8, alignSelf: "flex-start", marginBottom: 6 }}>
                      <Text style={{ fontSize: 7, fontWeight: 800, color: "#FFFFFF" }}>{criticalCount} CRITICAL ISSUES</Text>
                    </View>
                  )}
                  {topIssues.slice(0,4).map((t,i) => (
                    <View key={i} style={snap.bullet}><View style={{ ...snap.bulletDot, backgroundColor: "#FFFFFF" }} /><Text style={{ fontSize: 7.3, color: "#DDDDDD", lineHeight: 1.4 }}>{t}</Text></View>
                  ))}
                </View>
              </View>
            </View>

            <View style={{ ...snap.card, flex: 1 }}>
              <Text style={{ fontSize: 8.5, fontWeight: 800, color: INK, marginBottom: 10 }}>What This Means For Your Business</Text>
              {[
                "You're paying for traffic, but the website isn't converting it.",
                "Potential customers are losing patience, losing trust, or getting stuck.",
                "Every day these issues remain, real revenue is being left on the table.",
                "Fix the leaks first, then scale the traffic for maximum growth.",
              ].map((t,i) => (
                <View key={i} style={snap.bullet}><View style={snap.bulletDot} /><Text style={{ fontSize: 7.5, color: MUTED, lineHeight: 1.45 }}>{t}</Text></View>
              ))}
            </View>
          </View>
        </View>

        <View style={snap.footer}>
          <View>
            <Text style={snap.footerBrand}>bodeconversionlab.vercel.app</Text>
            <Text style={snap.footerTag}>We fix the leaks. You keep the profit.</Text>
          </View>
          <View style={snap.ctaBox}>
            <Text style={snap.ctaText}>Book a free strategy call: {calendlyUrl}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
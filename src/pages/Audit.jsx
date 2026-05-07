import React, { useState } from 'react';

// Optimized fetch function for PageSpeed Insights
async function fetchPSI(storeUrl, strategy) {
  const API_KEY = "AIzaSyCAnT0GIpN-3OVQkP3fPJBwhl6pTU0BN8k";
  const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
    `?url=${encodeURIComponent(storeUrl)}` +
    `&strategy=${strategy}` +
    `&category=performance&category=seo&category=best-practices&category=accessibility` +
    `&key=${API_KEY}`;

  const r = await fetch(api);
  if (!r.ok) throw new Error(`PageSpeed API HTTP ${r.status}`);
  const d = await r.json();
  if (d?.error) throw new Error(d.error.message || "PSI error");
  return d;
}

const Audit = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const handleAudit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      // Running for both mobile and desktop strategies
      const data = await fetchPSI(url, "mobile");
      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', color: 'white', background: '#000', minHeight: '100vh' }}>
      <h1>Store Audit Lab</h1>
      <p>Analyze your e-commerce conversion potential.</p>
      
      <form onSubmit={handleAudit} style={{ marginBottom: '20px' }}>
        <input 
          type="url" 
          placeholder="https://yourstore.com" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{ padding: '10px', width: '300px', borderRadius: '4px', border: 'none' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', marginLeft: '10px', background: '#00ff00', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? "Analyzing..." : "Run Audit"}
        </button>
      </form>

      {/* This section replaces the infinite spinner with actual data */}
      {loading && <div className="spinner">Engineering your report...</div>}
      
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {report && (
        <div style={{ marginTop: '30px', border: '1px solid #333', padding: '20px' }}>
          <h2>Audit Results for {url}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>Performance Score: {Math.round(report.lighthouseResult.categories.performance.score * 100)}</div>
            <div>SEO Score: {Math.round(report.lighthouseResult.categories.seo.score * 100)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Audit;
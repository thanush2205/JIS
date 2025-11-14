import React, { useMemo, useState } from "react";
import { useCases } from "../../context/CasesContext.jsx";

export default function ViewCaseStatus() {
  const { cases, loading, error } = useCases();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cases;
    return cases.filter((c) => {
      const id = (c.id || '').toLowerCase();
      const title = (c.title || '').toLowerCase();
      const status = (c.status || '').toLowerCase();
      const accused = (c.accused || []).join(' ').toLowerCase();
      return id.includes(q) || title.includes(q) || status.includes(q) || accused.includes(q);
    });
  }, [cases, query]);

  return (
    <div style={{ background:'#fff', border:'1px solid #eee', borderRadius:12, padding:16 }}>
      <h3 style={{ marginBottom:12 }}>View Case Status</h3>

      <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:12, maxWidth:900 }}>
        <input
          placeholder="Search by Case ID, Title, Status, or Accused"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex:1, minWidth:320, padding:'10px 12px', border:'1px solid #e5e7eb', borderRadius:8 }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ padding:'10px 14px', border:'1px solid #e5e7eb', background:'#f8fafc', borderRadius:8, cursor:'pointer' }}>Clear</button>
        )}
      </div>

      {loading && <div>Loading…</div>}
      {error && <div style={{ color:'#b91c1c' }}>{error}</div>}
      {!loading && !error && filtered.map((c) => (
        <div
          key={c.id}
          style={{
            border: "1px solid #e5e7eb",
            padding: "10px 12px",
            borderRadius: 10,
            marginBottom: 8,
            background:'#f8fafc'
          }}
        >
          <div style={{ display:'flex', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
            <div>
              <strong>{c.id}</strong> — {c.title}
            </div>
            <div>
              <span style={{ padding:'4px 8px', border:'1px solid #c7d2fe', background:'#eef2ff', borderRadius:999, color:'#3730a3' }}>{c.status || '-'}</span>
            </div>
          </div>
          <div style={{ marginTop:8, display:'flex', gap:8, flexWrap:'wrap' }}>
            {(c.accused || []).map((a, i) => (
              <span key={i} style={{ padding:'4px 8px', border:'1px solid #bbf7d0', background:'#ecfdf5', borderRadius:999, color:'#065f46', fontSize:12 }}>{a}</span>
            ))}
            {(!c.accused || c.accused.length === 0) && <span style={{ color:'#64748b' }}>No accused listed</span>}
          </div>
        </div>
      ))}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ color:'#64748b' }}>No cases match your search.</div>
      )}
    </div>
  );
}

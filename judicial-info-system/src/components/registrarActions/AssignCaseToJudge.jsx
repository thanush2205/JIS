import React, { useEffect, useMemo, useState } from "react";
import { CasesAPI, UsersAPI } from "../../services/api";
import { useCases } from "../../context/CasesContext.jsx";

export default function AssignCaseToJudge() {
  const [caseId, setCaseId] = useState("");
  const [query, setQuery] = useState("");
  const [judges, setJudges] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { refresh } = useCases();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const all = await UsersAPI.list();
        const js = (all || []).filter(u => (u.role || '').toLowerCase() === 'judge');
        if (alive) setJudges(js);
      } catch (_) {}
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) return setFiltered(judges.slice(0, 8));
    setFiltered(
      judges.filter(j => (j.fullName||'').toLowerCase().includes(q) || (j.id||'').toLowerCase().includes(q)).slice(0, 10)
    );
  }, [query, judges]);

  const assignTo = async (judge) => {
    if (!caseId) { setMsg('Enter a Case ID first'); return; }
    try {
      setLoading(true); setMsg("");
  const updated = await CasesAPI.assignJudge(caseId, judge.fullName, judge.id);
      setMsg(`Assigned ${judge.fullName} (${judge.id}) to ${updated.id}`);
      setCaseId(""); setQuery("");
      refresh();
    } catch (e) { setMsg(e.message); } finally { setLoading(false); }
  };

  return (
    <div className="ja-panel" style={{ padding: 16 }}>
      <h3 style={{ marginBottom: 8 }}>Assign Case to Judge</h3>
      <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:12, maxWidth: 900 }}>
        <input className="ja-input" placeholder="Case ID (e.g., C005)" value={caseId} onChange={e=>setCaseId(e.target.value)} />
        <div>
          <input className="ja-input" placeholder="Search Judge by name or ID" value={query} onChange={e=>setQuery(e.target.value)} />
          <div style={{ marginTop: 10, border:'1px solid #e5e7eb', borderRadius: 10, padding: 10, background:'#fff' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:12 }}>
              {filtered.map(j => (
                <button key={j.id} onClick={()=>assignTo(j)} disabled={loading}
                  style={{ textAlign:'left', padding:14, border:'1px solid #e5e7eb', borderRadius:10, background:'#f9fafb', cursor:'pointer' }}>
                  <div style={{ fontWeight:600 }}>{j.fullName}</div>
                  <div style={{ color:'#555' }}>ID: {j.id}</div>
                  <div style={{ fontSize:13, color:'#666' }}>{j.email}</div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div style={{ padding:16, color:'#666' }}>No judges match your search.</div>
              )}
            </div>
          </div>
        </div>
        <div>
          <button className="ja-btn" onClick={() => { /* fallback assign by raw text if needed */ }} disabled style={{ display:'none' }}>Assign</button>
          {msg && <div style={{ marginTop: 8, color:'#0d6b0d' }}>{msg}</div>}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { CasesAPI } from '../../services/api';

export default function CaseDetailProposals() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('pending');

  const load = async () => {
    try {
      setLoading(true); setError('');
      const data = await CasesAPI.listRequests();
      setItems(data);
    } catch (e) { setError(e.message || 'Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (items || [])
      .filter(r => !status || r.decision === status)
      .filter(r => !q || r.caseId.toLowerCase().includes(q) || (r.title||'').toLowerCase().includes(q) || (r.userId||'').toLowerCase().includes(q) || (r.request||'').toLowerCase().includes(q));
  }, [items, query, status]);

  const decide = async (r, decision) => {
    try {
      setLoading(true);
      await CasesAPI.decideRequest(r.caseId, r.index, decision, '');
      await load();
    } catch (e) { setError(e.message || 'Failed to decide'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ padding: 16, background:'#fff', border:'1px solid #eee', borderRadius:12 }}>
      <h3 style={{ marginBottom: 10 }}>Case Detail Requests</h3>
      <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom: 12, flexWrap:'wrap' }}>
        <input
          placeholder="Search by Case ID, Title, User or Request"
          value={query}
          onChange={e=>setQuery(e.target.value)}
          style={{ flex:'1 1 320px', minWidth:320, padding:'10px 12px', border:'1px solid #e5e7eb', borderRadius:8 }}
        />
        <select value={status} onChange={e=>setStatus(e.target.value)} style={{ padding:'10px 12px', border:'1px solid #e5e7eb', borderRadius:8 }}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="declined">Declined</option>
        </select>
        <button onClick={load} disabled={loading} style={{ padding:'10px 12px', border:'1px solid #e5e7eb', background:'#f8fafc', borderRadius:8, cursor:'pointer' }}>{loading ? 'Loading…' : 'Refresh'}</button>
      </div>
      {error && <div style={{ color:'#b91c1c', marginBottom:8 }}>{error}</div>}
      <div style={{ overflowX:'auto', border:'1px solid #eee', borderRadius:12 }}>
        <table style={{ width:'100%', minWidth:1000, borderCollapse:'separate', borderSpacing:0 }}>
          <thead>
            <tr style={{ background:'linear-gradient(90deg,#f9fafb,#eef2ff)' }}>
              <th style={{ textAlign:'left', padding:'12px 14px', borderBottom:'1px solid #e5e7eb' }}>Case</th>
              <th style={{ textAlign:'left', padding:'12px 14px', borderBottom:'1px solid #e5e7eb' }}>User</th>
              <th style={{ textAlign:'left', padding:'12px 14px', borderBottom:'1px solid #e5e7eb' }}>Request</th>
              <th style={{ textAlign:'left', padding:'12px 14px', borderBottom:'1px solid #e5e7eb' }}>Submitted</th>
              <th style={{ textAlign:'left', padding:'12px 14px', borderBottom:'1px solid #e5e7eb' }}>Status</th>
              <th style={{ textAlign:'left', padding:'12px 14px', borderBottom:'1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r,i) => (
              <tr key={`${r.caseId}-${r.index}`} style={{ background: i%2?'#ffffff':'#fbfdff' }}>
                <td style={{ padding:'12px 14px', borderBottom:'1px solid #f1f5f9' }}>
                  <div style={{ fontWeight:600 }}>{r.caseId}</div>
                  <div style={{ color:'#64748b' }}>{r.title}</div>
                </td>
                <td style={{ padding:'12px 14px', borderBottom:'1px solid #f1f5f9' }}>{r.userId || '-'}</td>
                <td style={{ padding:'12px 14px', borderBottom:'1px solid #f1f5f9', whiteSpace:'pre-wrap' }}>{r.request}</td>
                <td style={{ padding:'12px 14px', borderBottom:'1px solid #f1f5f9' }}>{r.submittedAt ? new Date(r.submittedAt).toLocaleString() : '-'}</td>
                <td style={{ padding:'12px 14px', borderBottom:'1px solid #f1f5f9' }}>
                  <span style={{ padding:'4px 8px', border:'1px solid #e5e7eb', borderRadius:999, background: r.decision==='approved' ? '#ecfdf5' : r.decision==='declined' ? '#fef2f2' : '#f8fafc', color:'#111' }}>{r.decision}</span>
                </td>
                <td style={{ padding:'12px 14px', borderBottom:'1px solid #f1f5f9' }}>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={()=>decide(r,'approved')} disabled={loading || r.decision!=='pending'} style={{ padding:'8px 12px', border:'1px solid #10b981', background:'#ecfdf5', color:'#065f46', borderRadius:8, cursor:'pointer' }}>Approve</button>
                    <button onClick={()=>decide(r,'declined')} disabled={loading || r.decision!=='pending'} style={{ padding:'8px 12px', border:'1px solid #e11d48', background:'#fee2e2', color:'#991b1b', borderRadius:8, cursor:'pointer' }}>Decline</button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding:16, color:'#64748b' }}>No proposals.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

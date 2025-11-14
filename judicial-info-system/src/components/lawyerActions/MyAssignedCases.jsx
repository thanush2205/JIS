import React, { useEffect, useMemo, useState } from 'react';
import { CasesAPI, UsersAPI } from '../../services/api';

export default function MyAssignedCases() {
  const [me, setMe] = useState(null);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const u = await UsersAPI.me();
        if (!alive) return;
        setMe(u);
        setLoading(true);
        const all = await CasesAPI.list();
        if (!alive) return;
        const mine = (all || []).filter(c => c.lawyerId === u.id || (!c.lawyerId && (c.lawyer||'').toLowerCase().includes((u.fullName||'').toLowerCase())));
        setItems(mine);
      } catch (e) { setError(e.message || 'Failed to load'); }
      finally { setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(c => (c.id||'').toLowerCase().includes(q) || (c.title||'').toLowerCase().includes(q) || (c.status||'').toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div style={{ padding: 16, background: '#fff', border: '1px solid #eee', borderRadius: 12 }}>
      <h3 style={{ marginBottom: 8 }}>My Assigned Cases</h3>
      <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom: 12, maxWidth: 900 }}>
        <input
          placeholder="Search by ID, title, or status"
          value={query}
          onChange={e=>setQuery(e.target.value)}
          style={{ flex:1, minWidth: 320, padding:'10px 12px', border:'1px solid #e5e7eb', borderRadius:8 }}
        />
        {query && <button onClick={()=>setQuery('')} style={{ padding:'10px 14px', border:'1px solid #e5e7eb', background:'#f8fafc', borderRadius:8, cursor:'pointer' }}>Clear</button>}
      </div>
      {error && <div style={{ marginBottom: 8, color:'#b91c1c' }}>{error}</div>}
      <div style={{ overflowX:'auto', border:'1px solid #eee', borderRadius: 12, boxShadow:'0 10px 25px rgba(0,0,0,0.06)' }}>
        <table style={{ width:'100%', minWidth: 1000, borderCollapse:'separate', borderSpacing:0 }}>
          <thead>
            <tr style={{ background:'linear-gradient(90deg,#f9fafb,#eef2ff)' }}>
              <th style={{ textAlign:'left', padding:'14px 16px', borderBottom:'1px solid #e5e7eb' }}>Case ID</th>
              <th style={{ textAlign:'left', padding:'14px 16px', borderBottom:'1px solid #e5e7eb' }}>Title</th>
              <th style={{ textAlign:'left', padding:'14px 16px', borderBottom:'1px solid #e5e7eb' }}>Status</th>
              <th style={{ textAlign:'left', padding:'14px 16px', borderBottom:'1px solid #e5e7eb' }}>Judge</th>
              <th style={{ textAlign:'left', padding:'14px 16px', borderBottom:'1px solid #e5e7eb' }}>Next Hearing</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} style={{ padding:18 }}>Loading…</td></tr>
            )}
            {!loading && filtered.map((c,i) => {
              const lastHearing = Array.isArray(c.hearingDates) && c.hearingDates.length ? c.hearingDates[c.hearingDates.length - 1] : '-';
              return (
                <tr key={c.id} style={{ background: i%2?'#ffffff':'#fbfdff' }}>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid #f1f5f9' }}>{c.id}</td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid #f1f5f9' }}>{c.title}</td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid #f1f5f9' }}>{c.status}</td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid #f1f5f9' }}>{c.judge || '-'}</td>
                  <td style={{ padding:'14px 16px', borderBottom:'1px solid #f1f5f9' }}>{lastHearing}</td>
                </tr>
              );
            })}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={5} style={{ padding:18, color:'#64748b' }}>No assigned cases.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

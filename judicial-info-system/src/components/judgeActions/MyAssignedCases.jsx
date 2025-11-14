import React, { useEffect, useMemo, useState } from 'react';
import { CasesAPI, UsersAPI } from '../../services/api';

export default function MyAssignedCases() {
  const [me, setMe] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [query, setQuery] = useState('');
  const [todayOnly, setTodayOnly] = useState(true); // default: show today's hearings
  const [myOnly, setMyOnly] = useState(true); // scope: My Cases vs All Cases
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const today = useMemo(() => new Date().toLocaleDateString('en-CA'), []); // YYYY-MM-DD in local time

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // current user via JWT
        const u = await UsersAPI.me();
        if (!alive) return;
        setMe(u);
        setLoading(true);
        const all = await CasesAPI.list();
        if (!alive) return;
        setAllItems(all || []);
      } catch (e) {
        setError(e.message || 'Failed to load cases');
      } finally { setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  const baseItems = useMemo(() => {
    if (!myOnly) return allItems;
    if (!me) return [];
    return (allItems || []).filter(c => c.judgeId === me.id || (!c.judgeId && c.judge && c.judge.toLowerCase().includes((me.fullName||'').toLowerCase())));
  }, [allItems, me, myOnly]);

  const filtered = baseItems
    .filter(c => !todayOnly || (Array.isArray(c.hearingDates) && c.hearingDates.some(d => d === today)))
    .filter(c => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (
        (c.id||'').toLowerCase().includes(q) ||
        (c.title||'').toLowerCase().includes(q) ||
        (c.status||'').toLowerCase().includes(q) ||
        (c.lawyer||'').toLowerCase().includes(q)
      );
    });

  return (
    <div className="ja-panel" style={{ padding: 16 }}>
      <h3 style={{ marginBottom: 8 }}>
        {myOnly ? 'My Assigned Cases' : 'All Cases'} {todayOnly && (
          <span style={{ marginLeft: 8, fontSize: 14, color:'#2563eb' }}>– Today {today}</span>
        )}
      </h3>
      <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom: 12, flexWrap:'wrap', maxWidth: 900 }}>
        <input
          className="ja-input"
          placeholder="Search by ID, title, status, or lawyer"
          value={query}
          onChange={e=>setQuery(e.target.value)}
          style={{ flex:'1 1 auto' }}
        />
        {query && (
          <button className="ja-btn" onClick={()=>setQuery('')}>Clear</button>
        )}
        <button
          type="button"
          className="ja-btn"
          onClick={() => setMyOnly(v => !v)}
          style={{ background: myOnly ? '#eef2ff' : '#dcfce7', color: '#111', border:'1px solid #e5e7eb' }}
        >
          {myOnly ? 'Showing My Cases' : 'Showing All Cases'}
        </button>
        <button
          type="button"
          className="ja-btn"
          onClick={() => setTodayOnly(v => !v)}
          style={{ background: todayOnly ? '#eef2ff' : '#f3f4f6', color: '#111', border:'1px solid #e5e7eb' }}
        >
          {todayOnly ? 'Showing Today Only' : 'Showing All Dates'}
        </button>
      </div>
      {error && <div className="ja-error" style={{ marginBottom: 8 }}>{error}</div>}
      <div style={{ overflowX:'auto', border:'1px solid #eee', borderRadius: 8 }}>
        <table style={{ width:'100%', minWidth: 900, borderCollapse:'separate', borderSpacing:0 }}>
          <thead>
            <tr style={{ background:'#f9fafb' }}>
              <th style={{ textAlign:'left', padding:'12px 14px', borderBottom:'1px solid #eee' }}>Case ID</th>
              <th style={{ textAlign:'left', padding:'12px 14px', borderBottom:'1px solid #eee' }}>Title</th>
              <th style={{ textAlign:'left', padding:'12px 14px', borderBottom:'1px solid #eee' }}>Status</th>
              <th style={{ textAlign:'left', padding:'12px 14px', borderBottom:'1px solid #eee' }}>Lawyer</th>
              <th style={{ textAlign:'left', padding:'12px 14px', borderBottom:'1px solid #eee' }}>Next Hearing</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} style={{ padding:16 }}>Loading…</td></tr>
            )}
            {!loading && filtered.map((c,i) => (
              <tr key={c.id} style={{ background: i%2?'#fcfcfc':'#fff' }}>
                <td style={{ padding:'12px 14px', borderBottom:'1px solid #eee' }}>{c.id}</td>
                <td style={{ padding:'12px 14px', borderBottom:'1px solid #eee' }}>{c.title}</td>
                <td style={{ padding:'12px 14px', borderBottom:'1px solid #eee' }}>{c.status}</td>
                <td style={{ padding:'12px 14px', borderBottom:'1px solid #eee' }}>{c.lawyer || '-'}</td>
                <td style={{ padding:'12px 14px', borderBottom:'1px solid #eee' }}>{c.hearingDates?.[c.hearingDates.length-1] || '-'}</td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={5} style={{ padding:16, color:'#666' }}>
                {todayOnly ? 'No hearings today. Toggle to "Showing All Dates" to view all assigned cases.' : 'No cases assigned yet.'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

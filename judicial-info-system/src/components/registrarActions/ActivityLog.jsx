import React, { useEffect, useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function ActivityLog() {
  const [items, setItems] = useState([]);
  const [role, setRole] = useState('');
  const [actorId, setActorId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams();
      if (role) params.set('role', role);
      if (actorId) params.set('actorId', actorId);
      if (targetId) params.set('targetId', targetId);
      const res = await fetch(`${API_BASE}/activity?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load activity');
      const j = await res.json();
      setItems(j);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []); // initial load

  const filtered = useMemo(() => items, [items]);

  return (
    <div className="ja-panel" style={{ padding: 16 }}>
      <h3 style={{ marginBottom: 8 }}>User Activity Log</h3>
      <div className="ja-form" style={{ maxWidth: 1200 }}>
        <div style={{ display:'flex', gap: 10, flexWrap:'wrap', alignItems:'center' }}>
          <select className="ja-input" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="">All Roles</option>
            <option>Registrar</option>
            <option>Judge</option>
            <option>Lawyer</option>
            <option>Police</option>
            <option>User</option>
          </select>
          <input className="ja-input" placeholder="Filter by Actor ID (optional)" value={actorId} onChange={e=>setActorId(e.target.value)} />
          <input className="ja-input" placeholder="Filter by Target ID (optional)" value={targetId} onChange={e=>setTargetId(e.target.value)} />
          <button className="ja-btn" onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Refresh'}</button>
        </div>
        {error && <div className="ja-error" style={{ marginTop:8 }}>{error}</div>}
        <div style={{ marginTop:12, overflowX:'auto', border:'1px solid #eee', borderRadius: 8 }}>
          <table style={{ width:'100%', minWidth: 1600, borderCollapse:'separate', borderSpacing: 0, tableLayout:'auto' }}>
            <colgroup>
              <col style={{ width: 220 }} />
              <col style={{ width: 220 }} />
              <col style={{ width: 160 }} />
              <col style={{ width: 300 }} />
              <col style={{ width: 260 }} />
              <col style={{ width: 600 }} />
            </colgroup>
            <thead>
              <tr style={{ background:'#f9fafb' }}>
                <th style={{ textAlign:'left', padding:'12px 14px', fontWeight:600, borderBottom:'1px solid #eee' }}>Time</th>
                <th style={{ textAlign:'left', padding:'12px 14px', fontWeight:600, borderBottom:'1px solid #eee' }}>Actor</th>
                <th style={{ textAlign:'left', padding:'12px 14px', fontWeight:600, borderBottom:'1px solid #eee' }}>Role</th>
                <th style={{ textAlign:'left', padding:'12px 14px', fontWeight:600, borderBottom:'1px solid #eee' }}>Action</th>
                <th style={{ textAlign:'left', padding:'12px 14px', fontWeight:600, borderBottom:'1px solid #eee' }}>Target</th>
                <th style={{ textAlign:'left', padding:'12px 14px', fontWeight:600, borderBottom:'1px solid #eee' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a._id} style={{ background: i % 2 ? '#fcfcfc' : '#fff' }}>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid #eee', verticalAlign:'top' }}>{new Date(a.at).toLocaleString()}</td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid #eee', verticalAlign:'top' }}>{a.actorId}</td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid #eee', verticalAlign:'top' }}>{a.actorRole}</td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid #eee', verticalAlign:'top' }}>{a.action}</td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid #eee', verticalAlign:'top' }}>{a.targetType}:{a.targetId}</td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid #eee', fontFamily:'ui-monospace, monospace', fontSize:13, whiteSpace:'pre-wrap', wordBreak:'break-word' }}>
                    {(() => { try { return JSON.stringify(a.details || {}, null, 2); } catch { return ''; } })()}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && !error && (
                <tr><td colSpan={6} style={{ padding:18, textAlign:'center', color:'#666' }}>No activity yet. Perform actions like registering a case, assigning a lawyer, or booking a payment, then refresh.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

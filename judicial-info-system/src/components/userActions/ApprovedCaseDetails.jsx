import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CasesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ApprovedCaseDetails() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [decisionFilter, setDecisionFilter] = useState('approved');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const prevDecisionRef = useRef(new Map());
  const flashRef = useRef(new Map()); // key -> timeoutId
  const [flashKeys, setFlashKeys] = useState(new Set());

  const load = async () => {
    if (!user) return;
    try {
      setLoading(true); setError('');
      const data = await CasesAPI.myRequests(decisionFilter === 'all' ? '' : decisionFilter);
      setItems(data);
    } catch (e) { setError(e.message || 'Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [decisionFilter, user?.id]);
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => load(), 3000);
    return () => clearInterval(id);
  }, [autoRefresh, decisionFilter, user?.id]);

  // Detect transitions from pending -> approved and flash highlight
  useEffect(() => {
    const map = prevDecisionRef.current;
    const newlyApproved = [];
    for (const it of items) {
      const key = `${it.caseId}-${it.index}`;
      const prev = map.get(key);
      if (prev && prev === 'pending' && it.decision === 'approved') {
        newlyApproved.push(key);
      }
      map.set(key, it.decision);
    }
    if (newlyApproved.length) {
      setFlashKeys(prev => {
        const next = new Set(prev);
        newlyApproved.forEach(k => next.add(k));
        return next;
      });
      // clear flash after 6s per item
      newlyApproved.forEach(key => {
        if (flashRef.current.has(key)) clearTimeout(flashRef.current.get(key));
        const to = setTimeout(() => {
          setFlashKeys(prev => {
            const next = new Set(prev);
            next.delete(key);
            return next;
          });
          flashRef.current.delete(key);
        }, 6000);
        flashRef.current.set(key, to);
      });
    }
    return () => {
      // cleanup on unmount
      if (!items || items.length === 0) {
        for (const [, to] of flashRef.current) clearTimeout(to);
        flashRef.current.clear();
      }
    };
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (items||[]) .filter(c => !q || c.caseId.toLowerCase().includes(q) || (c.title||'').toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div style={{ background:'#fff', padding:16, borderRadius:12, border:'1px solid #e5e7eb' }}>
      <h3 style={{ marginBottom:8 }}>My Case Detail Requests</h3>
      <p style={{ marginTop:0, color:'#64748b', fontSize:14 }}>Approved requests show full case summary. Pending stay until registrar decides. Declined remain visible for reference.</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:12 }}>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search case..." style={{ flex:'1 1 240px', minWidth:240, padding:'10px 12px', border:'1px solid #e5e7eb', borderRadius:8 }} />
        <select value={decisionFilter} onChange={e=>setDecisionFilter(e.target.value)} style={{ padding:'10px 12px', border:'1px solid #e5e7eb', borderRadius:8 }}>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="declined">Declined</option>
          <option value="all">All</option>
        </select>
        <button onClick={load} disabled={loading} style={{ padding:'10px 12px', border:'1px solid #e5e7eb', borderRadius:8, background:'#f8fafc', cursor:'pointer' }}>{loading? 'Loading…':'Refresh'}</button>
        <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:14 }}>
          <input type="checkbox" checked={autoRefresh} onChange={e=>setAutoRefresh(e.target.checked)} /> Auto Refresh
        </label>
      </div>
      {error && <div style={{ color:'#b91c1c', marginBottom:8 }}>{error}</div>}
      <div style={{ display:'grid', gap:14, gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))' }}>
        {filtered.map(c => {
          const key = `${c.caseId}-${c.index}`;
          const isFlash = flashKeys.has(key);
          return (
          <div key={key} style={{ border: isFlash?'1px solid #10b981':'1px solid #e2e8f0', borderRadius:12, padding:14, background: isFlash? 'linear-gradient(180deg,#ecfdf5,#ffffff)':'#ffffff', boxShadow:'0 2px 6px rgba(16,185,129,0.15)', display:'flex', flexDirection:'column', gap:8, transition:'all .2s ease' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <strong style={{ fontSize:16 }}>{c.caseId}</strong>
              <span style={{ fontSize:12, padding:'4px 8px', borderRadius:999, border:'1px solid #e5e7eb', background: c.decision==='approved' ? '#ecfdf5' : c.decision==='declined' ? '#fef2f2' : '#f1f5f9', color:'#0f172a' }}>{c.decision}</span>
            </div>
            <div style={{ fontWeight:600 }}>{c.title}</div>
            <div style={{ fontSize:12, color:'#64748b', display:'flex', flexWrap:'wrap', gap:6 }}>
              <span style={{ background:'#f1f5f9', padding:'4px 8px', borderRadius:6 }}>Type: {c.type||'-'}</span>
              <span style={{ background:'#f1f5f9', padding:'4px 8px', borderRadius:6 }}>Court: {c.court||'-'}</span>
              <span style={{ background:'#f1f5f9', padding:'4px 8px', borderRadius:6 }}>Status: {c.status||'-'}</span>
            </div>
            {c.decision==='approved' ? (
              <>
                {c.description && <p style={{ margin:0, fontSize:13, lineHeight:1.5 }}>{c.description}</p>}
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, fontSize:12, marginTop:4 }}>
                  <span style={{ background:'#eef2ff', padding:'4px 8px', borderRadius:6 }}>Judge: {c.judge || '-'}</span>
                  <span style={{ background:'#eef2ff', padding:'4px 8px', borderRadius:6 }}>Lawyer: {c.lawyer || '-'}</span>
                  <span style={{ background:'#eef2ff', padding:'4px 8px', borderRadius:6 }}>Evidence: {c.evidenceCount}</span>
                  <span style={{ background:'#eef2ff', padding:'4px 8px', borderRadius:6 }}>Reports: {c.reportsCount}</span>
                  <span style={{ background:'#eef2ff', padding:'4px 8px', borderRadius:6 }}>Judgement: {c.hasJudgement? 'Yes':'No'}</span>
                </div>
                <div style={{ marginTop:6 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:'#334155' }}>Accused:</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:4 }}>
                    {(Array.isArray(c.accused)?c.accused:[c.accused]).filter(Boolean).map(a => <span key={a} style={{ background:'#fee2e2', color:'#991b1b', padding:'4px 8px', borderRadius:6, fontSize:11 }}>{a}</span>)}
                    {(!c.accused || (Array.isArray(c.accused)&&c.accused.length===0)) && <span style={{ fontSize:12, color:'#64748b' }}>None</span>}
                  </div>
                </div>
                {c.hearingDates && c.hearingDates.length > 0 && (
                  <div style={{ marginTop:6 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:'#334155' }}>Hearings:</label>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:4 }}>
                      {c.hearingDates.map(h => <span key={h} style={{ background:'#dbeafe', color:'#1e3a8a', padding:'4px 8px', borderRadius:6, fontSize:11 }}>{new Date(h).toLocaleDateString()}</span>)}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p style={{ fontSize:12, color:'#64748b', margin:0 }}>{c.decision==='pending' ? 'Awaiting registrar approval...' : 'Declined by registrar.'}</p>
            )}
            <div style={{ fontSize:10, color:'#94a3b8', marginTop:4 }}>
              Submitted {c.submittedAt ? new Date(c.submittedAt).toLocaleString() : '—'}
              {c.decidedAt && ` • Decided ${new Date(c.decidedAt).toLocaleString()}`}
              {isFlash && ' • Just approved'}
            </div>
          </div>
        );})}
        {!loading && filtered.length === 0 && (
          <div style={{ padding:24, textAlign:'center', color:'#64748b', border:'2px dashed #e2e8f0', borderRadius:12 }}>No requests match.</div>
        )}
      </div>
    </div>
  );
}

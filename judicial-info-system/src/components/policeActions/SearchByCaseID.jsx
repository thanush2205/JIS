import React, { useState } from "react";
import { useCases } from "../../context/CasesContext.jsx";

export default function SearchByCaseID() {
  const [caseId, setCaseId] = useState("");
  const [result, setResult] = useState(null);

  const { cases } = useCases();
  const handleSearch = () => {
    const found = cases.find((c) => c.id === caseId);
    setResult(found || "No case found.");
  };

  return (
    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:16, maxWidth:780 }}>
      <h3 style={{ marginTop:0, marginBottom:12 }}>Search by Case ID</h3>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        <input
          type="text"
          placeholder="Enter Case ID (e.g., C001)"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          style={{ flex:'1 1 240px', padding:'10px 12px', border:'1px solid #e5e7eb', borderRadius:8 }}
        />
        <button onClick={handleSearch} style={{ padding:'10px 16px', borderRadius:8, border:'1px solid #2563eb', background:'#1d4ed8', color:'#fff', cursor:'pointer' }}>Search</button>
        {result && typeof result !== 'string' && (
          <button onClick={()=>setResult(null)} style={{ padding:'10px 14px', borderRadius:8, border:'1px solid #e5e7eb', background:'#f8fafc', cursor:'pointer' }}>Clear</button>
        )}
      </div>
      {result && (
        <div style={{ marginTop:18 }}>
          {typeof result === 'string' ? (
            <div style={{ padding:12, border:'1px solid #fecaca', background:'#fef2f2', borderRadius:10, color:'#991b1b' }}>{result}</div>
          ) : (
            <div style={{ border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', boxShadow:'0 4px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ background:'linear-gradient(90deg,#f9fafb,#eef2ff)', padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
                <div style={{ fontSize:16, fontWeight:600 }}><span style={{ color:'#6366f1' }}>{result.id}</span> — {result.title}</div>
                <span style={{ padding:'6px 10px', border:'1px solid #c7d2fe', background:'#eef2ff', color:'#3730a3', borderRadius:999, fontSize:12 }}>{result.status || 'Unknown'}</span>
              </div>
              <div style={{ padding:16, display:'grid', gap:12 }}>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, fontSize:12 }}>
                  <span style={{ background:'#f1f5f9', padding:'6px 10px', borderRadius:8 }}>Type: {result.type || '-'}</span>
                  <span style={{ background:'#f1f5f9', padding:'6px 10px', borderRadius:8 }}>Court: {result.court || '-'}</span>
                  <span style={{ background:'#f1f5f9', padding:'6px 10px', borderRadius:8 }}>Judge: {result.judge || '-'}</span>
                  <span style={{ background:'#f1f5f9', padding:'6px 10px', borderRadius:8 }}>Lawyer: {result.lawyer || '-'}</span>
                </div>
                {result.description && <p style={{ margin:0, fontSize:13, lineHeight:1.5 }}>{result.description}</p>}
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:'#334155' }}>Accused:</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:6 }}>
                    {(Array.isArray(result.accused)?result.accused:[result.accused]).filter(Boolean).map((a,i)=>(
                      <span key={i} style={{ padding:'6px 10px', background:'#fee2e2', border:'1px solid #fecaca', color:'#991b1b', borderRadius:8, fontSize:11 }}>{a}</span>
                    ))}
                    {(!result.accused || (Array.isArray(result.accused) && result.accused.length===0)) && <span style={{ fontSize:12, color:'#64748b' }}>None listed</span>}
                  </div>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, fontSize:11 }}>
                  <span style={{ background:'#ecfdf5', border:'1px solid #bbf7d0', color:'#065f46', padding:'6px 10px', borderRadius:8 }}>Evidence: {(result.evidence||[]).length}</span>
                  <span style={{ background:'#ecfdf5', border:'1px solid #bbf7d0', color:'#065f46', padding:'6px 10px', borderRadius:8 }}>Reports: {(result.reports||[]).length}</span>
                  <span style={{ background:'#ecfdf5', border:'1px solid #bbf7d0', color:'#065f46', padding:'6px 10px', borderRadius:8 }}>Hearings: {(result.hearingDates||[]).length}</span>
                </div>
                {result.hearingDates && result.hearingDates.length > 0 && (
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:'#334155' }}>Hearing Dates:</label>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:6 }}>
                      {result.hearingDates.map(h => (
                        <span key={h} style={{ background:'#dbeafe', color:'#1e3a8a', padding:'6px 10px', borderRadius:8, fontSize:11 }}>{new Date(h).toLocaleDateString()}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

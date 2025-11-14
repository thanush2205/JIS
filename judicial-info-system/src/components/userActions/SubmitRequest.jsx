import React, { useState } from "react";
import { CasesAPI } from "../../services/api";
import { useAuth } from '../../context/AuthContext';
import { useCases } from '../../context/CasesContext.jsx';

export default function SubmitRequest() {
  const { user } = useAuth();
  const { cases } = useCases();
  const [request, setRequest] = useState("");
  const [caseId, setCaseId] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMsg("");
    if (!user) { setError('Login required.'); return; }
    if (!caseId) { setError('Select a case.'); return; }
    if (!request.trim()) { setError('Enter your request details.'); return; }
    try {
      await CasesAPI.addUserRequest(caseId, { userId: user.id, request: request.trim() });
      setMsg('Request submitted for registrar approval.');
      setRequest(''); setCaseId('');
    } catch (e) {
      setError(e.message || 'Failed to submit');
    }
  };

  return (
    <div style={{ background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:16, maxWidth:640 }}>
      <h3 style={{ marginTop:0, marginBottom:8 }}>Submit Case Detail Request</h3>
      <p style={{ margin:0, fontSize:13, color:'#64748b' }}>Choose a case and describe the specific details you need access to.</p>
      <form onSubmit={handleSubmit} style={{ marginTop:14, display:'flex', flexDirection:'column', gap:12 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontSize:12, fontWeight:600, color:'#334155' }}>Case</label>
          <select value={caseId} onChange={e=>setCaseId(e.target.value)} style={{ padding:'10px 12px', border:'1px solid #e5e7eb', borderRadius:8 }}>
            <option value="">Select Case...</option>
            {cases.map(c => <option key={c.id} value={c.id}>{c.id} — {c.title}</option>)}
          </select>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontSize:12, fontWeight:600, color:'#334155' }}>Request Details</label>
          <textarea
            placeholder="Explain what case information you need and why..."
            value={request}
            onChange={e=>setRequest(e.target.value)}
            style={{ width:'100%', minHeight:120, padding:'12px 14px', border:'1px solid #e5e7eb', borderRadius:8, resize:'vertical' }}
          />
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
          <button type="submit" style={{ padding:'10px 18px', borderRadius:8, background:'#1d4ed8', color:'#fff', border:'1px solid #1e40af', cursor:'pointer' }}>Submit Request</button>
          {msg && <span style={{ color:'#065f46', fontSize:13 }}>{msg}</span>}
          {error && <span style={{ color:'#b91c1c', fontSize:13 }}>{error}</span>}
        </div>
      </form>
    </div>
  );
}

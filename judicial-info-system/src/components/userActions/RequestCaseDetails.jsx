import React, { useMemo, useState } from "react";
import { CasesAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext.jsx";

// Contract:
// - User enters Case ID and requests details.
// - We create a proposal (pending) and show "Proposal sent to Registrar".
// - Once approved by Registrar, we reveal the case details in a styled container.
export default function RequestCaseDetails() {
  const { user } = useAuth();
  const [caseId, setCaseId] = useState("");
  const [status, setStatus] = useState("idle"); // idle | pending | approved | declined
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const isApproved = status === "approved" && !!caseData;

  const checkStatus = async (cid) => {
    if (!user) { setMsg("Please login to continue."); return; }
    if (!cid) { setMsg("Enter a Case ID."); return; }
    setMsg(""); setLoading(true);
    try {
      const all = await CasesAPI.listRequests();
      const mine = (all || []).filter(r => r.caseId === cid && r.userId === user.id);
      const latest = mine.sort((a,b) => (b.index ?? 0) - (a.index ?? 0))[0];
      const decision = latest?.decision || "idle";
      if (decision === "approved") {
        const c = await CasesAPI.get(cid);
        setCaseData(c);
        setStatus("approved");
      } else if (decision === "pending") {
        setCaseData(null);
        setStatus("pending");
        setMsg("Proposal sent to Registrar. You will see details here once approved.");
      } else if (decision === "declined") {
        setCaseData(null);
        setStatus("declined");
        setMsg("Your previous request was declined. You may send a new request.");
      } else {
        setCaseData(null);
        setStatus("idle");
        setMsg("No prior request found. You can request access below.");
      }
    } catch (e) {
      setMsg(e.message || "Failed to check status");
    } finally { setLoading(false); }
  };

  const requestDetails = async (e) => {
    e.preventDefault();
    if (!user) { setMsg("Please login to continue."); return; }
    if (!caseId) { setMsg("Enter a Case ID."); return; }
    setLoading(true); setMsg("");
    try {
      await CasesAPI.addUserRequest(caseId, { userId: user.id, request: "Requesting access to case details" });
      setStatus("pending");
      setCaseData(null);
      setMsg("Proposal sent to Registrar. You will see details here once approved.");
    } catch (e) {
      setMsg(e.message || "Failed to send request");
    } finally { setLoading(false); }
  };

  const pill = useMemo(() => {
    const base = { padding:'4px 10px', borderRadius: 999, fontSize: 12, fontWeight:600, display:'inline-block' };
    if (status === 'approved') return <span style={{...base, background:'#ecfdf5', color:'#065f46', border:'1px solid #10b981'}}>Approved</span>;
    if (status === 'pending') return <span style={{...base, background:'#fff7ed', color:'#9a3412', border:'1px solid #fb923c'}}>Pending</span>;
    if (status === 'declined') return <span style={{...base, background:'#fef2f2', color:'#991b1b', border:'1px solid #fecaca'}}>Declined</span>;
    return null;
  }, [status]);

  return (
    <div style={{ background:'#fff', padding:16, border:'1px solid #e5e7eb', borderRadius:12 }}>
      <h3 style={{ marginBottom: 12 }}>Request Case Details</h3>
      <form onSubmit={requestDetails} style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
        <input
          type="text"
          placeholder="Enter Case ID"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          style={{ flex:'1 1 260px', minWidth:260, padding:'10px 12px', border:'1px solid #e5e7eb', borderRadius:8 }}
        />
        <button type="submit" disabled={loading} style={{ padding:'10px 14px', borderRadius:8, border:'1px solid #0b7d77', background:'#0b7d77', color:'#fff', cursor:'pointer' }}>
          {loading ? 'Submitting…' : 'Request Details'}
        </button>
        <button type="button" onClick={() => checkStatus(caseId)} disabled={loading || !caseId} style={{ padding:'10px 14px', borderRadius:8, border:'1px solid #e5e7eb', background:'#f8fafc', color:'#0b7d77', cursor:'pointer' }}>
          {loading ? 'Checking…' : 'Refresh Status'}
        </button>
        {pill}
      </form>
      {msg && <div style={{ marginTop:8, color:'#334155' }}>{msg}</div>}

      {isApproved && (
        <div style={{ marginTop:16, border:'1px solid #e5e7eb', borderRadius:12, overflow:'hidden' }}>
          <div style={{ padding:'12px 14px', background:'linear-gradient(90deg,#f9fafb,#eef2ff)', borderBottom:'1px solid #e5e7eb' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:14, color:'#64748b' }}>Case</div>
                <div style={{ fontSize:18, fontWeight:700 }}>{caseData.title || '-'} <span style={{ fontWeight:400, color:'#475569' }}>({caseData.id})</span></div>
              </div>
              <div>{pill}</div>
            </div>
          </div>
          <div style={{ padding:16 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <InfoRow label="Type" value={caseData.type || '-'} />
              <InfoRow label="Status" value={caseData.status || '-'} />
              <InfoRow label="Court" value={caseData.court || '-'} />
              <InfoRow label="Judge" value={caseData.judge || caseData.judgeId || '-'} />
              <InfoRow label="Lawyer" value={caseData.lawyer || caseData.lawyerId || '-'} />
              <InfoRow label="Next Hearing" value={(Array.isArray(caseData.hearingDates) && caseData.hearingDates[0]) || 'N/A'} />
              <InfoRow label="Accused" value={Array.isArray(caseData.accused) ? caseData.accused.join(', ') : (caseData.accused || '-')} full />
            </div>
            {caseData.description && (
              <div style={{ marginTop:12 }}>
                <div style={{ fontSize:13, color:'#64748b', marginBottom:4 }}>Description</div>
                <div style={{ padding:12, border:'1px solid #e5e7eb', borderRadius:8, background:'#f8fafc', color:'#0f172a', whiteSpace:'pre-wrap' }}>{caseData.description}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, full }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
      <div style={{ fontSize:13, color:'#64748b' }}>{label}</div>
      <div style={{ fontSize:15, color:'#0f172a', fontWeight:600 }}>{value}</div>
    </div>
  );
}

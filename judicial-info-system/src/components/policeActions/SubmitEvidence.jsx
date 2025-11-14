import React, { useState } from "react";
import { CasesAPI } from "../../services/api";

export default function SubmitEvidence() {
  const [caseId, setCaseId] = useState("");
  const [evidenceName, setEvidenceName] = useState("");
  const [docs, setDocs] = useState([{ name: "", url: "" }]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const updateDoc = (idx, key, value) => {
    setDocs((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: value };
      return next;
    });
  };
  const addRow = () => setDocs((d) => [...d, { name: "", url: "" }]);
  const removeRow = (idx) => setDocs((d) => d.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    const id = caseId.trim();
    const name = evidenceName.trim();
    if (!id || !name) return setMsg("Provide case ID and evidence name.");
    const payloadDocs = docs
      .map((d) => ({ name: d.name.trim(), url: d.url.trim(), uploadedAt: new Date().toISOString() }))
      .filter((d) => d.name);
    try {
      setLoading(true); setMsg("");
      await CasesAPI.addEvidence(id, name);
      if (payloadDocs.length) await CasesAPI.addDocuments(id, payloadDocs);
      setMsg(`Evidence submitted${payloadDocs.length ? ` with ${payloadDocs.length} document(s)` : ''}.`);
      setEvidenceName("");
      setDocs([{ name: "", url: "" }]);
    } catch (e) {
      setMsg(e.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background:'#fff', border:'1px solid #eee', borderRadius:12, padding:16 }}>
      <h3 style={{ marginBottom:12 }}>Submit Evidence</h3>
      <div style={{ display:'grid', gap:12, maxWidth:900 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:12 }}>
          <div>
            <label style={{ display:'block', fontSize:12, color:'#64748b', marginBottom:4 }}>Case ID</label>
            <input
              type="text"
              placeholder="Enter Case ID (e.g., C001)"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              style={{ width:'100%', padding:'10px 12px', border:'1px solid #e5e7eb', borderRadius:8 }}
            />
          </div>
          <div>
            <label style={{ display:'block', fontSize:12, color:'#64748b', marginBottom:4 }}>Evidence Name</label>
            <input
              type="text"
              placeholder="e.g., CCTV Footage Description"
              value={evidenceName}
              onChange={(e) => setEvidenceName(e.target.value)}
              style={{ width:'100%', padding:'10px 12px', border:'1px solid #e5e7eb', borderRadius:8 }}
            />
          </div>
        </div>

        <div>
          <div style={{ fontSize:13, color:'#475569', marginBottom:6 }}>Attach Documents (optional)</div>
          <div style={{ display:'grid', gap:10 }}>
            {docs.map((d, idx) => (
              <div key={idx} style={{ display:'grid', gridTemplateColumns:'2fr 2fr auto', gap:10, alignItems:'center' }}>
                <input
                  placeholder="Document Name"
                  value={d.name}
                  onChange={(e) => updateDoc(idx, 'name', e.target.value)}
                  style={{ padding:'10px 12px', border:'1px solid #e5e7eb', borderRadius:8 }}
                />
                <input
                  placeholder="Link (optional)"
                  value={d.url}
                  onChange={(e) => updateDoc(idx, 'url', e.target.value)}
                  style={{ padding:'10px 12px', border:'1px solid #e5e7eb', borderRadius:8 }}
                />
                <div>
                  {docs.length > 1 && (
                    <button onClick={() => removeRow(idx)} style={{ padding:'10px 12px', border:'1px solid #e11d48', background:'#fee2e2', color:'#991b1b', borderRadius:8, cursor:'pointer' }}>
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div>
              <button onClick={addRow} style={{ padding:'10px 12px', border:'1px solid #10b981', background:'#ecfdf5', color:'#065f46', borderRadius:10, cursor:'pointer' }}>
                + Add another document
              </button>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ padding:'10px 16px', border:'1px solid #1d4ed8', background:'#2563eb', color:'#fff', borderRadius:10, cursor: loading ? 'not-allowed':'pointer', opacity: loading?0.7:1 }}
          >
            {loading ? 'Submitting…' : 'Submit'}
          </button>
          {msg && <div style={{ marginTop:8, color: msg.includes('failed')?'#b91c1c':'#0d6b0d' }}>{msg}</div>}
        </div>
      </div>
    </div>
  );
}

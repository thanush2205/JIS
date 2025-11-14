import React, { useEffect, useState } from "react";
import { CasesAPI, UsersAPI } from "../../services/api";
import { useCases } from "../../context/CasesContext.jsx";
import "./JudgeActions.css";

export default function ReviewEvidence() {
  const { refresh } = useCases();
  const [caseId, setCaseId] = useState("");
  const [fileName, setFileName] = useState("");
  const [msg, setMsg] = useState("");
  const [docFiles, setDocFiles] = useState([]);
  const [docMsg, setDocMsg] = useState("");
  const [me, setMe] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try { const u = await UsersAPI.me(); if (alive) setMe(u); } catch {}
    })();
    return () => { alive = false; };
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setMsg("");
    const id = caseId.trim();
    const name = fileName.trim() || "Unnamed";
    try {
  const evidenceItem = await CasesAPI.addEvidence(id, name);
      setMsg(`Evidence '${evidenceItem.name}' added to ${id}.`);
      setFileName("");
  refresh();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const handleDocs = async (e) => {
    e.preventDefault();
    setDocMsg("");
    const id = caseId.trim();
    if (!id) { setDocMsg("Enter a Case ID first"); return; }
    if (!docFiles || docFiles.length === 0) { setDocMsg("Select one or more documents"); return; }
    try {
      const documents = Array.from(docFiles).map(f => ({
        name: f.name,
        size: f.size,
        type: f.type,
        uploadedAt: new Date().toISOString(),
        uploadedBy: me?.id || 'Judge',
      }));
      await CasesAPI.addDocuments(id, documents);
      setDocMsg(`${documents.length} document(s) added to ${id}.`);
      setDocFiles([]);
      // clear the file input visually
      const input = document.getElementById('doc-input');
      if (input) input.value = '';
      refresh();
    } catch (err) {
      setDocMsg(err.message);
    }
  };

  return (
    <div className="ja-panel" style={{ padding: 16 }}>
      <h3 style={{ marginBottom: 8 }}>📁 Review / Upload Evidence</h3>
      <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:16, maxWidth: 1000 }}>
        <form className="ja-form" onSubmit={handleUpload} style={{ border:'1px solid #e5e7eb', borderRadius:10, padding:14, background:'#fff' }}>
          <div style={{ fontWeight:600, marginBottom:8 }}>Add Evidence (name only)</div>
          <input value={caseId} onChange={(e) => setCaseId(e.target.value)} placeholder="Case ID (e.g., C001)" className="ja-input" />
          <input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="Evidence name" className="ja-input" />
          <button className="ja-btn" type="submit">Add Evidence</button>
          {msg && <div className="ja-info" style={{ marginTop:8 }}>{msg}</div>}
        </form>

        <form onSubmit={handleDocs} style={{ border:'1px solid #e5e7eb', borderRadius:10, padding:14, background:'#fff' }}>
          <div style={{ fontWeight:600, marginBottom:8 }}>Upload Documents</div>
          <div style={{ display:'grid', gap:10 }}>
            <div style={{ border:'2px dashed #cbd5e1', borderRadius:10, padding:16, background:'#f8fafc' }}>
              <label htmlFor="doc-input" style={{ display:'block', cursor:'pointer' }}>
                <div style={{ color:'#334155', marginBottom:8 }}>Select files to attach as evidence documents for case <strong>{caseId || '—'}</strong></div>
                <input id="doc-input" type="file" multiple onChange={(e)=>setDocFiles(e.target.files)} style={{ display:'block' }} />
              </label>
              {docFiles && docFiles.length > 0 && (
                <ul style={{ marginTop:10, paddingLeft:18 }}>
                  {Array.from(docFiles).map((f,idx) => (
                    <li key={idx} style={{ color:'#475569' }}>{f.name} <span style={{ color:'#64748b' }}>({(f.size/1024).toFixed(1)} KB)</span></li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <button className="ja-btn" type="submit">Add Documents</button>
            </div>
            {docMsg && <div className="ja-info">{docMsg}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}

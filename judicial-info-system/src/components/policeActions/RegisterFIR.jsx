import React, { useState } from "react";
import { CasesAPI } from "../../services/api";

export default function RegisterFIR() {
  const [firNumber, setFirNumber] = useState("");
  const [accused, setAccused] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const num = firNumber.trim();
    const accRaw = accused.trim();
    const desc = description.trim();
    if (!num || !accRaw) return setMsg("Provide FIR number and at least one accused name.");
    const accusedList = accRaw.split(',').map(a => a.trim()).filter(Boolean);
    try {
      setLoading(true); setMsg("");
      const payload = {
        title: `FIR ${num}`,
        type: "Criminal",
        court: "Pending",
        judge: "",
        lawyer: "",
        accused: accusedList,
        description: desc,
        registeredBy: 'POLICE',
      };
      const newCase = await CasesAPI.create(payload);
      setMsg(`FIR registered as case ${newCase.id}.`);
      setFirNumber(""); setAccused(""); setDescription("");
    } catch (e) {
      setMsg(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background:'#fff', border:'1px solid #eee', borderRadius:12, padding:16 }}>
      <h3 style={{ marginBottom:12 }}>Register FIR / Case</h3>
      <div style={{ display:'grid', gap:10, maxWidth:600 }}>
        <input
          type="text"
          placeholder="FIR Number"
          value={firNumber}
          onChange={(e) => setFirNumber(e.target.value)}
          style={{ padding:'10px 12px', border:'1px solid #e5e7eb', borderRadius:8 }}
        />
        <input
          type="text"
          placeholder="Accused Names (comma separated)"
          value={accused}
          onChange={(e) => setAccused(e.target.value)}
          style={{ padding:'10px 12px', border:'1px solid #e5e7eb', borderRadius:8 }}
        />
        <textarea
          placeholder="Description / Narrative"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{ padding:'10px 12px', border:'1px solid #e5e7eb', borderRadius:8, resize:'vertical' }}
        />
        <button
          onClick={handleRegister}
          disabled={loading}
          style={{ padding:'10px 14px', border:'1px solid #1d4ed8', background:'#2563eb', color:'#fff', borderRadius:10, cursor: loading ? 'not-allowed':'pointer', opacity: loading?0.7:1 }}
        >
          {loading ? 'Registering...' : 'Register Case'}
        </button>
        {msg && <div style={{ marginTop:4, color: msg.includes('failed')?'#b91c1c':'#0d6b0d' }}>{msg}</div>}
      </div>
    </div>
  );
}

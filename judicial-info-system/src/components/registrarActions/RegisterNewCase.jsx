import React, { useState } from "react";
import { CasesAPI } from "../../services/api";
import { useCases } from "../../context/CasesContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function RegisterNewCase() {
  const [caseTitle, setCaseTitle] = useState("");
  const [description, setDescription] = useState("");
  const [accused, setAccused] = useState("");

  const { refresh } = useCases();
  const { user } = useAuth();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!caseTitle) return;
    try {
      setLoading(true); setMsg("");
      const accusedList = accused.split(',').map(a => a.trim()).filter(Boolean);
      const created = await CasesAPI.create({ title: caseTitle, type: 'Pending', court: '', judge: '', lawyer: '', accused: accusedList, description, registeredBy: user?.id });
      setMsg(`Registered case ${created.id}`);
      setCaseTitle(""); setDescription(""); setAccused("");
      refresh();
    } catch (e) {
      setMsg(e.message);
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h3>Register New Case</h3>
      <input
        type="text"
        placeholder="Case Title"
        value={caseTitle}
        onChange={(e) => setCaseTitle(e.target.value)}
        style={{ width: "100%", marginBottom: "6px" }}
      />
      <textarea
        placeholder="Case Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        style={{ width: "100%" }}
      />
      <input
        type="text"
        placeholder="Accused Names (comma separated)"
        value={accused}
        onChange={(e) => setAccused(e.target.value)}
        style={{ width: "100%", marginTop: 6 }}
      />
  <button onClick={handleRegister} style={{ marginTop: "10px" }} disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
  {msg && <div style={{ marginTop: '6px', color: '#0d6b0d' }}>{msg}</div>}
    </div>
  );
}

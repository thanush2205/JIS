import React, { useEffect, useMemo, useRef, useState } from "react";
import { CasesAPI, UsersAPI } from "../../services/api";

export default function UploadDocuments() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const dropdownRef = useRef(null);

  const [docs, setDocs] = useState([{ name: "", url: "" }]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const u = await UsersAPI.me();
        const all = await CasesAPI.list();
        if (!alive) return;
        const mine = (all || []).filter(
          (c) => c.lawyerId === u.id || (!c.lawyerId && (c.lawyer || "").toLowerCase().includes((u.fullName || "").toLowerCase()))
        );
        setCases(mine);
        if (mine.length) setSelectedCaseId(mine[0].id);
      } catch (e) {
        setError(e.message || "Failed to load cases");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = cases.map((c) => ({ value: c.id, label: `${c.id} --- ${c.title || "Untitled"}` }));
    if (!q) return list;
    return list.filter((o) => o.label.toLowerCase().includes(q));
  }, [cases, query]);

  const selectedLabel = useMemo(() => {
    const found = cases.find((c) => c.id === selectedCaseId);
    return found ? `${found.id} --- ${found.title || "Untitled"}` : "Select a case";
  }, [cases, selectedCaseId]);

  const updateDoc = (idx, key, value) => {
    setDocs((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: value };
      return next;
    });
  };

  const addRow = () => setDocs((d) => [...d, { name: "", url: "" }]);
  const removeRow = (idx) => setDocs((d) => d.filter((_, i) => i !== idx));

  const handleUpload = async () => {
    const payload = docs
      .map((d) => ({ name: d.name.trim(), url: d.url.trim(), uploadedAt: new Date().toISOString() }))
      .filter((d) => d.name);
    if (!selectedCaseId) {
      alert("Please select a case.");
      return;
    }
    if (payload.length === 0) {
      alert("Please add at least one document name.");
      return;
    }
    try {
      setLoading(true);
      await CasesAPI.addDocuments(selectedCaseId, payload);
      alert(`Uploaded ${payload.length} document(s) for ${selectedCaseId}`);
      setDocs([{ name: "", url: "" }]);
    } catch (e) {
      alert(e.message || "Failed to upload documents");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
      <h3 style={{ marginBottom: 12 }}>Upload Documents</h3>

      {/* Case combobox */}
      <div ref={dropdownRef} style={{ position: "relative", maxWidth: 640, marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 13, color: "#475569", marginBottom: 6 }}>Case</label>
        <div
          onClick={() => setOpen((o) => !o)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "10px 12px",
            cursor: "pointer",
            background: "#f8fafc",
          }}
        >
          <span style={{ color: selectedCaseId ? "#0f172a" : "#94a3b8" }}>{selectedLabel}</span>
          <span style={{ color: "#64748b" }}>▾</span>
        </div>
        {open && (
          <div
            style={{
              position: "absolute",
              zIndex: 20,
              top: "100%",
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              marginTop: 6,
              boxShadow: "0 12px 30px rgba(2,6,23,0.08)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: 8, borderBottom: "1px solid #f1f5f9" }}>
              <input
                autoFocus
                placeholder="Search case (ID or title)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8 }}
              />
            </div>
            <div style={{ maxHeight: 260, overflowY: "auto" }}>
              {loading && <div style={{ padding: 12, color: "#64748b" }}>Loading…</div>}
              {!loading && options.length === 0 && <div style={{ padding: 12, color: "#64748b" }}>No matches</div>}
              {!loading &&
                options.map((o) => (
                  <div
                    key={o.value}
                    onClick={() => {
                      setSelectedCaseId(o.value);
                      setOpen(false);
                    }}
                    style={{
                      padding: "10px 12px",
                      cursor: "pointer",
                      background: selectedCaseId === o.value ? "#eef2ff" : "transparent",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = selectedCaseId === o.value ? "#eef2ff" : "transparent")}
                  >
                    {o.label}
                  </div>
                ))}
            </div>
          </div>
        )}
        {error && <div style={{ color: "#b91c1c", marginTop: 6 }}>{error}</div>}
      </div>

      {/* Document rows */}
      <div style={{ display: "grid", gap: 12, maxWidth: 820 }}>
        {docs.map((d, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: 12,
              background: "#f9fafb",
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#475569", marginBottom: 4 }}>Document Name</label>
              <input
                value={d.name}
                onChange={(e) => updateDoc(idx, "name", e.target.value)}
                placeholder="e.g., Medical Report"
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#475569", marginBottom: 4 }}>Link (optional)</label>
              <input
                value={d.url}
                onChange={(e) => updateDoc(idx, "url", e.target.value)}
                placeholder="https://..."
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8 }}
              />
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "end", height: "100%" }}>
              {docs.length > 1 && (
                <button
                  onClick={() => removeRow(idx)}
                  style={{ padding: "10px 12px", border: "1px solid #e11d48", background: "#fee2e2", color: "#991b1b", borderRadius: 8, cursor: "pointer" }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
        <div>
          <button
            onClick={addRow}
            style={{ padding: "10px 14px", border: "1px solid #10b981", background: "#ecfdf5", color: "#065f46", borderRadius: 10, cursor: "pointer" }}
          >
            + Add another document
          </button>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <button
          onClick={handleUpload}
          disabled={loading || !selectedCaseId}
          style={{
            padding: "10px 16px",
            border: "1px solid #1d4ed8",
            background: "#2563eb",
            color: "#fff",
            borderRadius: 10,
            cursor: loading || !selectedCaseId ? "not-allowed" : "pointer",
            opacity: loading || !selectedCaseId ? 0.7 : 1,
          }}
        >
          {loading ? "Uploading..." : "Upload Documents"}
        </button>
      </div>
    </div>
  );
}

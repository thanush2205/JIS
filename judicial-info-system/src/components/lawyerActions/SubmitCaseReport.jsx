import React, { useEffect, useMemo, useRef, useState } from "react";
import { CasesAPI, UsersAPI } from "../../services/api";

export default function SubmitCaseReport() {
  const [me, setMe] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [report, setReport] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const u = await UsersAPI.me();
        if (!alive) return;
        setMe(u);
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
    const list = cases.map((c) => ({
      value: c.id,
      label: `${c.id} --- ${c.title || "Untitled"}`,
    }));
    if (!q) return list;
    return list.filter((o) => o.label.toLowerCase().includes(q));
  }, [cases, query]);

  const selectedLabel = useMemo(() => {
    const found = cases.find((c) => c.id === selectedCaseId);
    return found ? `${found.id} --- ${found.title || "Untitled"}` : "Select a case";
  }, [cases, selectedCaseId]);

  const handleSubmit = async () => {
    if (!selectedCaseId) {
      alert("Please select a case.");
      return;
    }
    if (!report.trim()) {
      alert("Please write a report.");
      return;
    }
    try {
      setLoading(true);
      await CasesAPI.addReport(selectedCaseId, report.trim());
      alert(`Report submitted for ${selectedCaseId}.`);
      setReport("");
    } catch (e) {
      alert(e.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
      <h3 style={{ marginBottom: 12 }}>Submit Case Report</h3>

      {/* Case combobox */}
      <div ref={dropdownRef} style={{ position: "relative", maxWidth: 640, marginBottom: 12 }}>
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
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                }}
              />
            </div>
            <div style={{ maxHeight: 260, overflowY: "auto" }}>
              {loading && <div style={{ padding: 12, color: "#64748b" }}>Loading…</div>}
              {!loading && options.length === 0 && (
                <div style={{ padding: 12, color: "#64748b" }}>No matches</div>
              )}
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

      {/* Report text area */}
      <div style={{ maxWidth: 820, marginTop: 8 }}>
        <label style={{ display: "block", fontSize: 13, color: "#475569", marginBottom: 6 }}>Report</label>
        <textarea
          placeholder="Write your report here..."
          value={report}
          onChange={(e) => setReport(e.target.value)}
          rows={6}
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            background: "#f8fafc",
            resize: "vertical",
          }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <button
          onClick={handleSubmit}
          disabled={loading || !selectedCaseId || !report.trim()}
          style={{
            padding: "10px 16px",
            border: "1px solid #1d4ed8",
            background: "#2563eb",
            color: "#fff",
            borderRadius: 10,
            cursor: loading || !selectedCaseId || !report.trim() ? "not-allowed" : "pointer",
            opacity: loading || !selectedCaseId || !report.trim() ? 0.7 : 1,
          }}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </div>
  );
}

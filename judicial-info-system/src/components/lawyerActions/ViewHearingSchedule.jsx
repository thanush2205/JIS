import React, { useEffect, useMemo, useState } from "react";
import { CasesAPI } from "../../services/api";

function getNextHearing(hearingDates = []) {
  if (!Array.isArray(hearingDates) || hearingDates.length === 0) return null;
  const today = new Date();
  const parsed = hearingDates
    .map((d) => ({ raw: d, dt: new Date(d) }))
    .filter((x) => !isNaN(x.dt.getTime()))
    .sort((a, b) => a.dt - b.dt);
  const upcoming = parsed.find((x) => x.dt >= new Date(today.toDateString()));
  return (upcoming || parsed[parsed.length - 1])?.raw || null;
}

export default function ViewHearingSchedule() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
  const all = await CasesAPI.list();
        if (!alive) return;
  setItems(all || []);
      } catch (e) {
        setError(e.message || "Failed to load hearing schedule");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) => (c.id || "").toLowerCase().includes(q) || (c.title || "").toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div style={{ padding: 16, background: "#fff", border: "1px solid #eee", borderRadius: 12 }}>
      <h3 style={{ marginBottom: 8 }}>Hearing Schedule</h3>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12, maxWidth: 900 }}>
        <input
          placeholder="Search by Case ID or Title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, minWidth: 320, padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8 }}
        />
        {query && (
          <button onClick={() => setQuery("")} style={{ padding: "10px 14px", border: "1px solid #e5e7eb", background: "#f8fafc", borderRadius: 8, cursor: "pointer" }}>
            Clear
          </button>
        )}
      </div>

      {error && <div style={{ marginBottom: 8, color: "#b91c1c" }}>{error}</div>}

      <div style={{ overflowX: "auto", border: "1px solid #eee", borderRadius: 12, boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}>
        <table style={{ width: "100%", minWidth: 1000, borderCollapse: "separate", borderSpacing: 0 }}>
          <thead>
            <tr style={{ background: "linear-gradient(90deg,#f9fafb,#eef2ff)" }}>
              <th style={{ textAlign: "left", padding: "14px 16px", borderBottom: "1px solid #e5e7eb" }}>Case ID</th>
              <th style={{ textAlign: "left", padding: "14px 16px", borderBottom: "1px solid #e5e7eb" }}>Title</th>
              <th style={{ textAlign: "left", padding: "14px 16px", borderBottom: "1px solid #e5e7eb" }}>Next Hearing</th>
              <th style={{ textAlign: "left", padding: "14px 16px", borderBottom: "1px solid #e5e7eb" }}>All Hearings</th>
              <th style={{ textAlign: "left", padding: "14px 16px", borderBottom: "1px solid #e5e7eb" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} style={{ padding: 18 }}>Loading…</td>
              </tr>
            )}
            {!loading &&
              filtered.map((c, i) => {
                const dates = Array.isArray(c.hearingDates) ? c.hearingDates : [];
                const next = getNextHearing(dates);
                return (
                  <tr key={c.id} style={{ background: i % 2 ? "#ffffff" : "#fbfdff" }}>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>{c.id}</td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>{c.title}</td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>{next || "—"}</td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>{dates.length || 0}</td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>{c.status}</td>
                  </tr>
                );
              })}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 18, color: "#64748b" }}>No hearings to show.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

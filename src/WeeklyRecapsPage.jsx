import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ── helpers ────────────────────────────────────────────────
function getWeekBounds(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon...
  
  // Shift so Monday is 0, Sunday is 6
  // if day is 0 (Sun), we subtract 6. Otherwise subtract (day - 1)
  const diffToMon = day === 0 ? 6 : day - 1;
  
  const mon = new Date(d);
  mon.setDate(d.getDate() - diffToMon);
  
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  
  const fmt = (x) => {
    const year = x.getFullYear();
    const month = String(x.getMonth() + 1).padStart(2, "0");
    const day = String(x.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  return { start: fmt(mon), end: fmt(sun) };
}

function getEquivalentMiles(run) {
  return isBikeRun(run)
    ? run.miles / 4
    : run.miles;
}

function isBikeRun(run) {
  return run.workout_type === "bike" || run.workoutType === "bike";
}

function getRunDateForWeek(run) {
  if (run.timestamp_utc) {
    return new Date(run.timestamp_utc);
  }
  if (run.date) {
    return new Date(`${run.date}T12:00:00`);
  }
  return new Date();
}

function buildWeekStatsFromRuns(runs) {
  const weeks = new Map();

  for (const r of runs) {
    const { start, end } = getWeekBounds(getRunDateForWeek(r));
    const key = start;

    if (!weeks.has(key)) {
      weeks.set(key, {
        week_start: start,
        week_end: end,
        total_miles: 0,
        run_count: 0,
        bike_count: 0,
        active_days: new Set(),
        runner_breakdown: {},
      });
    }

    const w = weeks.get(key);

    w.total_miles += getEquivalentMiles(r);
    if (isBikeRun(r)) {
      w.bike_count += 1;
    } else {
      w.run_count += 1;
    }
    w.active_days.add(r.date);
    w.runner_breakdown[r.name] =
      (w.runner_breakdown[r.name] || 0) + getEquivalentMiles(r);
  }

  return weeks;
}

function weekStatsToRecapPayload(w) {
  const sorted = Object.entries(w.runner_breakdown).sort((a, b) => b[1] - a[1]);

  return {
    week_start: w.week_start,
    week_end: w.week_end,
    total_miles: w.total_miles,
    top_runner: sorted[0]?.[0] || "",
    run_count: w.run_count,
    bike_count: w.bike_count,
    active_days: w.active_days.size,
    runner_breakdown: w.runner_breakdown,
  };
}

function enrichRecapsWithRuns(recaps, runs) {
  const weekStats = buildWeekStatsFromRuns(runs);

  return recaps.map((recap) => {
    const computed = weekStats.get(recap.week_start);
    if (!computed) return recap;
    return { ...recap, ...weekStatsToRecapPayload(computed) };
  });
}

function formatDate(str) {
  if (!str) return "";
  const [y, m, d] = str.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[+m - 1]} ${+d}`;
}

// ── Shared Styles ──────────────────────────────────────────
const NAV_BTN_STYLE = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  color: "white",
  padding: "8px 16px",
  fontSize: 13,
  cursor: "pointer",
  fontFamily: "'DM Mono', monospace",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

// ── components ─────────────────────────────────────────────
function StatCard({ emoji, label, value, sub }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.06)",
      borderRadius: 16,
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      border: "1px solid rgba(255,255,255,0.1)",
    }}>
      <span style={{ fontSize: 28 }}>{emoji}</span>
      <span style={{ fontSize: 11, opacity: 0.5, fontFamily: "'DM Mono'", textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Syne'" }}>{value}</span>
      {sub && <span style={{ fontSize: 12, opacity: 0.4 }}>{sub}</span>}
    </div>
  );
}

function RunnerBar({ name, miles, maxMiles, rank }) {
  const pct = maxMiles > 0 ? (miles / maxMiles) * 100 : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
      <span style={{ fontSize: 12, width: 24 }}>{rank < 3 ? ["🥇","🥈","🥉"][rank] : `${rank + 1}.`}</span>
      <span style={{ fontSize: 14, fontWeight: 600, width: 80, overflow: "hidden" }}>{name}</span>
      <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 8 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#22c55e", borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: 13, fontFamily: "'DM Mono'", opacity: 0.8 }}>{miles.toFixed(1)}</span>
    </div>
  );
}

function RecapCard({ recap, weekNumber }) {
  const [expanded, setExpanded] = useState(false);
  const runnerBreakdown = recap.runner_breakdown || {};
  const sorted = Object.entries(runnerBreakdown).sort((a, b) => b[1] - a[1]);
  const maxMiles = sorted[0]?.[1] || 1;

  return (
    <div style={{ background: "#111827", borderRadius: 24, border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", marginBottom: 24 }}>
      <div style={{ background: "linear-gradient(135deg, #14532d 0%, #0f172a 100%)", padding: "24px 32px" }}>
        <div style={{ opacity: 0.5, fontSize: 10, fontFamily: "'DM Mono'" }}>WEEK {weekNumber}</div>
        <h2 style={{ margin: 0, fontSize: 22 }}>{formatDate(recap.week_start)} — {formatDate(recap.week_end)}</h2>
      </div>
      <div style={{ padding: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        <StatCard emoji="🏆" label="Leader" value={recap.top_runner || "—"} />
        <StatCard emoji="📏" label="Total" value={recap.total_miles?.toFixed(1)} sub="miles" />
        {recap.run_count > 0 && (
          <StatCard emoji="🏃" label="Runs" value={recap.run_count} />
        )}
        {recap.bike_count > 0 && (
          <StatCard emoji="🚴" label="Bike Rides" value={recap.bike_count} />
        )}
      </div>
      <div style={{ padding: "0 24px 24px" }}>
        {sorted.map(([name, miles], i) => (
          <RunnerBar key={name} name={name} miles={miles} maxMiles={maxMiles} rank={i} />
        ))}
      </div>
    </div>
  );
}

// ── Generate Button ────────────────────────────────────────
function GenerateRecapButton({ targetDate, onGenerated }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function generateThisWeek() {
    setLoading(true);
    setStatus("Syncing all weeks...");

    const { data: runs, error } = await supabase
      .from("runs")
      .select("id, name, miles, date, workout_type, timestamp_utc");

    if (error) {
      setStatus(`Sync failed: ${error.message}`);
      setLoading(false);
      return;
    }

    if (!runs?.length) {
      setStatus("No runs found.");
      setLoading(false);
      return;
    }

    const weeks = buildWeekStatsFromRuns(runs);
    let failCount = 0;
    let bikeColumnMissing = false;

    for (const w of weeks.values()) {
      const payload = weekStatsToRecapPayload(w);
      let { error: upsertError } = await supabase
        .from("weekly_recaps")
        .upsert(payload, { onConflict: "week_start" });

      if (
        upsertError &&
        upsertError.message?.toLowerCase().includes("bike_count")
      ) {
        bikeColumnMissing = true;
        const { bike_count: _bikeCount, ...payloadWithoutBikeCount } = payload;
        ({ error: upsertError } = await supabase
          .from("weekly_recaps")
          .upsert(payloadWithoutBikeCount, { onConflict: "week_start" }));
      }

      if (upsertError) {
        console.error("Weekly recap upsert failed:", upsertError);
        failCount += 1;
      }
    }

    if (failCount > 0) {
      setStatus(`Sync finished with ${failCount} error(s). Check console.`);
    } else if (bikeColumnMissing) {
      setStatus("✅ Synced (add bike_count column in Supabase for bike stats).");
    } else {
      setStatus("✅ All weeks synced!");
    }

    onGenerated();
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {status && <span style={{ fontSize: 11, opacity: 0.5 }}>{status}</span>}
      <button onClick={generateThisWeek} disabled={loading} style={{ ...NAV_BTN_STYLE, background: "#22c55e", border: "none" }}>
        {loading ? "..." : "⚡ Sync Stats"}
      </button>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────
export default function WeeklyRecapsPage({ onBack }) {
  const [recaps, setRecaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generationDate, setGenerationDate] = useState(new Date());

  const shiftWeek = (days) => {
    const d = new Date(generationDate);
    d.setDate(d.getDate() + days);
    setGenerationDate(d);
  };

  async function fetchRecaps() {
    const [recapsRes, runsRes] = await Promise.all([
      supabase
        .from("weekly_recaps")
        .select("*")
        .order("week_start", { ascending: false }),
      supabase
        .from("runs")
        .select("id, name, miles, date, workout_type, timestamp_utc"),
    ]);

    if (recapsRes.error) {
      console.error("Failed to fetch recaps:", recapsRes.error);
    }
    if (runsRes.error) {
      console.error("Failed to fetch runs for recap enrichment:", runsRes.error);
    }

    const recaps = recapsRes.data || [];
    const runs = runsRes.data || [];

    setRecaps(
      runs.length > 0 ? enrichRecapsWithRuns(recaps, runs) : recaps
    );
    setLoading(false);
  }

  useEffect(() => { fetchRecaps(); }, []);

  const { start, end } = getWeekBounds(generationDate);

  return (
    <div style={{ minHeight: "100vh", background: "#080d14", color: "white", fontFamily: "'Syne', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;900&family=DM+Mono&display=swap" rel="stylesheet" />
      
      {/* HEADER */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(8,13,20,0.8)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
           <button onClick={onBack} style={NAV_BTN_STYLE}>← Back</button>
           <div style={{ fontSize: 14, fontWeight: 700 }}>Weekly Recaps</div>
        </div>

        <GenerateRecapButton targetDate={generationDate} onGenerated={fetchRecaps} />
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
        {loading ? <p>Loading...</p> : (
          recaps.map((r, i) => <RecapCard key={r.id} recap={r} weekNumber={recaps.length - i} />)
        )}
      </div>
    </div>
  );
}
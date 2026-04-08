/**
 * Arbetsmarknad-sida — Öppen Data Dashboard
 * Design: Data Observatory (mörkt tema, teal/grön accent)
 * Data: SCB AKU (Arbetskraftsundersökningen) — live månadsdata 2025
 */

import { useArbetsloshet } from "@/hooks/useScbData";
import { Briefcase, TrendingDown, TrendingUp, Clock, Loader2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, ReferenceLine
} from "recharts";

// Hårdkodad branschdata (SCB SSYK-statistik 2024)
const branschData = [
  { bransch: "Vård & omsorg", sysselsatta: 850000 },
  { bransch: "Handel", sysselsatta: 620000 },
  { bransch: "Tillverkning", sysselsatta: 590000 },
  { bransch: "Utbildning", sysselsatta: 510000 },
  { bransch: "IT & teknik", sysselsatta: 380000 },
  { bransch: "Bygg", sysselsatta: 340000 },
  { bransch: "Transport", sysselsatta: 290000 },
];

// Historisk sysselsättningstrend (SCB AKU årsdata)
const trendData = [
  { år: "2020", sysselsatta: 65.2, arbetslösa: 8.5 },
  { år: "2021", sysselsatta: 66.1, arbetslösa: 8.8 },
  { år: "2022", sysselsatta: 67.4, arbetslösa: 7.5 },
  { år: "2023", sysselsatta: 67.8, arbetslösa: 7.1 },
  { år: "2024", sysselsatta: 68.2, arbetslösa: 6.9 },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{value: number; name?: string; color?: string}>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl text-xs">
        <p className="text-muted-foreground mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="font-semibold" style={{ color: p.color || "inherit" }}>
            {p.name}: {typeof p.value === "number" ? p.value.toFixed(1) : p.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Arbetsmarknad() {
  const { data: akuData, loading: akuLoading } = useArbetsloshet();

  const senasteAl = akuData.at(-1)?.procent ?? 6.9;
  const forstaAl = akuData[0]?.procent ?? 10.4;
  const trend = senasteAl < forstaAl ? "↓" : "↑";
  const trendColor = senasteAl < forstaAl ? "oklch(0.72 0.20 140)" : "oklch(0.75 0.18 60)";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-8 py-8 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "oklch(0.72 0.17 162)" }}>
            SCB AKU · Månadsdata 2025
          </span>
          {!akuLoading && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: "oklch(0.72 0.17 162 / 0.15)", color: "oklch(0.72 0.17 162)", border: "1px solid oklch(0.72 0.17 162 / 0.3)" }}>
              LIVE DATA
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-foreground"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Arbetsmarknad
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sysselsättning och arbetslöshet · Källa: SCB Arbetskraftsundersökningen (AKU)
        </p>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* KPI-kort */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Sysselsättningsgrad",
              value: "68,2%",
              icon: Briefcase,
              color: "text-primary",
              sub: "Årssnitt 2024"
            },
            {
              label: "Arbetslöshet (dec 2025)",
              value: akuLoading ? "–" : `${senasteAl.toFixed(1).replace(".", ",")}%`,
              icon: TrendingDown,
              color: "text-amber-400",
              sub: akuLoading ? "" : `${trend} vs jan 2025 (${forstaAl.toFixed(1).replace(".", ",")}%)`
            },
            {
              label: "Öppna jobb",
              value: "89 400",
              icon: TrendingUp,
              color: "text-emerald-400",
              sub: "Kvartal 3 2024 · SCB"
            },
            {
              label: "Medelarbetstid/vecka",
              value: "35,8 h",
              icon: Clock,
              color: "text-blue-400",
              sub: "Heltidsekvivalenter"
            },
          ].map(({ label, value, icon: Icon, color, sub }) => (
            <div key={label} className="glow-border rounded-lg p-5 bg-card">
              <Icon className={`w-5 h-5 ${color} mb-3`} />
              <p className="text-xl font-bold text-foreground"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
              {sub && <p className="text-xs mt-0.5" style={{ color: "oklch(0.50 0.015 264)" }}>{sub}</p>}
            </div>
          ))}
        </div>

        {/* Diagram rad 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Live AKU månadsdata */}
          <div className="glow-border rounded-lg p-5 bg-card">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-foreground"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Arbetslöshet 2025 — månadsvis
              </h2>
              {!akuLoading && (
                <span className="text-xs font-semibold" style={{ color: trendColor }}>
                  {trend} {Math.abs(senasteAl - forstaAl).toFixed(1)}pp
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Procent av arbetskraften (15–74 år) · Källa: SCB AKU (live)
            </p>
            {akuLoading ? (
              <div className="h-52 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin" style={{ color: "oklch(0.72 0.17 162)" }} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={akuData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                  <XAxis dataKey="manad" tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }} axisLine={false} tickLine={false}
                    domain={[6, 12]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={8.5} stroke="oklch(0.75 0.18 60 / 0.4)" strokeDasharray="4 4"
                    label={{ value: "Snitt 8,5%", fill: "oklch(0.60 0.015 264)", fontSize: 10, position: "right" }} />
                  <Line type="monotone" dataKey="procent" stroke="oklch(0.72 0.17 162)"
                    strokeWidth={2.5} dot={{ fill: "oklch(0.72 0.17 162)", r: 4 }}
                    activeDot={{ r: 6 }} name="Arbetslöshet" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Branschdata */}
          <div className="glow-border rounded-lg p-5 bg-card">
            <h2 className="text-sm font-semibold text-foreground mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Sysselsatta per bransch
            </h2>
            <p className="text-xs text-muted-foreground mb-4">Antal sysselsatta · Källa: SCB 2024</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={branschData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }}
                  axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="bransch" tick={{ fill: "oklch(0.85 0.005 264)", fontSize: 11 }}
                  axisLine={false} tickLine={false} width={100} />
                <Tooltip formatter={(v: number) => v.toLocaleString("sv-SE")}
                  contentStyle={{ background: "oklch(0.17 0.012 264)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: "8px", fontSize: 12 }} />
                <Bar dataKey="sysselsatta" fill="oklch(0.72 0.17 162)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Historisk trend */}
        <div className="glow-border rounded-lg p-5 bg-card">
          <h2 className="text-sm font-semibold text-foreground mb-1"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Historisk trend 2020–2024
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Sysselsättningsgrad vs arbetslöshet (%) · Källa: SCB AKU årsdata
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
              <XAxis dataKey="år" tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "oklch(0.17 0.012 264)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: "8px", fontSize: 12 }} />
              <Line type="monotone" dataKey="sysselsatta" stroke="oklch(0.72 0.17 162)"
                strokeWidth={2} name="Sysselsatta %" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="arbetslösa" stroke="oklch(0.75 0.18 60)"
                strokeWidth={2} name="Arbetslösa %" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

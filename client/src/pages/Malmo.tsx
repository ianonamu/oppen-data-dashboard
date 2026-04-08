/**
 * Malmö-sida — Öppen Data Dashboard
 * Design: Data Observatory (mörkt tema, teal/grön accent)
 * Data: SCB PxWebApi v1 — Malmö kommunkod 1280
 * Visar: befolkningsutveckling, åldersfördelning, KPI-kort
 */

import { useMalmoBefolkning, useMalmoAldersfordelning } from "@/hooks/useScbData";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Users, TrendingUp, Building2, MapPin, Loader2 } from "lucide-react";

// ─── Anpassad tooltip ─────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{value: number; name?: string}>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl text-xs">
        <p className="text-muted-foreground mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="font-semibold text-foreground">
            {typeof p.value === "number" && p.value > 1000
              ? p.value.toLocaleString("sv-SE")
              : p.value}
            {p.name === "procent" ? "%" : " pers."}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── KPI-kort ─────────────────────────────────────────────────────────────────
const KpiCard = ({
  title, value, unit, sub, icon: Icon, color = "oklch(0.72 0.17 162)"
}: {
  title: string; value: string | number; unit: string; sub?: string;
  icon: React.ElementType; color?: string;
}) => (
  <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{title}</span>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}22` }}>
        <Icon size={16} style={{ color }} />
      </div>
    </div>
    <div className="flex items-end gap-1">
      <span className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {typeof value === "number" ? value.toLocaleString("sv-SE") : value}
      </span>
      <span className="text-sm text-muted-foreground mb-0.5">{unit}</span>
    </div>
    {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
  </div>
);

// ─── Färger för cirkeldiagram ─────────────────────────────────────────────────
const PIE_COLORS = [
  "oklch(0.72 0.17 162)", "oklch(0.62 0.17 162)", "oklch(0.52 0.17 162)",
  "oklch(0.72 0.17 200)", "oklch(0.62 0.17 200)", "oklch(0.52 0.17 200)",
  "oklch(0.72 0.17 240)", "oklch(0.62 0.17 240)", "oklch(0.52 0.17 240)",
  "oklch(0.42 0.17 162)",
];

// ─── Huvud-komponent ──────────────────────────────────────────────────────────
export default function Malmo() {
  const { data: befData, loading: befLoading } = useMalmoBefolkning();
  const { data: alderData, loading: alderLoading } = useMalmoAldersfordelning();

  const senasteBef = befData.at(-1)?.value ?? 0;
  const forstaAr = befData[0]?.value ?? 0;
  const tillvaxtProcent = forstaAr > 0 ? (((senasteBef - forstaAr) / forstaAr) * 100).toFixed(1) : "–";
  const tillvaxtAbsolut = senasteBef - forstaAr;

  // Beräkna mediaålder-proxy: andel 20-39 år
  const ungaVuxna = alderData
    .filter(d => ["20-29","30-39"].includes(d.aldersgrupp))
    .reduce((s, d) => s + d.antal, 0);
  const ungaAndel = senasteBef > 0 ? ((ungaVuxna / senasteBef) * 100).toFixed(1) : "–";

  return (
    <div className="min-h-screen">
      {/* Hero-banner */}
      <div className="relative px-8 py-8 border-b border-border overflow-hidden"
        style={{ background: "linear-gradient(135deg, oklch(0.18 0.02 264) 0%, oklch(0.14 0.03 162) 100%)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, oklch(0.72 0.17 162) 0%, transparent 60%)" }} />
        <div className="relative flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "oklch(0.72 0.17 162 / 0.2)", border: "1px solid oklch(0.72 0.17 162 / 0.4)" }}>
            <MapPin size={16} style={{ color: "oklch(0.72 0.17 162)" }} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "oklch(0.72 0.17 162)" }}>Malmö · Kommunkod 1280</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: "oklch(0.72 0.17 162 / 0.15)", color: "oklch(0.72 0.17 162)", border: "1px solid oklch(0.72 0.17 162 / 0.3)" }}>
            LIVE DATA
          </span>
        </div>
        <h1 className="text-3xl font-bold text-foreground"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Malmö Stad
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Befolkningsstatistik och demografisk analys · Källa: SCB (Statistiska centralbyrån)
        </p>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* KPI-kort */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Befolkning 2024"
            value={befLoading ? "–" : senasteBef}
            unit="pers."
            sub="Folkbokförda invånare"
            icon={Users}
          />
          <KpiCard
            title="Tillväxt 2015–2024"
            value={befLoading ? "–" : `+${tillvaxtProcent}`}
            unit="%"
            sub={befLoading ? "" : `+${tillvaxtAbsolut.toLocaleString("sv-SE")} pers.`}
            icon={TrendingUp}
            color="oklch(0.72 0.20 140)"
          />
          <KpiCard
            title="Unga vuxna (20–39 år)"
            value={alderLoading ? "–" : `${ungaAndel}`}
            unit="% av pop."
            sub="Andel av befolkningen"
            icon={Building2}
            color="oklch(0.72 0.17 220)"
          />
          <KpiCard
            title="Rangordning"
            value="3"
            unit="i Sverige"
            sub="Tredje största stad"
            icon={MapPin}
            color="oklch(0.72 0.17 280)"
          />
        </div>

        {/* Diagram rad 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Befolkningsutveckling */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Befolkningsutveckling
                </h2>
                <p className="text-xs text-muted-foreground">2015–2024 · Malmö · Källa: SCB (live)</p>
              </div>
              {!befLoading && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: "oklch(0.72 0.20 140 / 0.15)", color: "oklch(0.72 0.20 140)" }}>
                  +{tillvaxtProcent}%
                </span>
              )}
            </div>
            {befLoading ? (
              <div className="h-48 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin" style={{ color: "oklch(0.72 0.17 162)" }} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={befData.map(d => ({ år: d.year, befolkning: d.value }))}>
                  <defs>
                    <linearGradient id="malmoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.72 0.17 162)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="oklch(0.72 0.17 162)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" vertical={false} />
                  <XAxis dataKey="år" tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} domain={['dataMin - 5000', 'dataMax + 5000']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="befolkning" stroke="oklch(0.72 0.17 162)"
                    strokeWidth={2} fill="url(#malmoGrad)" dot={{ fill: "oklch(0.72 0.17 162)", r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Åldersfördelning stapeldiagram */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Åldersfördelning
                </h2>
                <p className="text-xs text-muted-foreground">2024 · Malmö · Källa: SCB (live)</p>
              </div>
            </div>
            {alderLoading ? (
              <div className="h-48 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin" style={{ color: "oklch(0.72 0.17 162)" }} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={alderData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" vertical={false} />
                  <XAxis dataKey="aldersgrupp" tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="antal" radius={[4, 4, 0, 0]}>
                    {alderData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Diagram rad 2 — Cirkeldiagram + faktaruta */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Cirkeldiagram åldersfördelning */}
          <div className="bg-card border border-border rounded-xl p-5 lg:col-span-1">
            <h2 className="text-sm font-semibold text-foreground mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Åldersstruktur
            </h2>
            <p className="text-xs text-muted-foreground mb-4">Andel per åldersgrupp · 2024</p>
            {alderLoading ? (
              <div className="h-48 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin" style={{ color: "oklch(0.72 0.17 162)" }} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={alderData} dataKey="antal" nameKey="aldersgrupp"
                    cx="50%" cy="50%" outerRadius={75} innerRadius={40} paddingAngle={2}>
                    {alderData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => v.toLocaleString("sv-SE")} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: "10px", color: "oklch(0.60 0.015 264)" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Faktaruta */}
          <div className="bg-card border border-border rounded-xl p-5 lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-foreground"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Malmö i siffror
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Grundad", value: "1275" },
                { label: "Yta", value: "332 km²" },
                { label: "Täthet", value: `${senasteBef > 0 ? Math.round(senasteBef / 77).toLocaleString("sv-SE") : "–"} pers/km²` },
                { label: "Stadsdelsförvaltningar", value: "10 st" },
                { label: "Kommunfullmäktige", value: "61 ledamöter" },
                { label: "Närmaste storstad", value: "Köpenhamn 30 km" },
              ].map((item, i) => (
                <div key={i} className="rounded-lg p-3"
                  style={{ background: "oklch(1 0 0 / 3%)", border: "1px solid oklch(1 0 0 / 8%)" }}>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                All befolkningsdata hämtas i realtid från{" "}
                <a href="https://www.scb.se" target="_blank" rel="noopener noreferrer"
                  className="underline" style={{ color: "oklch(0.72 0.17 162)" }}>
                  SCB:s öppna API (PxWebApi v1)
                </a>.
                Uppdateras årligen i mars.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

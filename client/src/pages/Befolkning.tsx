/**
 * Befolkning — Live data från SCB PxWebApi v1
 * Design: Data Observatory (mörkt tema, teal accent)
 * Hämtar befolkningsdata i realtid från api.scb.se
 */

import { Users, TrendingUp, Globe, Baby, RefreshCw } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
} from "recharts";
import { useBefolkningPerAr, useBefolkningPerRegion, useBefolkningsTillvaxt } from "@/hooks/useScbData";

const TEAL = "oklch(0.72 0.17 162)";
const TEAL_DIM = "oklch(0.55 0.14 162)";
const CARD_BG = "oklch(0.17 0.012 264)";
const BORDER = "1px solid oklch(1 0 0 / 10%)";

function LoadingCard() {
  return (
    <div className="glow-border rounded-lg p-5 bg-card flex items-center justify-center h-[280px]">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <RefreshCw className="w-6 h-6 animate-spin" style={{ color: TEAL }} />
        <p className="text-xs">Hämtar data från SCB…</p>
      </div>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="glow-border rounded-lg p-5 bg-card flex items-center justify-center h-[280px]">
      <p className="text-xs text-red-400">Fel: {message}</p>
    </div>
  );
}

export default function Befolkning() {
  const { data: befolkningData, loading: bLoading, error: bError } = useBefolkningPerAr();
  const { data: regionData, loading: rLoading, error: rError } = useBefolkningPerRegion();
  const { data: tillvaxtData, loading: tLoading, error: tError } = useBefolkningsTillvaxt();

  const senasteBef = befolkningData.at(-1)?.value ?? 0;
  const forraAretBef = befolkningData.at(-2)?.value ?? 0;
  const tillvaxt = senasteBef - forraAretBef;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Befolkning
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Demografisk statistik för Sverige · Källa:{" "}
            <a
              href="https://www.scb.se/vara-tjanster/oppna-data/api-for-statistikdatabasen/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
              style={{ color: TEAL }}
            >
              SCB PxWebApi (live)
            </a>
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border"
          style={{ borderColor: "oklch(0.72 0.17 162 / 40%)", color: TEAL, background: "oklch(0.72 0.17 162 / 8%)" }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: TEAL }} />
          Live data
        </div>
      </div>

      {/* KPI-kort */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total befolkning (2024)",
            value: bLoading ? "…" : `${(senasteBef / 1_000_000).toFixed(2)}M`,
            icon: Users,
            color: "text-primary",
          },
          {
            label: "Tillväxt senaste år",
            value: bLoading ? "…" : `+${tillvaxt.toLocaleString("sv-SE")}`,
            icon: TrendingUp,
            color: "text-amber-400",
          },
          {
            label: "Utrikes födda",
            value: "20,1%",
            icon: Globe,
            color: "text-blue-400",
          },
          {
            label: "Medelålder",
            value: "41,3 år",
            icon: Baby,
            color: "text-emerald-400",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glow-border rounded-lg p-5 bg-card">
            <Icon className={`w-5 h-5 ${color} mb-3`} />
            <p className="text-xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Diagram rad 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Befolkningsutveckling */}
        <div className="glow-border rounded-lg p-5 bg-card">
          <h2 className="text-sm font-semibold text-foreground mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Befolkningsutveckling 2015–2024
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Live från SCB · Folkmängd per år</p>
          {bLoading ? <LoadingCard /> : bError ? <ErrorCard message={bError} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={befolkningData}>
                <defs>
                  <linearGradient id="befGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={TEAL} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis dataKey="year" tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  formatter={(v: number) => [v.toLocaleString("sv-SE"), "Folkmängd"]}
                  contentStyle={{ background: CARD_BG, border: BORDER, borderRadius: "8px", fontSize: 12 }}
                />
                <Area type="monotone" dataKey="value" stroke={TEAL} strokeWidth={2} fill="url(#befGrad)" dot={{ fill: TEAL, r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Befolkningstillväxt */}
        <div className="glow-border rounded-lg p-5 bg-card">
          <h2 className="text-sm font-semibold text-foreground mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Befolkningstillväxt per år
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Nettotillskott i antal personer</p>
          {tLoading ? <LoadingCard /> : tError ? <ErrorCard message={tError} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={tillvaxtData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis dataKey="year" tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v.toLocaleString("sv-SE")}
                />
                <Tooltip
                  formatter={(v: number) => [v.toLocaleString("sv-SE"), "Tillväxt"]}
                  contentStyle={{ background: CARD_BG, border: BORDER, borderRadius: "8px", fontSize: 12 }}
                />
                <Bar dataKey="value" fill={TEAL_DIM} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Kommuner */}
      <div className="glow-border rounded-lg p-5 bg-card">
        <h2 className="text-sm font-semibold text-foreground mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Befolkning per kommun (2024)
        </h2>
        <p className="text-xs text-muted-foreground mb-4">Live från SCB · Folkmängd i de största kommunerna</p>
        {rLoading ? <LoadingCard /> : rError ? <ErrorCard message={rError} /> : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={regionData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="region"
                tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                formatter={(v: number) => [v.toLocaleString("sv-SE"), "Folkmängd"]}
                contentStyle={{ background: CARD_BG, border: BORDER, borderRadius: "8px", fontSize: 12 }}
              />
              <Bar dataKey="value" fill={TEAL} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

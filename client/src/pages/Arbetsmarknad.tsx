import { Briefcase, TrendingDown, TrendingUp, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const branschData = [
  { bransch: "Vård & omsorg", sysselsatta: 850000 },
  { bransch: "Handel", sysselsatta: 620000 },
  { bransch: "Tillverkning", sysselsatta: 590000 },
  { bransch: "Utbildning", sysselsatta: 510000 },
  { bransch: "IT & teknik", sysselsatta: 380000 },
  { bransch: "Bygg", sysselsatta: 340000 },
  { bransch: "Transport", sysselsatta: 290000 },
];

const trendData = [
  { år: "2020", sysselsatta: 65.2, arbetslösa: 8.5 },
  { år: "2021", sysselsatta: 66.1, arbetslösa: 8.8 },
  { år: "2022", sysselsatta: 67.4, arbetslösa: 7.5 },
  { år: "2023", sysselsatta: 67.8, arbetslösa: 7.1 },
  { år: "2024", sysselsatta: 68.2, arbetslösa: 6.9 },
];

export default function Arbetsmarknad() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Arbetsmarknad</h1>
        <p className="text-sm text-muted-foreground mt-1">Sysselsättning och arbetslöshet · Källa: SCB & Arbetsförmedlingen</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Sysselsättningsgrad", value: "68,2%", icon: Briefcase, color: "text-primary" },
          { label: "Arbetslöshet", value: "6,9%", icon: TrendingDown, color: "text-amber-400" },
          { label: "Öppna jobb", value: "89 400", icon: TrendingUp, color: "text-emerald-400" },
          { label: "Medelarbetstid/vecka", value: "35,8 h", icon: Clock, color: "text-blue-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glow-border rounded-lg p-5 bg-card">
            <Icon className={`w-5 h-5 ${color} mb-3`} />
            <p className="text-xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glow-border rounded-lg p-5 bg-card">
          <h2 className="text-sm font-semibold text-foreground mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Sysselsatta per bransch</h2>
          <p className="text-xs text-muted-foreground mb-4">Antal sysselsatta · Källa: SCB</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={branschData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="bransch" tick={{ fill: "oklch(0.85 0.005 264)", fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip formatter={(v: number) => v.toLocaleString("sv-SE")} contentStyle={{ background: "oklch(0.17 0.012 264)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: "8px", fontSize: 12 }} />
              <Bar dataKey="sysselsatta" fill="oklch(0.72 0.17 162)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glow-border rounded-lg p-5 bg-card">
          <h2 className="text-sm font-semibold text-foreground mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Trend 2020–2024</h2>
          <p className="text-xs text-muted-foreground mb-4">Sysselsättningsgrad vs arbetslöshet (%)</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
              <XAxis dataKey="år" tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "oklch(0.17 0.012 264)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: "8px", fontSize: 12 }} />
              <Line type="monotone" dataKey="sysselsatta" stroke="oklch(0.72 0.17 162)" strokeWidth={2} name="Sysselsatta %" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="arbetslösa" stroke="oklch(0.75 0.18 60)" strokeWidth={2} name="Arbetslösa %" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

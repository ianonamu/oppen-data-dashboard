import { Users, TrendingUp, Globe, Baby } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const aldersData = [
  { grupp: "0–14", antal: 1780000 },
  { grupp: "15–24", antal: 1230000 },
  { grupp: "25–44", antal: 2890000 },
  { grupp: "45–64", antal: 2750000 },
  { grupp: "65–79", antal: 1680000 },
  { grupp: "80+", antal: 590000 },
];

const regionData = [
  { name: "Stockholm", value: 2430000, color: "oklch(0.72 0.17 162)" },
  { name: "Västra Götaland", value: 1780000, color: "oklch(0.65 0.18 200)" },
  { name: "Skåne", value: 1410000, color: "oklch(0.78 0.16 140)" },
  { name: "Övriga", value: 5083000, color: "oklch(0.40 0.01 264)" },
];

export default function Befolkning() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Befolkning</h1>
        <p className="text-sm text-muted-foreground mt-1">Demografisk statistik för Sverige · Källa: SCB</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total befolkning", value: "10,7M", icon: Users, color: "text-primary" },
          { label: "Medelålder", value: "41,3 år", icon: TrendingUp, color: "text-amber-400" },
          { label: "Utrikes födda", value: "20,1%", icon: Globe, color: "text-blue-400" },
          { label: "Födelseöverskott", value: "+12 400", icon: Baby, color: "text-emerald-400" },
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
          <h2 className="text-sm font-semibold text-foreground mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Åldersfördelning</h2>
          <p className="text-xs text-muted-foreground mb-4">Antal personer per åldersgrupp</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={aldersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
              <XAxis dataKey="grupp" tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
              <Tooltip formatter={(v: number) => v.toLocaleString("sv-SE")} contentStyle={{ background: "oklch(0.17 0.012 264)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: "8px", fontSize: 12 }} />
              <Bar dataKey="antal" fill="oklch(0.72 0.17 162)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glow-border rounded-lg p-5 bg-card">
          <h2 className="text-sm font-semibold text-foreground mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Befolkning per region</h2>
          <p className="text-xs text-muted-foreground mb-4">Tre största regioner vs övriga</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={regionData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                {regionData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => v.toLocaleString("sv-SE")} contentStyle={{ background: "oklch(0.17 0.012 264)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: "8px", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2">
            {regionData.map(r => (
              <div key={r.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                <span className="text-xs text-muted-foreground">{r.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

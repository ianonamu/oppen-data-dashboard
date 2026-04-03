/*
 * DESIGN: Data Observatory — Home/Overview page
 * Hero section with background image, KPI cards, charts
 */
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Users, Building2, Briefcase, Activity } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663488160097/LqMu4BsmJe2cLXeSw3FwLe/dashboard-hero-RH4MNjhFyPYFZQKjJoD8t6.webp";

// Simulerad SCB-data (i verkligheten hämtas detta via SCB:s öppna API)
const befolkningData = [
  { år: "2018", antal: 10175214 },
  { år: "2019", antal: 10327589 },
  { år: "2020", antal: 10379295 },
  { år: "2021", antal: 10415811 },
  { år: "2022", antal: 10521556 },
  { år: "2023", antal: 10612086 },
  { år: "2024", antal: 10703000 },
];

const kommunData = [
  { namn: "Stockholm", befolkning: 975551 },
  { namn: "Göteborg", befolkning: 583056 },
  { namn: "Malmö", befolkning: 357069 },
  { namn: "Uppsala", befolkning: 242346 },
  { namn: "Linköping", befolkning: 167681 },
  { namn: "Västerås", befolkning: 155309 },
];

const arbetsloshetData = [
  { månad: "Jan", procent: 8.4 },
  { månad: "Feb", procent: 8.2 },
  { månad: "Mar", procent: 7.9 },
  { månad: "Apr", procent: 7.6 },
  { månad: "Maj", procent: 7.1 },
  { månad: "Jun", procent: 6.8 },
  { månad: "Jul", procent: 7.2 },
  { månad: "Aug", procent: 7.0 },
  { månad: "Sep", procent: 6.9 },
  { månad: "Okt", procent: 6.7 },
  { månad: "Nov", procent: 6.8 },
  { månad: "Dec", procent: 6.9 },
];

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function KpiCard({
  title, value, unit, trend, trendValue, icon: Icon, delay = 0
}: {
  title: string; value: number; unit: string; trend: "up" | "down";
  trendValue: string; icon: React.ElementType; delay?: number;
}) {
  const displayed = useCountUp(value, 1200);
  return (
    <div
      className="glow-border rounded-lg p-5 bg-card card-enter"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-md bg-primary/15 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium ${trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
          {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trendValue}
        </span>
      </div>
      <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {displayed.toLocaleString("sv-SE")}
        <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
      </p>
      <p className="text-xs text-muted-foreground mt-1">{title}</p>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-muted-foreground mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-foreground font-medium">
            {typeof p.value === "number" ? p.value.toLocaleString("sv-SE") : p.value}
            {p.name === "procent" ? "%" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div
        className="relative h-48 flex items-end overflow-hidden"
        style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: "cover", backgroundPosition: "center 40%" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative px-8 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="live-dot" />
            <span className="text-xs text-primary font-medium">LIVE DATA</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Sveriges Öppna Data
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Realtidsöversikt — befolkning, kommuner och arbetsmarknad
          </p>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Total befolkning" value={10703000} unit="pers." trend="up" trendValue="+0.9%" icon={Users} delay={0} />
          <KpiCard title="Antal kommuner" value={290} unit="st" trend="up" trendValue="stabil" icon={Building2} delay={100} />
          <KpiCard title="Sysselsättningsgrad" value={68} unit="%" trend="up" trendValue="+1.2%" icon={Briefcase} delay={200} />
          <KpiCard title="BNP tillväxt" value={2} unit="%" trend="up" trendValue="+0.4%" icon={Activity} delay={300} />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Befolkningsutveckling */}
          <div className="glow-border rounded-lg p-5 bg-card card-enter" style={{ animationDelay: "400ms" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Befolkningsutveckling
                </h2>
                <p className="text-xs text-muted-foreground">2018–2024 · Källa: SCB</p>
              </div>
              <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full">+5.2%</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={befolkningData}>
                <defs>
                  <linearGradient id="befolkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.72 0.17 162)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.72 0.17 162)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis dataKey="år" tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="antal" stroke="oklch(0.72 0.17 162)" strokeWidth={2} fill="url(#befolkGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Arbetslöshet */}
          <div className="glow-border rounded-lg p-5 bg-card card-enter" style={{ animationDelay: "500ms" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Arbetslöshet 2024
                </h2>
                <p className="text-xs text-muted-foreground">Månadsvis · Källa: Arbetsförmedlingen</p>
              </div>
              <span className="text-xs bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full">6.9%</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={arbetsloshetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
                <XAxis dataKey="månad" tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[5, 10]} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="procent" stroke="oklch(0.75 0.18 60)" strokeWidth={2} dot={{ fill: "oklch(0.75 0.18 60)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topp kommuner */}
        <div className="glow-border rounded-lg p-5 bg-card card-enter" style={{ animationDelay: "600ms" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Störst kommuner efter befolkning
              </h2>
              <p className="text-xs text-muted-foreground">Topp 6 · Källa: SCB 2024</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={kommunData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "oklch(0.60 0.015 264)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="namn" tick={{ fill: "oklch(0.85 0.005 264)", fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="befolkning" fill="oklch(0.72 0.17 162)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

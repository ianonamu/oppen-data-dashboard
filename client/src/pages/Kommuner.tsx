import { MapPin, Search } from "lucide-react";
import { useState } from "react";

const kommuner = [
  { namn: "Stockholm", region: "Stockholm", befolkning: 975551, yta: 188, täthet: 5189 },
  { namn: "Göteborg", region: "Västra Götaland", befolkning: 583056, yta: 450, täthet: 1296 },
  { namn: "Malmö", region: "Skåne", befolkning: 357069, yta: 157, täthet: 2274 },
  { namn: "Uppsala", region: "Uppsala", befolkning: 242346, yta: 2188, täthet: 111 },
  { namn: "Linköping", region: "Östergötland", befolkning: 167681, yta: 1432, täthet: 117 },
  { namn: "Västerås", region: "Västmanland", befolkning: 155309, yta: 959, täthet: 162 },
  { namn: "Örebro", region: "Örebro", befolkning: 154028, yta: 1380, täthet: 112 },
  { namn: "Helsingborg", region: "Skåne", befolkning: 149280, yta: 346, täthet: 431 },
  { namn: "Norrköping", region: "Östergötland", befolkning: 145012, yta: 1502, täthet: 97 },
  { namn: "Jönköping", region: "Jönköping", befolkning: 144925, yta: 1496, täthet: 97 },
];

export default function Kommuner() {
  const [search, setSearch] = useState("");
  const filtered = kommuner.filter(k =>
    k.namn.toLowerCase().includes(search.toLowerCase()) ||
    k.region.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Kommuner</h1>
          <p className="text-sm text-muted-foreground mt-1">290 kommuner · Källa: SCB</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Sök kommun..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 w-56"
          />
        </div>
      </div>
      <div className="glow-border rounded-lg bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Kommun</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Region</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Befolkning</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Yta (km²)</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Täthet</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((k, i) => (
              <tr key={k.namn} className={`border-b border-border/50 hover:bg-accent/30 transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="font-medium text-foreground">{k.namn}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">{k.region}</td>
                <td className="px-5 py-3.5 text-right font-medium text-foreground">{k.befolkning.toLocaleString("sv-SE")}</td>
                <td className="px-5 py-3.5 text-right text-muted-foreground">{k.yta.toLocaleString("sv-SE")}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${k.täthet > 1000 ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {k.täthet} /km²
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

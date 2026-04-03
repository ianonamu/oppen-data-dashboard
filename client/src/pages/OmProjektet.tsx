import { Github, Linkedin, Code2, Database, Shield, Globe } from "lucide-react";

export default function OmProjektet() {
  return (
    <div className="p-8 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Om projektet</h1>
        <p className="text-sm text-muted-foreground mt-1">Öppen Data Dashboard — ett fullstack-projekt av Ian Onamu</p>
      </div>

      <div className="glow-border rounded-lg p-6 bg-card space-y-4">
        <h2 className="text-base font-semibold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Syfte</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Detta projekt visualiserar öppen statistik från svenska myndigheter (SCB, Arbetsförmedlingen) 
          i ett modernt, interaktivt dashboard. Syftet är att göra offentlig data mer tillgänglig och 
          lättförståelig för medborgare, journalister och beslutsfattare.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Projektet är ett proof-of-concept för hur kommuner och myndigheter kan presentera sin data 
          på ett modernt sätt — och ett exempel på vad jag som systemutvecklare kan bygga för offentlig sektor.
        </p>
      </div>

      <div className="glow-border rounded-lg p-6 bg-card">
        <h2 className="text-base font-semibold text-foreground mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Teknikstack</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Code2, label: "React 19 + TypeScript", desc: "Frontend" },
            { icon: Globe, label: "Recharts + Tailwind CSS", desc: "Visualisering & design" },
            { icon: Database, label: "SCB & Arbetsförmedlingens API", desc: "Datakällor" },
            { icon: Shield, label: "Vite + Node.js", desc: "Byggverktyg & server" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3 p-3 rounded-md bg-accent/30">
              <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glow-border rounded-lg p-6 bg-card">
        <h2 className="text-base font-semibold text-foreground mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Byggd av</h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            IO
          </div>
          <div>
            <p className="font-semibold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Ian Onamu</p>
            <p className="text-sm text-muted-foreground">Systemutvecklare · HKR, examen juni 2026</p>
            <p className="text-xs text-muted-foreground mt-0.5">Malmö, Sverige</p>
          </div>
        </div>
        <div className="flex gap-3 mt-4 flex-wrap">
          <a href="https://github.com/ianonamu" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md border border-border hover:border-primary/40">
            <Github className="w-4 h-4" />
            github.com/ianonamu
          </a>
          <a href="https://linkedin.com/in/ian-onamu-aaa15217a" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md border border-border hover:border-primary/40">
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

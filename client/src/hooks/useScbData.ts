/**
 * useScbData — Custom React hook för SCB PxWebApi v1
 *
 * Design: Data Observatory (mörkt tema, teal accent)
 * Hämtar live-data från Statistiska centralbyrån (SCB) öppna API.
 * API-dokumentation: https://www.scb.se/vara-tjanster/oppna-data/api-for-statistikdatabasen/
 */

import { useState, useEffect } from "react";

const SCB_BASE = "https://api.scb.se/OV0104/v1/doris/sv/ssd";

export interface ScbDataPoint {
  year: string;
  value: number;
  label?: string;
}

export interface ScbRegionData {
  region: string;
  regionCode: string;
  value: number;
  year: string;
}

// ─── Befolkning Sverige per år ─────────────────────────────────────────────
export function useBefolkningPerAr() {
  const [data, setData] = useState<ScbDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `${SCB_BASE}/BE/BE0101/BE0101A/BefolkningNy`;
        const query = {
          query: [
            { code: "Region", selection: { filter: "item", values: ["00"] } },
            {
              code: "Civilstand",
              selection: { filter: "item", values: ["OG", "G", "SK", "ÄNKL"] },
            },
            {
              code: "Alder",
              selection: { filter: "item", values: ["tot"] },
            },
            {
              code: "Kon",
              selection: { filter: "item", values: ["1", "2"] },
            },
            {
              code: "ContentsCode",
              selection: { filter: "item", values: ["BE0101N1"] },
            },
            {
              code: "Tid",
              selection: {
                filter: "item",
                values: [
                  "2015", "2016", "2017", "2018", "2019",
                  "2020", "2021", "2022", "2023", "2024",
                ],
              },
            },
          ],
          response: { format: "json" },
        };

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(query),
        });

        if (!res.ok) throw new Error(`SCB API svarade ${res.status}`);
        const json = await res.json();

        // Summera per år (alla civilstånd + kön)
        const yearly: Record<string, number> = {};
        for (const row of json.data) {
          const year = row.key[4] as string;
          const val = parseInt(row.values[0], 10);
          yearly[year] = (yearly[year] || 0) + val;
        }

        const result: ScbDataPoint[] = Object.entries(yearly)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([year, value]) => ({ year, value }));

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Okänt fel");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

// ─── Befolkning per region (kommuner) senaste år ───────────────────────────
export function useBefolkningPerRegion() {
  const [data, setData] = useState<ScbRegionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `${SCB_BASE}/BE/BE0101/BE0101A/BefolkningNy`;

        // Hämta de 20 största kommunerna
        const storstaKommuner = [
          "0180", // Stockholm
          "1280", // Malmö
          "1480", // Göteborg
          "0380", // Uppsala
          "1580", // Linköping
          "1283", // Helsingborg
          "0580", // Örebro
          "0680", // Västerås
          "0580", // Örebro
          "2480", // Umeå
          "0880", // Norrköping
          "0680", // Västerås
          "0760", // Jönköping
          "1283", // Helsingborg
          "1880", // Borås
        ];

        // Unika koder
        const kommunKoder = Array.from(new Set(storstaKommuner));

        const query = {
          query: [
            {
              code: "Region",
              selection: { filter: "item", values: kommunKoder },
            },
            {
              code: "Civilstand",
              selection: { filter: "item", values: ["OG", "G", "SK", "ÄNKL"] },
            },
            { code: "Alder", selection: { filter: "item", values: ["tot"] } },
            { code: "Kon", selection: { filter: "item", values: ["1", "2"] } },
            {
              code: "ContentsCode",
              selection: { filter: "item", values: ["BE0101N1"] },
            },
            {
              code: "Tid",
              selection: { filter: "item", values: ["2024"] },
            },
          ],
          response: { format: "json" },
        };

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(query),
        });

        if (!res.ok) throw new Error(`SCB API svarade ${res.status}`);
        const json = await res.json();

        // Kommunnamn-mapping
        const kommunNamn: Record<string, string> = {
          "0180": "Stockholm",
          "1280": "Malmö",
          "1480": "Göteborg",
          "0380": "Uppsala",
          "1580": "Linköping",
          "1283": "Helsingborg",
          "0580": "Örebro",
          "0680": "Västerås",
          "2480": "Umeå",
          "0880": "Norrköping",
          "0760": "Jönköping",
          "1880": "Borås",
        };

        // Summera per region
        const regionData: Record<string, number> = {};
        for (const row of json.data) {
          const regionCode = row.key[0] as string;
          const val = parseInt(row.values[0], 10);
          regionData[regionCode] = (regionData[regionCode] || 0) + val;
        }

        const result: ScbRegionData[] = Object.entries(regionData)
          .map(([regionCode, value]) => ({
            region: kommunNamn[regionCode] || regionCode,
            regionCode,
            value,
            year: "2024",
          }))
          .sort((a, b) => b.value - a.value);

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Okänt fel");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

// ─── Malmö befolkning per år ─────────────────────────────────────────────
export function useMalmoBefolkning() {
  const [data, setData] = useState<ScbDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `${SCB_BASE}/BE/BE0101/BE0101A/BefolkningNy`;
        const query = {
          query: [
            { code: "Region", selection: { filter: "item", values: ["1280"] } },
            { code: "Civilstand", selection: { filter: "item", values: ["OG","G","SK","ÄNKL"] } },
            { code: "Alder", selection: { filter: "item", values: ["tot"] } },
            { code: "Kon", selection: { filter: "item", values: ["1","2"] } },
            { code: "ContentsCode", selection: { filter: "item", values: ["BE0101N1"] } },
            { code: "Tid", selection: { filter: "item", values: ["2015","2016","2017","2018","2019","2020","2021","2022","2023","2024"] } },
          ],
          response: { format: "json" },
        };
        const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(query) });
        if (!res.ok) throw new Error(`SCB API svarade ${res.status}`);
        const json = await res.json();
        const yearly: Record<string, number> = {};
        for (const row of json.data) {
          const year = row.key[4] as string;
          yearly[year] = (yearly[year] || 0) + parseInt(row.values[0], 10);
        }
        setData(Object.entries(yearly).sort(([a],[b]) => a.localeCompare(b)).map(([year, value]) => ({ year, value })));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Okänt fel");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
}

// ─── Malmö åldersfördelning 2024 ──────────────────────────────────────────
export interface MalmoAldersData { aldersgrupp: string; antal: number; }
export function useMalmoAldersfordelning() {
  const [data, setData] = useState<MalmoAldersData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `${SCB_BASE}/BE/BE0101/BE0101A/BefolkningNy`;
        const aldersgrupper = ["0-9","10-19","20-29","30-39","40-49","50-59","60-69","70-79","80-89","90+"];
        const alderKoder = ["0","10","20","30","40","50","60","70","80","90"];
        const query = {
          query: [
            { code: "Region", selection: { filter: "item", values: ["1280"] } },
            { code: "Civilstand", selection: { filter: "item", values: ["OG","G","SK","ÄNKL"] } },
            { code: "Alder", selection: { filter: "item", values: alderKoder } },
            { code: "Kon", selection: { filter: "item", values: ["1","2"] } },
            { code: "ContentsCode", selection: { filter: "item", values: ["BE0101N1"] } },
            { code: "Tid", selection: { filter: "item", values: ["2024"] } },
          ],
          response: { format: "json" },
        };
        const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(query) });
        if (!res.ok) throw new Error(`SCB API svarade ${res.status}`);
        const json = await res.json();
        const byAlder: Record<string, number> = {};
        for (const row of json.data) {
          const alderIdx = alderKoder.indexOf(row.key[2]);
          const label = alderIdx >= 0 ? aldersgrupper[alderIdx] : row.key[2];
          byAlder[label] = (byAlder[label] || 0) + parseInt(row.values[0], 10);
        }
        setData(aldersgrupper.map(g => ({ aldersgrupp: g, antal: byAlder[g] || 0 })));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Okänt fel");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
}

// ─── Arbetslöshet Sverige per månad (SCB AKU) ─────────────────────────────
export interface ArbetsloshetData { manad: string; procent: number; }
export function useArbetsloshet() {
  const [data, setData] = useState<ArbetsloshetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `${SCB_BASE}/AM/AM0401/AM0401A/AKURLBefM`;
        const manader = ["2025M01","2025M02","2025M03","2025M04","2025M05","2025M06","2025M07","2025M08","2025M09","2025M10","2025M11","2025M12"];
        const manadLabels: Record<string,string> = {
          "2025M01":"Jan","2025M02":"Feb","2025M03":"Mar","2025M04":"Apr",
          "2025M05":"Maj","2025M06":"Jun","2025M07":"Jul","2025M08":"Aug",
          "2025M09":"Sep","2025M10":"Okt","2025M11":"Nov","2025M12":"Dec"
        };
        const query = {
          query: [
            { code: "Arbetskraftstillh", selection: { filter: "item", values: ["ALÖSP"] } },
            { code: "TypData", selection: { filter: "item", values: ["O_DATA"] } },
            { code: "Kon", selection: { filter: "item", values: ["1+2"] } },
            { code: "Alder", selection: { filter: "item", values: ["tot15-74"] } },
            { code: "Tid", selection: { filter: "item", values: manader } },
          ],
          response: { format: "json" },
        };
        const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(query) });
        if (!res.ok) throw new Error(`SCB AKU svarade ${res.status}`);
        const json = await res.json();
        const result: ArbetsloshetData[] = json.data.map((row: {key: string[], values: string[]}) => ({
          manad: manadLabels[row.key[row.key.length-1]] || row.key[row.key.length-1],
          procent: parseFloat(row.values[0]),
        }));
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Okänt fel");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
}

// ─── Befolkningstillväxt per år (nettot) ──────────────────────────────────
export function useBefolkningsTillvaxt() {
  const { data, loading, error } = useBefolkningPerAr();

  const tillvaxt: ScbDataPoint[] = data.slice(1).map((d, i) => ({
    year: d.year,
    value: d.value - data[i].value,
    label: `+${(d.value - data[i].value).toLocaleString("sv-SE")}`,
  }));

  return { data: tillvaxt, loading, error };
}

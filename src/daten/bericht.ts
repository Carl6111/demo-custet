import type { Modul } from "./typen";

export const MONAT = { name: "Oktober", berichtVom: "1. November" } as const;

export const ZAHLEN = {
  anrufe: 41,
  ausserhalbBuerozeit: 12,
  vorgaenge: 23,
  angebote: 14,
  nachgefasst: 9,
  beauftragtNachNachfassen: 3,
} as const;

export const OFFEN = [
  "2 Angebote ohne Antwort. Die Erinnerung läuft.",
  "1 Rückfrage an eine Kundin zu Hersteller und Baujahr.",
] as const;

export const VORGAENGE = [
  { nr: "S-0418", wer: "Hoffmann", was: "Störung Gastherme", stand: "Erledigt am 08.10." },
  { nr: "A-2026-117", wer: "Schubert", was: "Angebot Badumbau", stand: "Nachgefasst, beauftragt am 15.10." },
  { nr: "S-0423", wer: "Becker", was: "Heizung macht Geräusche", stand: "Erledigt am 13.10." },
  { nr: "A-2026-121", wer: "Krüger", was: "Angebot Wärmepumpe", stand: "Offen, Erinnerung am 03.11." },
  { nr: "W-0390", wer: "Lehmann", was: "Wartung Gastherme", stand: "Termin am 06.11." },
] as const;

export const SPRECHER_BERICHT =
  "Sagen: Den bekommen Sie jeden Monatsersten. Dann fragen: Was kostet Sie eine Bürostunde? Den Betrag eintippen, nicht selbst schätzen.";

/** Gesparte Büroarbeit im Monat: Vorgänge × Ersparnis je Anruf + Angebote × Ersparnis je Angebot. */
export function ersparnisMinuten(module: Modul[]): number {
  const proStueck = (id: Modul["id"]) => {
    const w = module.find((m) => m.id === id)?.messwerte.find((x) => x.art === "buero");
    if (!w) throw new Error(`Büro-Messwert fehlt: ${id}`);
    return w.heute - w.mit;
  };
  return ZAHLEN.vorgaenge * proStueck("anruf") + ZAHLEN.angebote * proStueck("angebot");
}

import type { Betrieb, Minute, Position } from "./typen";

const TAGE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MIN_PRO_TAG = 1440;
const MIN_PRO_ARBEITSTAG = 480;
export const STANDARD_BETRIEB = "Haustechnik Ohreland GmbH";
const MAX_NAME = 60;

export function uhrzeit(t: Minute): string {
  const tag = TAGE[Math.floor(t / MIN_PRO_TAG) % 7];
  const rest = ((t % MIN_PRO_TAG) + MIN_PRO_TAG) % MIN_PRO_TAG;
  const hh = String(Math.floor(rest / 60)).padStart(2, "0");
  const mm = String(rest % 60).padStart(2, "0");
  return `${tag} ${hh}:${mm}`;
}

export function dauer(minuten: number): string {
  if (minuten < 60) return `${minuten} Min.`;
  const std = minuten / 60;
  if (std < 48) return `${Math.round(std)} Std.`;
  return `${Math.round(std / 24)} Tage`;
}

/** Halbe Stunden, deutsch formatiert: 1047 Min. → "17,5 Std." */
export function stunden(minuten: number): string {
  const h = Math.round((minuten / 60) * 2) / 2;
  return `${h.toLocaleString("de-DE")} Std.`;
}

export function arbeitstage(minuten: number): number {
  return Math.round((minuten / MIN_PRO_ARBEITSTAG) * 10) / 10;
}

export function euro(betrag: number): string {
  return betrag.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

export function summe(positionen: Position[], ergaenzt: number | null = null): { betrag: number; offen: number } {
  return positionen.reduce(
    (acc, p) => {
      const preis = p.einzel ?? ergaenzt;
      return preis === null ? { ...acc, offen: acc.offen + 1 } : { ...acc, betrag: acc.betrag + p.menge * preis };
    },
    { betrag: 0, offen: 0 },
  );
}

export type Abschnitt = { text: string; beleg: number | null };

/** Zerlegt `quelle` so, dass jede gefundene Belegstelle ein eigener Abschnitt mit ihrem Index ist. */
export function markiere(quelle: string, belege: string[]): Abschnitt[] {
  const treffer = belege
    .map((b, i) => ({ i, start: quelle.indexOf(b), ende: quelle.indexOf(b) + b.length }))
    .filter((x) => x.start >= 0)
    .sort((a, b) => a.start - b.start);
  const out: Abschnitt[] = [];
  let pos = 0;
  for (const x of treffer) {
    if (x.start < pos) continue;
    if (x.start > pos) out.push({ text: quelle.slice(pos, x.start), beleg: null });
    out.push({ text: quelle.slice(x.start, x.ende), beleg: x.i });
    pos = x.ende;
  }
  if (pos < quelle.length) out.push({ text: quelle.slice(pos), beleg: null });
  return out;
}

/** `?betrieb=Heizung Krause` → Name des Interessenten. Alles außer Buchstaben, Ziffern und üblichen Firmenzeichen fällt weg. */
export function betriebAus(suche: string): Betrieb {
  const roh = new URLSearchParams(suche).get("betrieb") ?? "";
  const name = roh
    .replace(/[^\p{L}\p{N} &.,'+-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_NAME)
    .trim();
  return name ? { name, persoenlich: true } : { name: STANDARD_BETRIEB, persoenlich: false };
}

import { angebotModul } from "./angebot";
import { anrufModul } from "./anruf";
import type { Betrieb, Modul } from "./typen";

export const SEITEN = ["start", "anruf", "angebot", "bericht", "weiter"] as const;
export type Seite = (typeof SEITEN)[number];

export const NAV: { seite: Seite; label: string }[] = [
  { seite: "anruf", label: "Anruf" },
  { seite: "angebot", label: "Angebot" },
  { seite: "bericht", label: "Bericht" },
];

export function alleModule(b: Betrieb): Modul[] {
  return [anrufModul(b), angebotModul(b)];
}

export function naechsteSeite(s: Seite): Seite | null {
  const i = SEITEN.indexOf(s);
  return i >= 0 && i < SEITEN.length - 1 ? SEITEN[i + 1] : null;
}

export const SPRECHER_START =
  "Einstieg: Ich zeige Ihnen drei Abläufe, die Sie aus Ihrem Alltag kennen. Links immer heute, rechts mit Custet. Die Uhr oben läuft für beide gleich. Dann auf Ablauf 1.";

export const SPRECHER_WEITER =
  "Die Frage stellen und schweigen. Seine Antwort ist der Einstieg ins Diagnose-Gespräch. Den Link zur Demo schicke ich Ihnen nachher.";

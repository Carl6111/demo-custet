import { useEffect, useState } from "react";
import { SPRECHER_START, SPRECHER_WEITER, alleModule } from "../daten";
import { SPRECHER_BERICHT } from "../daten/bericht";
import type { Betrieb } from "../daten/typen";
import { sprecherEmpfaenger, type Zustand } from "../lib/sprecher";

type Notiz = { ort: string; jetzt: string; danach?: string; vorher?: string };

function notizFuer(z: Zustand, betrieb: Betrieb): Notiz {
  if (z.seite === "start") return { ort: "Start", jetzt: SPRECHER_START };
  if (z.seite === "bericht") return { ort: "Bericht", jetzt: SPRECHER_BERICHT };
  if (z.seite === "weiter") return { ort: "Abschluss", jetzt: SPRECHER_WEITER };
  const modul = alleModule(betrieb).find((m) => m.id === z.seite)!;
  if (z.fertig) return { ort: `${modul.kurz}: Vergleich`, jetzt: modul.sprecherVergleich };
  const s = modul.mit[z.schritt];
  return {
    ort: `${modul.kurz}: Schritt ${z.schritt + 1} von ${modul.mit.length}`,
    vorher: z.schritt === 0 ? modul.sprecherEinstieg : undefined,
    jetzt: s.sprecher,
    danach: modul.mit[z.schritt + 1]?.titel,
  };
}

/** Zweites Fenster nur für Carl. Im Meeting wird nur der Demo-Tab geteilt, dieses Fenster nicht. */
export function Sprecher({ betrieb }: { betrieb: Betrieb }) {
  const [zustand, setZustand] = useState<Zustand | null>(null);
  useEffect(() => sprecherEmpfaenger(setZustand), []);

  if (!zustand) {
    return (
      <main className="sprecher">
        <h1>Sprechernotizen</h1>
        <p>Warte auf die Demo. Öffne sie im anderen Tab und drücke dort die Taste N.</p>
      </main>
    );
  }
  const n = notizFuer(zustand, betrieb);
  return (
    <main className="sprecher">
      <p className="sprecher-ort">{n.ort}</p>
      {n.vorher && <p className="sprecher-vorher">{n.vorher}</p>}
      <p className="sprecher-jetzt">{n.jetzt}</p>
      {n.danach && <p className="sprecher-danach">Danach: {n.danach}</p>}
      <p className="sprecher-tasten">→ weiter · nur den Demo-Tab teilen, nicht dieses Fenster</p>
    </main>
  );
}

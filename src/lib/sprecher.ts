import type { Seite } from "../daten";

const KANAL = "custet-demo-sprecher";

export type Zustand = { seite: Seite; schritt: number; fertig: boolean };
type Nachricht = { typ: "zustand"; zustand: Zustand } | { typ: "hallo" };

const verfuegbar = () => typeof BroadcastChannel !== "undefined";

/** Hauptfenster: meldet, wo die Demo steht. Ein neu geöffnetes Sprecherfenster fragt mit "hallo" nach. */
export function sprecherSender() {
  if (!verfuegbar()) return { melde: (_: Zustand) => {}, schliessen: () => {} };
  const kanal = new BroadcastChannel(KANAL);
  let letzter: Zustand | null = null;
  kanal.onmessage = (e: MessageEvent<Nachricht>) => {
    if (e.data?.typ === "hallo" && letzter) kanal.postMessage({ typ: "zustand", zustand: letzter } satisfies Nachricht);
  };
  return {
    melde(z: Zustand) {
      letzter = z;
      kanal.postMessage({ typ: "zustand", zustand: z } satisfies Nachricht);
    },
    schliessen: () => kanal.close(),
  };
}

export function sprecherEmpfaenger(aufZustand: (z: Zustand) => void) {
  if (!verfuegbar()) return () => {};
  const kanal = new BroadcastChannel(KANAL);
  kanal.onmessage = (e: MessageEvent<Nachricht>) => {
    if (e.data?.typ === "zustand") aufZustand(e.data.zustand);
  };
  kanal.postMessage({ typ: "hallo" } satisfies Nachricht);
  return () => kanal.close();
}

export function sprecherOeffnen() {
  const suche = new URLSearchParams(window.location.search);
  suche.set("sprecher", "1");
  window.open(`${window.location.pathname}?${suche}`, "custet-sprecher", "popup,width=480,height=720");
}

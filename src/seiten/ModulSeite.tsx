import { useEffect, useRef, useState } from "react";
import { wenigBewegung } from "../lib/navigation";
import type { Modul } from "../daten/typen";
import { Bildfolge } from "../teile/Bildfolge";
import { Karte } from "../teile/Karte";
import { Zeitstrahl } from "../teile/Zeitstrahl";
import { uhrzeit } from "../daten/rechnen";

type Props = {
  modul: Modul;
  weiterLabel: string;
  onWeiter: () => void;
  melde: (schritt: number, fertig: boolean) => void;
};

const istEingabe = (el: EventTarget | null) => el instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(el.tagName);
const weich = (): ScrollBehavior => (wenigBewegung() ? "auto" : "smooth");

export function ModulSeite({ modul, weiterLabel, onWeiter, melde }: Props) {
  const [schritt, setSchritt] = useState(0);
  const [erreicht, setErreicht] = useState(0);
  const [freigaben, setFreigaben] = useState<ReadonlySet<string>>(new Set());
  const ersterSchritt = useRef(true);
  const ergebnisRef = useRef<HTMLDivElement>(null);

  const aktuell = modul.mit[schritt];
  const istLetzter = schritt === modul.mit.length - 1;
  const freigegeben = freigaben.has(aktuell.id);
  const wartetAufFreigabe = aktuell.karte.art === "handy" && !freigegeben;
  const fertig = istLetzter && freigegeben;
  const tSchritt = freigegeben && aktuell.tErledigt !== undefined ? aktuell.tErledigt : aktuell.t;

  const vor = () => {
    const n = Math.min(schritt + 1, modul.mit.length - 1);
    setSchritt(n);
    setErreicht((e) => Math.max(e, n));
  };

  useEffect(() => {
    melde(schritt, fertig);
  }, [schritt, fertig, melde]);

  useEffect(() => {
    if (ersterSchritt.current) {
      ersterSchritt.current = false;
      return;
    }
    document.getElementById("buehne")?.scrollIntoView({ block: "start", behavior: weich() });
  }, [schritt]);

  useEffect(() => {
    if (fertig) ergebnisRef.current?.scrollIntoView({ block: "start", behavior: weich() });
  }, [fertig]);

  useEffect(() => {
    const taste = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" || istEingabe(e.target)) return;
      if (fertig) onWeiter();
      else if (!istLetzter && !wartetAufFreigabe) vor();
    };
    window.addEventListener("keydown", taste);
    return () => window.removeEventListener("keydown", taste);
  });

  return (
    <div className="modul">
      <header className="seiten-kopf">
        <h1>{modul.titel}</h1>
        <p className="frage">{modul.frage}</p>
      </header>

      <Bildfolge schritte={modul.mit} aktuell={schritt} erreicht={erreicht} onWahl={setSchritt} />

      <section id="buehne" className="buehne" aria-live="polite">
        <p className="buehne-zeit">{uhrzeit(tSchritt)}</p>
        <h2 className="buehne-titel">{aktuell.titel}</h2>
        <Karte
          key={aktuell.id}
          karte={aktuell.karte}
          zeit={uhrzeit(tSchritt)}
          freigegeben={freigegeben}
          onFreigabe={() => setFreigaben((f) => new Set([...f, aktuell.id]))}
        />
        {!istLetzter && (
          <button type="button" className="knopf knopf-gross" onClick={vor} disabled={wartetAufFreigabe}>
            Weiter
          </button>
        )}
        {wartetAufFreigabe && <p className="leise">Erst freigeben, dann geht es weiter.</p>}
      </section>

      {fertig && (
        <div ref={ergebnisRef} className="ergebnis">
          <Zeitstrahl modul={modul} />
          <button type="button" className="knopf knopf-gross" onClick={onWeiter}>{weiterLabel}</button>
        </div>
      )}
    </div>
  );
}

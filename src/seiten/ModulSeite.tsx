import { useEffect, useRef, useState } from "react";
import { uhrzeit } from "../daten/rechnen";
import type { Minute, Modul } from "../daten/typen";
import { wenigBewegung } from "../lib/navigation";
import { HeuteSpalte } from "../teile/HeuteSpalte";
import { Karte } from "../teile/Karte";
import { Uhr } from "../teile/Uhr";
import { Vergleich } from "../teile/Vergleich";

const VORSPULEN_MS = 2800;
const ohneAktion = () => {};

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
  const [vorspulen, setVorspulen] = useState<Minute | null>(null);
  const [fertig, setFertig] = useState(false);
  const titelRef = useRef<HTMLHeadingElement>(null);
  const vergleichRef = useRef<HTMLDivElement>(null);
  const ersterSchritt = useRef(true);
  const animation = useRef(0);

  const aktuell = modul.mit[schritt];
  const letzterSchritt = modul.mit[modul.mit.length - 1];
  const istLetzter = schritt === modul.mit.length - 1;
  const freigegeben = freigaben.has(aktuell.id);
  const wartetAufFreigabe = aktuell.karte.art === "handy" && !freigegeben;
  const tSchritt = freigegeben && aktuell.tErledigt !== undefined ? aktuell.tErledigt : aktuell.t;
  const heuteEnde = Math.max(...modul.heute.flatMap((e) => (e.t === null ? [] : [e.t])));
  const tLetzterErledigt = letzterSchritt.tErledigt ?? letzterSchritt.t;
  const nachEnde = fertig || vorspulen !== null;
  const t = vorspulen ?? (fertig ? Math.max(tLetzterErledigt, heuteEnde) : tSchritt);
  const custet = nachEnde
    ? `${letzterSchritt.statusErledigt ?? letzterSchritt.status}, seit ${uhrzeit(tLetzterErledigt).slice(3)}`
    : freigegeben
      ? (aktuell.statusErledigt ?? aktuell.status)
      : aktuell.status;
  const zeigtVorspulKnopf = istLetzter && freigegeben && !nachEnde && heuteEnde > tSchritt;

  const vor = () => {
    const naechster = Math.min(schritt + 1, modul.mit.length - 1);
    setSchritt(naechster);
    setErreicht((e) => Math.max(e, naechster));
  };

  const freigeben = () => {
    setFreigaben((f) => new Set([...f, aktuell.id]));
    if (istLetzter && heuteEnde <= (aktuell.tErledigt ?? aktuell.t)) setFertig(true);
  };

  const heuteWeiterlaufen = () => {
    if (wenigBewegung()) {
      setFertig(true);
      return;
    }
    const von = tSchritt;
    const start = performance.now();
    const takt = (jetzt: number) => {
      const p = Math.min(1, (jetzt - start) / VORSPULEN_MS);
      const weichP = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
      if (p < 1) {
        setVorspulen(Math.round(von + (heuteEnde - von) * weichP));
        animation.current = requestAnimationFrame(takt);
      } else {
        setVorspulen(null);
        setFertig(true);
      }
    };
    animation.current = requestAnimationFrame(takt);
  };

  useEffect(() => () => cancelAnimationFrame(animation.current), []);
  useEffect(() => {
    melde(schritt, fertig);
  }, [schritt, fertig, melde]);

  useEffect(() => {
    if (ersterSchritt.current) {
      ersterSchritt.current = false;
      return;
    }
    const el = titelRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    const oben = el.getBoundingClientRect().top;
    if (oben < 120 || oben > window.innerHeight * 0.5) el.scrollIntoView({ block: "start", behavior: weich() });
  }, [schritt]);

  useEffect(() => {
    if (fertig) vergleichRef.current?.scrollIntoView({ block: "start", behavior: weich() });
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

      <Uhr t={t} heute={modul.heute} custet={custet} />

      <div className="spalten">
        <HeuteSpalte eintraege={modul.heute} t={t} ende={fertig} />

        <section className="mit" aria-labelledby="mit-titel">
          <h2 id="mit-titel">So läuft es mit Custet</h2>
          <nav className="schritte" aria-label="Schritte">
            {modul.mit.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={i === schritt ? "punkt aktiv" : i <= erreicht ? "punkt getan" : "punkt"}
                aria-current={i === schritt ? "step" : undefined}
                aria-label={`Schritt ${i + 1}: ${s.titel}`}
                disabled={i > erreicht}
                onClick={() => setSchritt(i)}
              >
                {i + 1}
              </button>
            ))}
          </nav>
          <h3 className="schritt-titel" ref={titelRef} tabIndex={-1}>{aktuell.titel}</h3>
          <p className="erklaerung">{aktuell.erklaerung}</p>
          <Karte
            key={aktuell.id}
            karte={aktuell.karte}
            zeit={uhrzeit(tSchritt)}
            freigegeben={freigegeben}
            onFreigabe={freigeben}
            onGespraechFertig={ohneAktion}
          />
          {!istLetzter && (
            <button type="button" className="knopf" onClick={vor} disabled={wartetAufFreigabe}>Weiter</button>
          )}
          {wartetAufFreigabe && <p className="leise">Ohne Ihre Freigabe geht nichts raus.</p>}
          {zeigtVorspulKnopf && (
            <button type="button" className="knopf knopf-hell" onClick={heuteWeiterlaufen}>Und wie läuft es heute weiter?</button>
          )}
        </section>
      </div>

      {fertig && (
        <div ref={vergleichRef} className="nach-vergleich">
          <Vergleich modul={modul} />
          <button type="button" className="knopf" onClick={onWeiter}>{weiterLabel}</button>
        </div>
      )}
    </div>
  );
}

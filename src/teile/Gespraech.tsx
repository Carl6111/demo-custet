import { useEffect, useRef, useState } from "react";
import type { Redebeitrag } from "../daten/typen";

const MIN_MS = 1200;
const MAX_MS = 4200;
const MS_PRO_ZEICHEN = 34;

const leseDauer = (text: string) => Math.min(MAX_MS, Math.max(MIN_MS, 500 + text.length * MS_PRO_ZEICHEN));

type Modus = "wartet" | "mit-ton" | "ohne-ton";

/**
 * Das Telefonat läuft Zeile für Zeile ab. Mit Ton wartet jede Zeile, bis ihre Aufnahme zu Ende ist;
 * fehlt die Datei oder blockt der Browser, läuft dieselbe Zeile stumm nach Lesezeit weiter.
 */
export function Gespraech({ anrufer, zeilen }: { anrufer: string; zeilen: Redebeitrag[] }) {
  const [modus, setModus] = useState<Modus>("wartet");
  const [aktiv, setAktiv] = useState(0);
  const verlauf = useRef<HTMLOListElement>(null);
  const fertig = aktiv >= zeilen.length;
  const laeuft = modus !== "wartet" && !fertig;

  useEffect(() => {
    if (modus === "wartet" || fertig) return;
    const zeile = zeilen[aktiv];
    let timer = 0;
    let erledigt = false;
    const weiter = () => {
      if (erledigt) return;
      erledigt = true;
      setAktiv((a) => a + 1);
    };
    const stumm = () => {
      timer = window.setTimeout(weiter, leseDauer(zeile.text));
    };
    const audio = modus === "mit-ton" && zeile.audio ? new Audio(zeile.audio) : null;
    if (audio) {
      audio.addEventListener("ended", weiter);
      audio.addEventListener("error", stumm);
      audio.play().catch(stumm);
    } else {
      stumm();
    }
    return () => {
      erledigt = true;
      window.clearTimeout(timer);
      audio?.pause();
    };
  }, [modus, aktiv, fertig, zeilen]);

  useEffect(() => {
    verlauf.current?.lastElementChild?.scrollIntoView({ block: "nearest" });
  }, [aktiv]);

  if (modus === "wartet") {
    return (
      <article className="karte anruf-eingang">
        <p className="klingelt" aria-live="polite">{anrufer} ruft an</p>
        <p className="leise">Im Büro ist niemand. Diesmal geht trotzdem jemand ran.</p>
        <div className="anruf-knoepfe">
          <button type="button" className="knopf knopf-gross" onClick={() => setModus("mit-ton")}>Anruf annehmen, mit Ton</button>
          <button type="button" className="leise-knopf" onClick={() => setModus("ohne-ton")}>ohne Ton</button>
        </div>
      </article>
    );
  }

  return (
    <article className="karte">
      <header className="karte-kopf">
        <strong>Anruf von {anrufer}</strong>
        <span className={laeuft ? "welle" : undefined} aria-label={laeuft ? "läuft" : "beendet"}>
          {laeuft ? <><i /><i /><i /><i /></> : "beendet"}
        </span>
      </header>
      <ol className="gespraech" ref={verlauf} aria-live="polite">
        {zeilen.slice(0, Math.min(aktiv + 1, zeilen.length)).map((z, i) => (
          <li key={i} className={`rede ${z.wer}${i === aktiv && !fertig ? " spricht" : ""}`}>
            <span className="wer">{z.wer === "agent" ? "Assistent" : anrufer}</span>
            <span className="was">{z.text}</span>
          </li>
        ))}
      </ol>
      {laeuft && (
        <div className="anruf-knoepfe">
          <button type="button" className="leise-knopf" onClick={() => setAktiv(zeilen.length)}>Gespräch überspringen</button>
        </div>
      )}
    </article>
  );
}

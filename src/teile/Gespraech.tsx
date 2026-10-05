import { useEffect, useRef, useState } from "react";
import type { Redebeitrag } from "../daten/typen";

const MIN_MS = 1200;
const MAX_MS = 4200;
const MS_PRO_ZEICHEN = 34;

const leseDauer = (text: string) => Math.min(MAX_MS, Math.max(MIN_MS, 500 + text.length * MS_PRO_ZEICHEN));

/**
 * Das Telefonat läuft Zeile für Zeile ab. Mit Ton wartet jede Zeile, bis ihre Aufnahme zu Ende ist;
 * fehlt die Datei oder blockt der Browser, läuft dieselbe Zeile stumm nach Lesezeit weiter.
 */
export function Gespraech({ anrufer, zeilen, onFertig }: { anrufer: string; zeilen: Redebeitrag[]; onFertig: () => void }) {
  const [angenommen, setAngenommen] = useState(false);
  const [aktiv, setAktiv] = useState(0);
  const [ton, setTon] = useState(false);
  const verlauf = useRef<HTMLOListElement>(null);
  const fertig = aktiv >= zeilen.length;

  useEffect(() => {
    if (!angenommen || fertig) return;
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
    const audio = ton && zeile.audio ? new Audio(zeile.audio) : null;
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
  }, [angenommen, aktiv, ton, fertig, zeilen]);

  useEffect(() => {
    if (fertig) onFertig();
  }, [fertig, onFertig]);

  useEffect(() => {
    verlauf.current?.lastElementChild?.scrollIntoView({ block: "nearest" });
  }, [aktiv]);

  if (!angenommen) {
    return (
      <article className="karte anruf-eingang">
        <p className="klingelt" aria-live="polite">Eingehender Anruf · {anrufer}</p>
        <p className="leise">Im Büro ist niemand. Diesmal geht trotzdem jemand ran.</p>
        <div className="anruf-knoepfe">
          <button type="button" className="knopf" onClick={() => setAngenommen(true)}>Assistent nimmt ab</button>
          <TonSchalter ton={ton} setTon={setTon} />
        </div>
      </article>
    );
  }

  return (
    <article className="karte">
      <header className="karte-kopf">
        <strong>Anruf von {anrufer}</strong>
        <span>{fertig ? "beendet" : "läuft"}</span>
      </header>
      <ol className="gespraech" ref={verlauf} aria-live="polite">
        {zeilen.slice(0, Math.min(aktiv + 1, zeilen.length)).map((z, i) => (
          <li key={i} className={`rede ${z.wer}${i === aktiv ? " spricht" : ""}`}>
            <span className="wer">{z.wer === "agent" ? "Assistent" : anrufer}</span>
            <span className="was">{z.text}</span>
          </li>
        ))}
      </ol>
      {!fertig && (
        <div className="anruf-knoepfe">
          <TonSchalter ton={ton} setTon={setTon} />
          <button type="button" className="leise-knopf" onClick={() => setAktiv(zeilen.length)}>Gespräch überspringen</button>
        </div>
      )}
    </article>
  );
}

function TonSchalter({ ton, setTon }: { ton: boolean; setTon: (t: boolean) => void }) {
  return (
    <button type="button" className="leise-knopf" aria-pressed={ton} onClick={() => setTon(!ton)}>
      {ton ? "Ton ist an" : "Ton einschalten"}
    </button>
  );
}

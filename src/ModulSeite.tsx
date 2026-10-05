import { useState } from "react";
import type { Modul } from "./daten";
import { KarteAnsicht } from "./KarteAnsicht";
import { Vergleich } from "./Vergleich";

export function ModulSeite({ modul, onWeiter }: { modul: Modul; onWeiter: (() => void) | null }) {
  const [schritt, setSchritt] = useState(0);
  const [bestaetigt, setBestaetigt] = useState(false);
  const aktuell = modul.mit[schritt];
  const letzter = schritt === modul.mit.length - 1;
  const freigabeOffen = aktuell.karte.art === "entwurf" && !bestaetigt;
  const fertig = letzter && bestaetigt;

  const vor = () => {
    setBestaetigt(false);
    setSchritt((s) => s + 1);
  };

  return (
    <div className="modul">
      <header className="modul-kopf">
        <h1>{modul.titel}</h1>
        <p className="frage">{modul.frage}</p>
      </header>

      <div className="spalten">
        <section className="heute" aria-labelledby="heute-titel">
          <h2 id="heute-titel">So läuft das heute</h2>
          <ol className="zeitleiste">
            {modul.heute.map((z) => (
              <li key={z.zeit + z.text}>
                <time>{z.zeit}</time>
                <span>{z.text}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mit" aria-labelledby="mit-titel">
          <h2 id="mit-titel">So läuft es mit Custet</h2>
          <nav className="schritte" aria-label="Schritte">
            {modul.mit.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={i === schritt ? "punkt aktiv" : i < schritt ? "punkt getan" : "punkt"}
                aria-current={i === schritt ? "step" : undefined}
                aria-label={`Schritt ${i + 1}: ${s.titel}`}
                disabled={i > schritt}
                onClick={() => { setSchritt(i); setBestaetigt(i < schritt); }}
              >{i + 1}</button>
            ))}
          </nav>
          <h3 className="schritt-titel">{aktuell.titel}</h3>
          <p className="erklaerung">{aktuell.erklaerung}</p>
          <KarteAnsicht key={aktuell.id} karte={aktuell.karte} bestaetigt={bestaetigt} onFreigabe={() => setBestaetigt(true)} />
          {!letzter && (
            <button type="button" className="knopf" onClick={vor} disabled={freigabeOffen}>
              Weiter
            </button>
          )}
          {freigabeOffen && <p className="hinweis-klein">Hier geht nichts ohne Ihr Freigeben raus.</p>}
        </section>
      </div>

      {fertig && (
        <>
          <Vergleich modul={modul} />
          {onWeiter && <button type="button" className="knopf" onClick={onWeiter}>Nächster Ablauf</button>}
        </>
      )}
    </div>
  );
}

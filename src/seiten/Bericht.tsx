import { useState } from "react";
import { MONAT, NACH_NACHFASSEN_BEAUFTRAGT, OFFEN, VORGAENGE, ZAHLEN, auftragsSumme, ersparnisMinuten } from "../daten/bericht";
import { arbeitstage, euro, stunden } from "../daten/rechnen";
import type { Betrieb, Modul } from "../daten/typen";

const MAX_SATZ = 1000;

export function Bericht({ betrieb, module, onWeiter }: { betrieb: Betrieb; module: Modul[]; onWeiter: () => void }) {
  const [satz, setSatz] = useState("");
  const minuten = ersparnisMinuten(module);
  const satzZahl = Number(satz.replace(",", "."));
  const satzOk = satz.trim() !== "" && Number.isFinite(satzZahl) && satzZahl > 0 && satzZahl < MAX_SATZ;

  return (
    <div className="bericht-seite">
      <header className="seiten-kopf">
        <h1>Am Monatsende wissen Sie, was erledigt wurde</h1>
        <p className="frage">Jeden Monatsersten kommt dieser Bericht. Niemand muss dafür etwas zusammentragen.</p>
      </header>

      <article className="brief" aria-label={`Bericht ${MONAT.name}`}>
        <header className="brief-kopf">
          <p className="brief-betreff">Ihr System im {MONAT.name}</p>
          <p className="leise">Bericht vom {MONAT.berichtVom} für {betrieb.name}</p>
        </header>

        <dl className="kennzahlen">
          <div><dd>{ZAHLEN.anrufe}</dd><dt>Anrufe angenommen, {ZAHLEN.ausserhalbBuerozeit} davon außerhalb der Bürozeit</dt></div>
          <div><dd>{ZAHLEN.angebote}</dd><dt>Angebote vorbereitet, {ZAHLEN.nachgefasst} nachgefasst</dt></div>
          <div><dd>{ZAHLEN.beauftragtNachNachfassen}</dd><dt>Aufträge nach dem Nachfassen</dt></div>
        </dl>

        <div className="ersparnis">
          <p className="ersparnis-zahl">{euro(auftragsSumme())} netto aus nachgefassten Angeboten</p>
          <ul className="auftraege">
            {NACH_NACHFASSEN_BEAUFTRAGT.map((a) => (
              <li key={a.wer}><span>{a.wer}: {a.was}</span><span>{euro(a.netto)}</span></li>
            ))}
          </ul>
          <p className="ersparnis-zahl ersparnis-zweit">{stunden(minuten)} Büroarbeit gespart</p>
          <p className="leise">Das sind gut {arbeitstage(minuten).toLocaleString("de-DE")} Arbeitstage in diesem Monat.</p>
          <label htmlFor="satz">Was kostet Sie eine Bürostunde? (in €)</label>
          <input
            id="satz"
            inputMode="decimal"
            autoComplete="off"
            placeholder="z. B. 45"
            value={satz}
            onChange={(e) => setSatz(e.target.value.replace(/[^\d,.]/g, "").slice(0, 6))}
          />
          <p className="ersparnis-euro" aria-live="polite">
            {satzOk ? `Das entspricht ${euro((minuten / 60) * satzZahl)} Bürokosten in diesem Monat.` : "\u00a0"}
          </p>
        </div>

        <details className="vorgaenge">
          <summary>Offene Punkte und alle Vorgänge</summary>
          <ul className="brief-offen">
            {OFFEN.map((o) => <li key={o}>{o}</li>)}
          </ul>
          <table>
            <tbody>
              {VORGAENGE.map((v) => (
                <tr key={v.nr}><td className="nr">{v.nr}</td><td>{v.wer}: {v.was}</td><td>{v.stand}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="leise">Ausschnitt: 5 von {ZAHLEN.vorgaenge} Vorgängen.</p>
        </details>
      </article>
      <p className="annahme">
        Beispielrechnung: {ZAHLEN.vorgaenge} Vorgänge und {ZAHLEN.angebote} Angebote mit den Zeiten aus den beiden Abläufen. Aufträge, Beträge und Namen sind erfunden.
      </p>
      <button type="button" className="knopf knopf-gross" onClick={onWeiter}>So geht es weiter</button>
    </div>
  );
}

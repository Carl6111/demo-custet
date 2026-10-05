import { useState } from "react";
import { MONAT, NACH_NACHFASSEN_BEAUFTRAGT, OFFEN, VORGAENGE, ZAHLEN, auftragsSumme, ersparnisMinuten } from "../daten/bericht";
import { arbeitstage, euro, stunden } from "../daten/rechnen";
import type { Betrieb, Modul } from "../daten/typen";

const HEUTE = [
  "Wie viele Anfragen kamen diesen Monat rein? Steht nirgends.",
  "Welche Angebote sind noch offen? Weiß nur, wer sie geschrieben hat.",
  "Wie viele Anrufe sind ins Leere gelaufen? Merkt niemand.",
  "Was hat das Büro diesen Monat geschafft? Gefühlt: alles. Belegt: nichts.",
];

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

      <div className="spalten">
        <section className="heute" aria-labelledby="bericht-heute">
          <h2 id="bericht-heute">So ist das heute am Monatsende</h2>
          <ul className="fragenliste">
            {HEUTE.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </section>

        <section className="mit" aria-labelledby="bericht-mit">
          <h2 id="bericht-mit">So kommt es mit Custet</h2>
          <article className="brief">
            <header className="brief-kopf">
              <p className="brief-betreff">Ihr System im {MONAT.name}</p>
              <p className="leise">Bericht vom {MONAT.berichtVom} für {betrieb.name}</p>
            </header>
            <p>
              Im {MONAT.name} hat Ihr System <b>{ZAHLEN.anrufe} Anrufe</b> angenommen, <b>{ZAHLEN.ausserhalbBuerozeit}</b> davon
              außerhalb der Bürozeiten. Daraus sind <b>{ZAHLEN.vorgaenge} Vorgänge</b> geworden. Der Rest waren Rückfragen und Lieferanten.
            </p>
            <p>
              Es hat <b>{ZAHLEN.angebote} Angebote</b> vorbereitet und <b>{ZAHLEN.nachgefasst}</b> davon nachgefasst.
              Nach dem Nachfassen wurden <b>{ZAHLEN.beauftragtNachNachfassen}</b> beauftragt.
            </p>
            <p className="brief-zwischen">Offen ist noch:</p>
            <ul className="brief-offen">
              {OFFEN.map((o) => <li key={o}>{o}</li>)}
            </ul>
            <details className="vorgaenge">
              <summary>Alle Vorgänge ansehen</summary>
              <table>
                <tbody>
                  {VORGAENGE.map((v) => (
                    <tr key={v.nr}><td className="nr">{v.nr}</td><td>{v.wer}: {v.was}</td><td>{v.stand}</td></tr>
                  ))}
                </tbody>
              </table>
              <p className="leise">Ausschnitt: 5 von {ZAHLEN.vorgaenge}.</p>
            </details>

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
                {satzOk ? `Das entspricht ${euro((minuten / 60) * satzZahl)} Bürokosten in diesem Monat.` : " "}
              </p>
            </div>
          </article>
          <p className="annahme">
            Beispielrechnung: {ZAHLEN.vorgaenge} Vorgänge und {ZAHLEN.angebote} Angebote mit den Zeiten aus den beiden Abläufen. Aufträge, Beträge und Namen sind erfunden.
          </p>
          <button type="button" className="knopf" onClick={onWeiter}>So geht es weiter</button>
        </section>
      </div>
    </div>
  );
}

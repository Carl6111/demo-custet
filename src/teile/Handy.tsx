import { useState } from "react";
import { euro, summe } from "../daten/rechnen";
import type { Karte } from "../daten/typen";

type HandyKarte = Extract<Karte, { art: "handy" }>;
type Props = { karte: HandyKarte; zeit: string; freigegeben: boolean; onFreigabe: () => void };

const MAX_PREIS = 100000;

/** Freigabe so, wie der Chef sie erlebt: Sperrbildschirm, Nachricht antippen, prüfen, freigeben. */
export function Handy({ karte, zeit, freigegeben, onFreigabe }: Props) {
  const [offen, setOffen] = useState(freigegeben);
  const [preis, setPreis] = useState("");
  const uhr = zeit.slice(3);
  const preisZahl = Number(preis.replace(",", "."));
  const preisOk = preis.trim() !== "" && Number.isFinite(preisZahl) && preisZahl > 0 && preisZahl < MAX_PREIS;
  const fehlt = karte.fehlenderPreis && !freigegeben && !preisOk;
  const gesamt = karte.fehlenderPreis ? summe(karte.fehlenderPreis.positionen, preisOk ? preisZahl : null) : null;
  const ohnePreis = karte.fehlenderPreis?.positionen.find((p) => p.einzel === null)?.bez;

  return (
    <div className="handy-buehne">
      <div className={offen ? "handy" : "handy vibriert"} role="group" aria-label="Handy des Chefs">
        <div className="handy-leiste" aria-hidden="true">
          <span>{uhr}</span>
          <span className="handy-insel" />
          <span>5G</span>
        </div>

        {!offen ? (
          <div className="sperre">
            <p className="sperre-uhr" aria-hidden="true">{uhr}</p>
            <button type="button" className="push" onClick={() => setOffen(true)}>
              <span className="push-kopf"><img src="/logo.webp" alt="" width={18} height={18} /> Custet <span>jetzt</span></span>
              <span className="push-text">{karte.push}</span>
            </button>
            <p className="sperre-hinweis">Nachricht antippen</p>
          </div>
        ) : (
          <div className="app">
            <p className="app-kopf">{karte.kanal} an {karte.an}</p>
            {karte.betreff && <p className="app-betreff">{karte.betreff}</p>}
            <p className={karte.kanal === "SMS" ? "sms" : "mail"}>{karte.text}</p>

            {karte.fehlenderPreis && gesamt && (
              <div className="preisfeld">
                <label htmlFor="preis">Preis fehlt: {ohnePreis}, netto in €</label>
                <input
                  id="preis"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="z. B. 240"
                  value={preis}
                  disabled={freigegeben}
                  onChange={(e) => setPreis(e.target.value.replace(/[^\d,.]/g, "").slice(0, 8))}
                />
                <p className="preis-summe">
                  {gesamt.offen > 0 ? "Summe steht, sobald der Preis da ist" : `Angebot gesamt netto ${euro(gesamt.betrag)}`}
                </p>
              </div>
            )}

            {freigegeben ? (
              <p className="app-erledigt" role="status">✓ {karte.erledigt}</p>
            ) : (
              <button type="button" className="knopf knopf-handy" onClick={onFreigabe} disabled={fehlt}>
                {karte.freigabe}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

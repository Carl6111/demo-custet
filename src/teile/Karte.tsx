import { useEffect, useState } from "react";
import { euro, summe } from "../daten/rechnen";
import type { Karte as KarteDaten, Zeile } from "../daten/typen";
import { Gespraech } from "./Gespraech";
import { Handy } from "./Handy";
import { Markiert, TAKT_MS, verzoegert } from "./Markiert";

type Props = {
  karte: KarteDaten;
  zeit: string;
  freigegeben: boolean;
  onFreigabe: () => void;
  onGespraechFertig: () => void;
};

export function Karte({ karte, zeit, freigegeben, onFreigabe, onGespraechFertig }: Props) {
  switch (karte.art) {
    case "anruf":
      return <Gespraech anrufer={karte.anrufer} zeilen={karte.zeilen} onFertig={onGespraechFertig} />;
    case "nachricht":
      return (
        <article className="karte">
          <header className="karte-kopf">
            <strong>{karte.von}</strong>
            <span>{karte.kanal}</span>
          </header>
          <p className="fliess">{karte.text}</p>
        </article>
      );
    case "auslesen":
      return (
        <article className="karte">
          <Arbeitet anzahl={karte.zeilen.length} titel={karte.titel} />
          <Markiert quelle={karte.quelle} belege={karte.zeilen.map((z) => z.beleg ?? "")} />
          <Felder zeilen={karte.zeilen} gestaffelt />
        </article>
      );
    case "felder":
      return (
        <article className="karte">
          <header className="karte-kopf"><strong>{karte.titel}</strong></header>
          <Felder zeilen={karte.zeilen} />
        </article>
      );
    case "positionen": {
      const { betrag, offen } = summe(karte.positionen);
      return (
        <article className="karte">
          <Arbeitet anzahl={karte.positionen.length} titel={karte.titel} />
          <Markiert quelle={karte.quelle} belege={karte.positionen.map((p) => p.beleg)} />
          <table className="positionen">
            <thead>
              <tr><th>Leistung</th><th className="zahl">Menge</th><th className="zahl">Einzelpreis</th></tr>
            </thead>
            <tbody>
              {karte.positionen.map((p, i) => (
                <tr key={p.bez} className={p.einzel === null ? "erscheint offen" : "erscheint"} style={verzoegert(i)}>
                  <td>{p.bez}</td>
                  <td className="zahl">{p.menge} {p.einheit}</td>
                  <td className="zahl">{p.einzel === null ? "fehlt in Ihrer Liste" : euro(p.einzel)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="erscheint" style={verzoegert(karte.positionen.length)}>
              <tr><td colSpan={2}>Zwischensumme netto{offen > 0 ? ", ohne die fehlende Position" : ""}</td><td className="zahl">{euro(betrag)}</td></tr>
            </tfoot>
          </table>
          <p className="hinweis">{karte.hinweis}</p>
        </article>
      );
    }
    case "handy":
      return <Handy karte={karte} zeit={zeit} freigegeben={freigegeben} onFreigabe={onFreigabe} />;
  }
}

function Felder({ zeilen, gestaffelt = false }: { zeilen: Zeile[]; gestaffelt?: boolean }) {
  return (
    <dl className="felder">
      {zeilen.map((z, i) => (
        <div key={z.label} className={`feld${z.markiert ? " markiert" : ""}${gestaffelt ? " erscheint" : ""}`} style={gestaffelt ? verzoegert(i) : undefined}>
          <dt>{z.label}</dt>
          <dd>{z.wert}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Kleine Statuszeile: erst "liest mit", dann der Titel, sobald das letzte Feld steht. */
function Arbeitet({ anzahl, titel }: { anzahl: number; titel: string }) {
  const [fertig, setFertig] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setFertig(true), anzahl * TAKT_MS + 400);
    return () => window.clearTimeout(t);
  }, [anzahl]);
  return (
    <header className="karte-kopf">
      <strong>{titel}</strong>
      <span className={fertig ? "status fertig" : "status"} aria-live="polite">{fertig ? "fertig" : "liest mit"}</span>
    </header>
  );
}

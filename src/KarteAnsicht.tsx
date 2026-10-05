import { euro, summe, type Karte } from "./daten";

export function KarteAnsicht({ karte, bestaetigt, onFreigabe }: { karte: Karte; bestaetigt: boolean; onFreigabe: () => void }) {
  switch (karte.art) {
    case "nachricht":
      return (
        <article className="karte">
          <header className="karte-kopf">
            <strong>{karte.von}</strong>
            <span>{karte.kanal} · {karte.zeit}</span>
          </header>
          <p className="fliess">{karte.text}</p>
        </article>
      );
    case "felder":
      return (
        <article className="karte">
          <header className="karte-kopf"><strong>{karte.titel}</strong></header>
          <dl className="felder">
            {karte.zeilen.map((z) => (
              <div key={z.label} className={z.markiert ? "feld markiert" : "feld"}>
                <dt>{z.label}</dt>
                <dd>{z.wert}</dd>
              </div>
            ))}
          </dl>
        </article>
      );
    case "positionen": {
      const { betrag, offen } = summe(karte.positionen);
      return (
        <article className="karte">
          <header className="karte-kopf"><strong>{karte.titel}</strong></header>
          <table className="positionen">
            <thead>
              <tr><th>Leistung</th><th className="zahl">Menge</th><th className="zahl">Einzelpreis</th></tr>
            </thead>
            <tbody>
              {karte.positionen.map((p) => (
                <tr key={p.bez} className={p.einzel === null ? "offen" : undefined}>
                  <td>{p.bez}</td>
                  <td className="zahl">{p.menge} {p.einheit}</td>
                  <td className="zahl">{p.einzel === null ? "bitte ergänzen" : euro(p.einzel)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr><td colSpan={2}>Zwischensumme netto{offen > 0 ? ` (ohne ${offen} offene Position)` : ""}</td><td className="zahl">{euro(betrag)}</td></tr>
            </tfoot>
          </table>
          <p className="hinweis">{karte.hinweis}</p>
        </article>
      );
    }
    case "entwurf":
      return (
        <article className="karte">
          <header className="karte-kopf">
            <strong>Entwurf an {karte.an}</strong>
            <span>{bestaetigt ? "freigegeben" : "wartet auf Sie"}</span>
          </header>
          <p className="betreff">{karte.betreff}</p>
          <p className="fliess brief">{karte.text}</p>
          {bestaetigt ? (
            <p className="erledigt" role="status">{karte.erledigt}</p>
          ) : (
            <button type="button" className="knopf" onClick={onFreigabe}>{karte.freigabe}</button>
          )}
        </article>
      );
  }
}

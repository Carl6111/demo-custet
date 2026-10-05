import { dauer, type Modul } from "./daten";

export function Vergleich({ modul }: { modul: Modul }) {
  return (
    <section className="vergleich" aria-labelledby="vergleich-titel">
      <h2 id="vergleich-titel">Was sich für Ihren Betrieb ändert</h2>
      {modul.messwerte.map((w) => (
        <div className="messung" key={w.label}>
          <p className="messung-label">{w.label}</p>
          <div className="balken-zeile">
            <span className="balken-name">Heute</span>
            <span className="balken" style={{ ["--breite" as string]: 1 }} />
            <span className="balken-wert">{dauer(w.heute)}</span>
          </div>
          <div className="balken-zeile">
            <span className="balken-name">Mit Custet</span>
            <span className="balken neu" style={{ ["--breite" as string]: Math.max(w.mit / w.heute, 0.012) }} />
            <span className="balken-wert">{dauer(w.mit)}</span>
          </div>
        </div>
      ))}
      <p className="annahme">{modul.annahme}</p>
    </section>
  );
}

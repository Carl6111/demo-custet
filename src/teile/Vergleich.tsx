import { dauer } from "../daten/rechnen";
import type { Modul } from "../daten/typen";

const MIN_ANTEIL = 0.012;

export function Vergleich({ modul }: { modul: Modul }) {
  return (
    <section className="vergleich" aria-labelledby="vergleich-titel">
      <h2 id="vergleich-titel">Was sich für Ihren Betrieb ändert</h2>
      {modul.messwerte.map((w) => (
        <div className="messung" key={w.label}>
          <p className="messung-label">{w.label}</p>
          <Balken name="Heute" wert={w.heute} anteil={1} />
          <Balken name="Mit Custet" wert={w.mit} anteil={Math.max(w.mit / w.heute, MIN_ANTEIL)} neu />
        </div>
      ))}
      <p className="annahme">{modul.annahme}</p>
    </section>
  );
}

function Balken({ name, wert, anteil, neu = false }: { name: string; wert: number; anteil: number; neu?: boolean }) {
  return (
    <div className="balken-zeile">
      <span className="balken-name">{name}</span>
      <span className={neu ? "balken neu" : "balken"} style={{ ["--anteil" as string]: anteil }} />
      <span className="balken-wert">{dauer(wert)}</span>
    </div>
  );
}

import { dauer, uhrzeit } from "../daten/rechnen";
import type { Modul } from "../daten/typen";

const MIN_ANTEIL = 0.015;

/** Dieselbe Strecke zweimal: oben ohne Custet mit allen Stationen, unten mit Custet, fertig, bevor es oben richtig losgeht. */
export function Zeitstrahl({ modul }: { modul: Modul }) {
  const start = modul.heute[0].t!;
  const stationen = modul.heute.flatMap((e) => (e.t === null ? [] : [e.t]));
  const ende = stationen[stationen.length - 1];
  const warten = modul.messwerte.find((w) => w.art === "warten")!;
  const buero = modul.messwerte.find((w) => w.art === "buero")!;
  const anteil = (t: number) => (t - start) / (ende - start);
  const nachsatz = modul.heute.find((e) => e.t === null)?.text;
  const fertigUm = modul.mit.find((s) => s.tErledigt !== undefined)!.tErledigt!;

  return (
    <section className="zeitstrahl" aria-labelledby="zs-titel">
      <h2 id="zs-titel">Dieselbe Strecke, zwei Wege</h2>

      <div className="spur spur-heute">
        <p className="spur-kopf"><span>Ohne Custet</span><strong>{dauer(warten.heute)}</strong></p>
        <div className="spur-bahn" aria-hidden="true">
          {stationen.map((t) => <i key={t} style={{ left: `${anteil(t) * 100}%` }} />)}
        </div>
        <p className="spur-fuss"><span>{uhrzeit(start)}</span><span>{uhrzeit(ende)}</span></p>
        {nachsatz && <p className="spur-folge">{nachsatz}</p>}
      </div>

      <div className="spur spur-custet">
        <p className="spur-kopf"><span>Mit Custet</span><strong>{dauer(warten.mit)}</strong></p>
        <div className="spur-bahn" aria-hidden="true">
          <b style={{ ["--anteil" as string]: Math.max(anteil(fertigUm), MIN_ANTEIL) }} />
        </div>
        <p className="spur-fuss"><span>{uhrzeit(start)}</span><span>{uhrzeit(fertigUm)} erledigt</span></p>
      </div>

      <p className="spur-buero">Büroarbeit dafür: <b>{dauer(buero.heute)}</b> statt <b>{dauer(buero.mit)}</b></p>
      <p className="annahme">{modul.annahme}</p>
    </section>
  );
}

import { uhrzeit } from "../daten/rechnen";
import type { HeuteEintrag, Minute } from "../daten/typen";

/** Eine Uhr für zwei Welten: Was ist zur selben Minute heute passiert, was mit Custet? */
export function Uhr({ t, heute, custet }: { t: Minute; heute: HeuteEintrag[]; custet: string }) {
  const stand = [...heute].reverse().find((e) => e.t !== null && e.t <= t) ?? heute[0];
  return (
    <div className="uhr">
      <p className="uhr-zeit"><time>{uhrzeit(t)}</time></p>
      <dl className="uhr-welten">
        <div className="welt welt-heute">
          <dt>Heute</dt>
          <dd key={stand.text}>{stand.text}</dd>
        </div>
        <div className="welt welt-custet">
          <dt>Mit Custet</dt>
          <dd key={custet}>{custet}</dd>
        </div>
      </dl>
    </div>
  );
}

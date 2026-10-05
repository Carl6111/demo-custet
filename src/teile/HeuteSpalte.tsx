import { uhrzeit } from "../daten/rechnen";
import type { HeuteEintrag, Minute } from "../daten/typen";

/** Hell ist, was zur Uhrzeit oben schon passiert ist. Der Nachsatz ohne Uhrzeit erscheint erst am Ende. */
export function HeuteSpalte({ eintraege, t, ende }: { eintraege: HeuteEintrag[]; t: Minute; ende: boolean }) {
  return (
    <section className="heute" aria-labelledby="heute-titel">
      <h2 id="heute-titel">So läuft das heute</h2>
      <ol className="zeitleiste">
        {eintraege.map((e) => {
          if (e.t === null) {
            return ende ? <li key={e.text} className="nachsatz">{e.text}</li> : null;
          }
          const passiert = e.t <= t;
          return (
            <li key={e.text} className={passiert ? "passiert" : "kommt"}>
              <time>{uhrzeit(e.t)}</time>
              <span>{e.text}</span>
              {!passiert && <span className="sr-only"> (zur Uhrzeit oben noch nicht passiert)</span>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

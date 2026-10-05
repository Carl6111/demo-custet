import type { Betrieb } from "../daten/typen";

const KERN = [
  { titel: "Vorgänge", text: "Jede Anfrage, jeder Auftrag, jede Rückfrage an einem Ort." },
  { titel: "Posteingang", text: "Anrufe, Mails und Formulare laufen zusammen." },
  { titel: "Dokumente", text: "Angebote und Berichte aus Ihren Vorlagen und Preisen." },
  { titel: "Freigaben", text: "Nichts geht nach außen, bevor Sie es freigegeben haben." },
];

const ABLAEUFE = [
  { titel: "Ein Anruf geht nicht mehr verloren", text: "Alle sind auf Baustellen, eine Kundin ruft wegen ihrer Heizung an." },
  { titel: "Das Angebot geht am selben Tag raus", text: "Vom Aufmaß im Bad bis zum Angebot beim Kunden, inklusive Nachfassen." },
  { titel: "Am Monatsende wissen Sie, was erledigt wurde", text: "Ein Bericht, für den niemand etwas zusammentragen muss." },
];

export function Start({ betrieb, onStart }: { betrieb: Betrieb; onStart: () => void }) {
  const ueberschrift = betrieb.persoenlich
    ? `So könnte Custet bei ${betrieb.name} arbeiten`
    : "So arbeitet Custet in einem Heizungsbetrieb";
  return (
    <div className="start">
      <header className="seiten-kopf">
        <h1>{ueberschrift}</h1>
        <p className="frage">
          Drei Abläufe aus einem normalen Arbeitstag. Links steht jeweils, wie es heute läuft, rechts, was sich mit Custet
          ändert. Die Uhr oben läuft für beide Seiten gleich.
        </p>
        <button type="button" className="knopf" onClick={onStart}>Mit dem ersten Ablauf beginnen</button>
      </header>

      <section aria-labelledby="ablaeufe-titel">
        <h2 id="ablaeufe-titel">Die drei Abläufe</h2>
        <ol className="ablaeufe">
          {ABLAEUFE.map((a) => (
            <li key={a.titel}>
              <strong>{a.titel}</strong>
              <span>{a.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="kern-titel">
        <h2 id="kern-titel">Was jeder Betrieb bekommt</h2>
        <ul className="kern">
          {KERN.map((k) => (
            <li key={k.titel}><strong>{k.titel}</strong><span>{k.text}</span></li>
          ))}
        </ul>
      </section>
    </div>
  );
}

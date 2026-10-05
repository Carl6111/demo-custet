import type { Betrieb } from "../daten/typen";

const ABLAEUFE = [
  { nr: "1", titel: "Ein Anruf", text: "Alle sind auf Baustellen. Eine Kundin ruft an, ihre Heizung ist ausgefallen." },
  { nr: "2", titel: "Ein Angebot", text: "Aufmaß im Bad. Das Angebot geht raus, bevor der Monteur vom Hof ist." },
  { nr: "3", titel: "Ein Bericht", text: "Am Monatsende steht da, was erledigt wurde und was es gebracht hat." },
];

export function Start({ betrieb, onStart }: { betrieb: Betrieb; onStart: () => void }) {
  return (
    <div className="start">
      <header className="seiten-kopf">
        <h1>{betrieb.persoenlich ? `So könnte Custet bei ${betrieb.name} arbeiten` : "So arbeitet Custet in einem Heizungsbetrieb"}</h1>
        <p className="frage">Drei Situationen aus einem normalen Arbeitstag, zum Mitklicken. Dauert etwa zehn Minuten.</p>
      </header>

      <ol className="ablaeufe">
        {ABLAEUFE.map((a) => (
          <li key={a.nr}>
            <span className="ablauf-nr" aria-hidden="true">{a.nr}</span>
            <strong>{a.titel}</strong>
            <span>{a.text}</span>
          </li>
        ))}
      </ol>

      <button type="button" className="knopf knopf-gross" onClick={onStart}>Los geht’s</button>
      <p className="leise start-hinweis">Nichts geht ohne Ihre Freigabe nach außen. Alle Daten hier sind erfunden.</p>
    </div>
  );
}

import { BETRIEB, MODULE } from "./daten";

const KERN = [
  { titel: "Vorgänge", text: "Jede Anfrage, jeder Auftrag, jede Rückfrage an einem Ort." },
  { titel: "Posteingang", text: "Mails, Formulare und Anrufnotizen laufen zusammen." },
  { titel: "Dokumente", text: "Angebote und Berichte entstehen aus Ihren Vorlagen und Preisen." },
  { titel: "Freigaben", text: "Nichts geht nach außen, ohne dass Sie es freigegeben haben." },
];

export function Start({ onWahl }: { onWahl: (id: string) => void }) {
  return (
    <div className="start">
      <h1>So arbeitet das System in Ihrem Betrieb</h1>
      <p className="frage">
        Wir zeigen Ihnen zwei Abläufe aus dem Alltag eines Heizungsbetriebs: {BETRIEB.name}, {BETRIEB.ort}, {BETRIEB.team}.
        Jeder Ablauf zeigt zuerst, wie es heute läuft, und dann, was sich ändert.
      </p>
      <h2>Das haben alle Betriebe gemeinsam</h2>
      <ul className="kern">
        {KERN.map((k) => (
          <li key={k.titel}><strong>{k.titel}</strong><span>{k.text}</span></li>
        ))}
      </ul>
      <h2>Die Abläufe</h2>
      <div className="wahl">
        {MODULE.map((m) => (
          <button key={m.id} type="button" className="wahlkarte" onClick={() => onWahl(m.id)}>
            <strong>{m.kurz}</strong>
            <span>{m.frage}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

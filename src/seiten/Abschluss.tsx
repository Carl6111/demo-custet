import type { Betrieb } from "../daten/typen";

const SCHRITTE = [
  { titel: "Diagnose", text: "Zwei bis drei Wochen. Wir sehen uns Ihre Abläufe an und finden die drei bis fünf, die am meisten Zeit kosten." },
  { titel: "Aufbau", text: "Alle zwei Wochen geht ein Ablauf live. Sie sehen früh, ob es wirkt." },
  { titel: "Betrieb", text: "Wir betreuen das System. Jeden Monatsersten kommt Ihr Bericht." },
];

const KONTAKT = "kontakt@custet.com";

function mailLink(b: Betrieb): string {
  const betreff = `Diagnose-Gespräch${b.persoenlich ? ` für ${b.name}` : ""}`;
  const text = "Hallo,\n\nich habe mir die Demo angesehen und würde gern über ein Diagnose-Gespräch sprechen.\n\nAm meisten Zeit kostet bei uns: ";
  return `mailto:${KONTAKT}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(text)}`;
}

export function Abschluss({ betrieb }: { betrieb: Betrieb }) {
  return (
    <div className="abschluss">
      <header className="seiten-kopf">
        <h1>Welcher Ablauf kostet in Ihrem Betrieb am meisten Zeit?</h1>
        <p className="frage">Damit fangen wir an. Nicht mit allem auf einmal, sondern mit den Abläufen, die sich am meisten lohnen.</p>
      </header>

      <section aria-labelledby="weg-titel">
        <h2 id="weg-titel">So geht es weiter</h2>
        <ol className="weg">
          {SCHRITTE.map((s) => (
            <li key={s.titel}><strong>{s.titel}</strong><span>{s.text}</span></li>
          ))}
        </ol>
      </section>

      <section className="prinzipien" aria-label="Grundsätze">
        <p>Nichts geht ohne Ihre Freigabe nach außen.</p>
        <p>Das System gehört Ihnen.</p>
      </section>

      <a className="knopf" href={mailLink(betrieb)}>Diagnose-Gespräch anfragen</a>
      <p className="leise">Öffnet Ihr Mailprogramm mit einer Nachricht an {KONTAKT}.</p>
    </div>
  );
}

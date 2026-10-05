import type { Betrieb, Modul, Position } from "./typen";

// Dienstag, 14:10 Aufmaß. Nachfassen am Montag darauf (Tag 7).
const DI = 1 * 1440;
const MI = 2 * 1440;
const DO = 3 * 1440;
const MO_DANACH = 7 * 1440;
const START = DI + 14 * 60 + 10;

const DIKTAT =
  "Aufmaß Familie Schubert, Bad im ersten Stock. Wanne raus und entsorgen. Bodengleiche Dusche 120 mal 90 mit Glaswand. Zwei Heizkörper tauschen. Neue Armatur am Waschtisch. Fliesen macht der Kunde selbst. Etwa zwei Tage Arbeit.";

export const POSITIONEN: Position[] = [
  { bez: "Badewanne demontieren und entsorgen", menge: 1, einheit: "psch", einzel: 280, beleg: "Wanne raus und entsorgen" },
  { bez: "Bodengleiche Dusche 120×90, Montage", menge: 1, einheit: "psch", einzel: 1450, beleg: "Bodengleiche Dusche 120 mal 90" },
  { bez: "Duschwand Glas liefern und montieren", menge: 1, einheit: "Stk", einzel: 690, beleg: "mit Glaswand" },
  { bez: "Heizkörper tauschen", menge: 2, einheit: "Stk", einzel: 385, beleg: "Zwei Heizkörper tauschen" },
  { bez: "Waschtischarmatur liefern und montieren", menge: 1, einheit: "Stk", einzel: null, beleg: "Neue Armatur am Waschtisch" },
];

export function angebotModul(b: Betrieb): Modul {
  return {
    id: "angebot",
    kurz: "Angebot",
    titel: "Das Angebot geht am selben Tag raus",
    frage: "Dienstag, 14:10. Aufmaß im Badezimmer bei Familie Schubert. Wie lange dauert es bis zum Angebot?",
    heute: [
      { t: START, text: "Aufmaß im Bad. Der Monteur schreibt auf einen Zettel." },
      { t: DI + 18 * 60 + 40, text: "Im Auto spricht er eine Sprachnachricht fürs Büro ein." },
      { t: MI + 19 * 60, text: "Abends 45 Minuten Angebot abtippen, jeden Preis einzeln nachschlagen." },
      { t: DO + 8 * 60, text: "Das Angebot geht raus, zwei Tage nach dem Aufmaß." },
      { t: null, text: "Danach fragt niemand nach. Ob es angekommen ist, weiß keiner." },
    ],
    mit: [
      {
        id: "diktat",
        kurz: "Notiz",
        t: DI + 14 * 60 + 35,
        status: "Sprachnotiz vom Monteur ist da",
        titel: "Der Monteur spricht seine Notiz ein",
        erklaerung: "Noch beim Kunden, direkt ins Handy. Kein Zettel, nichts muss bis zum Abend im Kopf bleiben.",
        sprecher: "Sagen: Ihr Monteur macht genau das, was er heute auch macht. Er redet. Nur landet es jetzt nicht auf der Mailbox vom Büro.",
        karte: { art: "nachricht", von: "Jonas, Monteur", kanal: "Sprachnotiz, abgetippt", text: DIKTAT },
      },
      {
        id: "positionen",
        kurz: "Angebot",
        t: DI + 14 * 60 + 36,
        status: "Angebotsentwurf aus Ihrer Preisliste",
        titel: "Aus der Notiz werden Positionen",
        erklaerung: "Mengen und Preise kommen aus Ihrer Preisliste. Was dort fehlt, bleibt leer. Das System rät nicht.",
        sprecher: "Auf die leere Zeile zeigen: Hier fehlt ein Preis in der Liste. Es wird nicht geraten, Sie werden gefragt.",
        karte: {
          art: "positionen",
          titel: "Angebotsentwurf A-2026-117",
          quelle: DIKTAT,
          positionen: POSITIONEN,
          hinweis: "„Fliesen macht der Kunde selbst“ steht als Hinweis im Anschreiben, nicht als Position.",
        },
      },
      {
        id: "freigabe-angebot",
        kurz: "Freigabe",
        t: DI + 14 * 60 + 37,
        tErledigt: DI + 15 * 60 + 20,
        status: "Wartet auf Sie: ein Preis fehlt",
        statusErledigt: "Angebot ist bei Familie Schubert",
        titel: "Sie ergänzen den Preis und geben frei",
        erklaerung: "Zwischen zwei Terminen, auf dem Handy. Ohne den fehlenden Preis lässt sich das Angebot nicht freigeben.",
        sprecher: "Fragen: Was würden Sie für die Armatur nehmen? Den Betrag eintippen, die Summe rechnet mit. Dann Freigeben.",
        karte: {
          art: "handy",
          push: "Angebot Familie Schubert: 1 Preis fehlt",
          kanal: "E-Mail",
          an: "Familie Schubert",
          betreff: "Ihr Angebot für das Badezimmer",
          text: `Guten Tag Familie Schubert,\n\nanbei unser Angebot für den Umbau Ihres Badezimmers, wie vorhin besprochen. Wir rechnen mit etwa zwei Arbeitstagen. Die Fliesen übernehmen Sie, das ist so eingeplant.\n\nFreundliche Grüße\n${b.name}`,
          freigabe: "Angebot freigeben",
          erledigt: "Gesendet um 15:20. Über einen Tag früher als sonst.",
          fehlenderPreis: { positionen: POSITIONEN },
        },
      },
      {
        id: "nachfassen",
        kurz: "Erinnerung",
        t: MO_DANACH + 9 * 60,
        tErledigt: MO_DANACH + 9 * 60 + 1,
        status: "Vier Werktage ohne Antwort: Nachfassen fällig",
        statusErledigt: "Nachfrage ist raus, nächste Erinnerung in einer Woche",
        titel: "Nach vier Werktagen meldet sich das System",
        erklaerung: "Keine Antwort auf das Angebot? Dann liegt die Nachfrage fertig auf Ihrem Handy. Sie entscheiden, ob sie rausgeht.",
        sprecher: "Fragen: Wie viele Angebote haben Sie gerade offen, bei denen keiner nachgefragt hat?",
        karte: {
          art: "handy",
          push: "Familie Schubert hat seit 4 Werktagen nicht geantwortet",
          kanal: "E-Mail",
          an: "Familie Schubert",
          betreff: "Kurze Nachfrage zu Ihrem Badezimmer-Angebot",
          text: `Guten Tag Familie Schubert,\n\nkonnten Sie unser Angebot für das Badezimmer schon ansehen? Gern gehen wir einzelne Positionen noch einmal mit Ihnen durch.\n\nFreundliche Grüße\n${b.name}`,
          freigabe: "Nachfrage freigeben",
          erledigt: "Gesendet. Kommt wieder keine Antwort, erinnert Sie das System in einer Woche noch einmal.",
        },
      },
    ],
    messwerte: [
      { art: "warten", label: "Bis das Angebot beim Kunden ist", heute: 2510, mit: 70 },
      { art: "buero", label: "Arbeit im Büro für dieses Angebot", heute: 45, mit: 8 },
    ],
    annahme: "Beispielrechnung mit angenommenen Zeiten, kein Messwert aus einem echten Betrieb. Nachgefasst wird heute nur, wenn jemand daran denkt.",
    sprecherEinstieg: "Fragen: Wer schreibt bei Ihnen die Angebote, und wann? Meistens: der Chef, abends.",
    sprecherVergleich: "Zwei Tage gegen eine Stunde. Und das Nachfassen passiert überhaupt erst. Dann weiter zum Bericht.",
  };
}

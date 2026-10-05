import type { Betrieb, Modul, Redebeitrag } from "./typen";

// Mittwoch, 07:42. Alle Zeiten in Minuten ab Montag 00:00.
const MI = 2 * 1440;
const DO = 3 * 1440;
const START = MI + 7 * 60 + 42;

// Die Stimme nennt keinen Firmennamen. So passt der Ton auch, wenn der Link einen anderen Betrieb einsetzt.
export const GESPRAECH: Redebeitrag[] = [
  { wer: "agent", text: "Guten Morgen, Sie sprechen mit dem digitalen Assistenten. Die Kollegen sind gerade alle beim Kunden. Was kann ich für Sie tun?" },
  { wer: "kunde", text: "Ja, guten Morgen, Hoffmann hier. Unsere Therme brummt seit gestern Abend und geht immer wieder aus. Und heute früh kam gar kein warmes Wasser mehr." },
  { wer: "agent", text: "Das klingt unangenehm. Eine Frage vorab, zur Sicherheit: Riechen Sie Gas?" },
  { wer: "kunde", text: "Nein, Gas riecht man nicht." },
  { wer: "agent", text: "Gut. Dann lassen Sie die Therme bitte erst einmal ausgeschaltet. Wie ist Ihre Adresse?" },
  { wer: "kunde", text: "Kleine Gasse 4 in Wolmirstedt." },
  { wer: "agent", text: "Danke. Erreichen wir Sie unter der Nummer, mit der Sie gerade anrufen?" },
  { wer: "kunde", text: "Ja, genau. Wir haben zwei kleine Kinder, es wäre gut, wenn bald jemand kommt." },
  { wer: "agent", text: "Verstanden. Ich gebe das sofort an das Team weiter. Sie bekommen in wenigen Minuten eine SMS mit einem Termin." },
  { wer: "kunde", text: "Super, danke Ihnen." },
].map((z, i) => ({ ...z, audio: `/audio/anruf-${String(i + 1).padStart(2, "0")}.mp3` }) as Redebeitrag);

const KUNDIN_SAGT = GESPRAECH.filter((z) => z.wer === "kunde").map((z) => z.text).join(" … ");

export function anrufModul(b: Betrieb): Modul {
  return {
    id: "anruf",
    kurz: "Anruf",
    titel: "Ein Anruf geht nicht mehr verloren",
    frage: "Mittwoch, 07:42. Alle sind auf Baustellen. Eine Kundin ruft an, ihre Heizung ist ausgefallen.",
    heute: [
      { t: START, text: "Das Telefon klingelt im leeren Büro." },
      { t: START + 1, text: "Frau Hoffmann spricht auf die Mailbox. Ihre Nummer nuschelt sie." },
      { t: MI + 12 * 60 + 20, text: "Mittagspause: Sie hören die Mailbox ab. Die Nummer ist nicht zu verstehen." },
      { t: MI + 17 * 60 + 30, text: "Das Büro sucht die Nummer in der Anrufliste und tippt alles ab." },
      { t: MI + 17 * 60 + 50, text: "Rückruf. Niemand geht ran." },
      { t: DO + 9 * 60, text: "Rückruf erreicht Frau Hoffmann. Sie hat schon einen anderen Betrieb bestellt." },
      { t: null, text: "Der Auftrag ist weg. Und nirgends steht, dass es ihn gegeben hätte." },
    ],
    mit: [
      {
        id: "anruf",
        kurz: "Anruf",
        t: START,
        status: "Der Assistent nimmt ab und fragt nach",
        titel: "Der Assistent nimmt ab",
        erklaerung: "Er meldet sich als digitaler Assistent, fragt nach dem Nötigen und denkt an die Sicherheitsfrage. Ihre Notfallregeln kennt er.",
        sprecher: "Ton an, falls er im Meeting ankommt. Hinweisen: Er fragt nach Gasgeruch, bevor er irgendetwas anderes macht. Und er sagt keinen Termin zu, das entscheiden Sie.",
        karte: { art: "anruf", anrufer: "Frau Hoffmann", zeilen: GESPRAECH },
      },
      {
        id: "auslesen",
        kurz: "Verstanden",
        t: START + 3,
        status: "Anliegen, Adresse und Dringlichkeit erfasst",
        titel: "Das System liest heraus, worum es geht",
        erklaerung: "Aus dem Gespräch werden Kundin, Adresse, Anliegen und Dringlichkeit. Niemand tippt etwas ab.",
        sprecher: "Kurz warten, bis alle Felder stehen. Dann: Das ist der Zettel, den sonst jemand abends schreibt.",
        karte: {
          art: "auslesen",
          titel: "Aus dem Gespräch",
          quelle: KUNDIN_SAGT,
          zeilen: [
            { label: "Kundin", wert: "Frau Hoffmann, neu", beleg: "Hoffmann hier" },
            { label: "Anliegen", wert: "Gastherme brummt und schaltet ab", beleg: "Therme brummt seit gestern Abend und geht immer wieder aus" },
            { label: "Warmwasser", wert: "Fällt seit heute früh aus", beleg: "gar kein warmes Wasser mehr" },
            { label: "Gasgeruch", wert: "Nein, abgefragt", beleg: "Gas riecht man nicht" },
            { label: "Adresse", wert: "Kleine Gasse 4, Wolmirstedt", beleg: "Kleine Gasse 4 in Wolmirstedt" },
            { label: "Dringlichkeit", wert: "Hoch: kein Warmwasser, kleine Kinder", beleg: "zwei kleine Kinder", markiert: true },
          ],
        },
      },
      {
        id: "vorgang",
        kurz: "Vorgang",
        t: START + 3,
        status: "Vorgang angelegt, Termin vorgeschlagen",
        titel: "Der Vorgang ist angelegt",
        erklaerung: "Mit Terminvorschlag aus Ihrem Plan. Das Gespräch hängt am Vorgang, jeder im Team sieht denselben Stand.",
        sprecher: "Fragen: Wo landet so ein Anruf bei Ihnen heute? Dann weiter.",
        karte: {
          art: "felder",
          titel: "Vorgang S-0418: Störung Gastherme",
          zeilen: [
            { label: "Zuständig", wert: "Monteur-Team Nord" },
            { label: "Terminvorschlag", wert: "Do 08.10., 08:00 bis 10:00, freier Platz im Plan", markiert: true },
            { label: "Vor Ort klären", wert: "Hersteller und Baujahr der Therme" },
            { label: "Gesprächsprotokoll", wert: "Hängt am Vorgang" },
            { label: "Status", wert: "Wartet auf Ihre Freigabe" },
          ],
        },
      },
      {
        id: "freigabe",
        kurz: "Freigabe",
        t: START + 4,
        tErledigt: START + 7,
        status: "Wartet auf Ihre Freigabe",
        statusErledigt: "SMS mit Termin ist bei Frau Hoffmann",
        titel: "Sie geben den Termin frei, vom Handy",
        erklaerung: "Sie stehen auf der Baustelle, das Handy vibriert. Ein Tippen, und die Kundin hat ihren Termin.",
        sprecher: "Sagen: Sie stehen auf der Baustelle, das Handy vibriert. Erst die Nachricht antippen, dann Freigeben. Danach auf die Uhr oben zeigen: 07:49.",
        karte: {
          art: "handy",
          push: "Termin für Frau Hoffmann freigeben?",
          kanal: "SMS",
          an: "Frau Hoffmann",
          text: `Guten Morgen Frau Hoffmann, hier ${b.name}. Wir kommen am Donnerstag, 8.10., zwischen 8 und 10 Uhr zu Ihnen. Bitte lassen Sie die Therme bis dahin aus. Bei Gasgeruch: Haus verlassen und 112 anrufen.`,
          freigabe: "SMS freigeben",
          erledigt: "Gesendet um 07:49. Der Termin steht im Plan von Donnerstag.",
        },
      },
    ],
    messwerte: [
      { art: "warten", label: "Bis die Kundin einen Termin hat", heute: 1518, mit: 7 },
      { art: "buero", label: "Arbeit im Büro für diesen Anruf", heute: 25, mit: 2 },
    ],
    annahme: "Beispielrechnung mit angenommenen Zeiten, kein Messwert aus einem echten Betrieb.",
    sprecherEinstieg: "Auf die Uhr zeigen: 07:42, beide Seiten starten gleich. Links ist hell, was zu dieser Uhrzeit schon passiert ist. Fragen: Wer geht bei Ihnen ran, wenn alle draußen sind? Dann rechts den Anruf starten.",
    sprecherVergleich: "Auf 'Und wie läuft es heute weiter?' klicken und die Uhr laufen lassen. Nicht reden, bis sie steht. Dann: 25 Stunden gegen 7 Minuten.",
  };
}

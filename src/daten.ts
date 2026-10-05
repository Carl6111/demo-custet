// Alles hier ist erfunden: Betrieb, Personen, Preise, Zeiten. Nichts davon stammt aus einem echten Betrieb.
export const BETRIEB = {
  name: "Muster Haustechnik GmbH",
  ort: "Magdeburg-Umland",
  team: "6 Mitarbeitende",
} as const;

export type Zeile = { label: string; wert: string; markiert?: boolean };
export type Position = { bez: string; menge: number; einheit: string; einzel: number | null };

export type Karte =
  | { art: "nachricht"; von: string; kanal: string; zeit: string; text: string }
  | { art: "felder"; titel: string; zeilen: Zeile[] }
  | { art: "positionen"; titel: string; positionen: Position[]; hinweis: string }
  | { art: "entwurf"; an: string; betreff: string; text: string; freigabe: string; erledigt: string };

export type Schritt = { id: string; titel: string; erklaerung: string; karte: Karte };
export type Ablaufzeile = { zeit: string; text: string };
export type Messwert = { label: string; heute: number; mit: number };

export type Modul = {
  id: "anfrage" | "angebot";
  kurz: string;
  titel: string;
  frage: string;
  heute: Ablaufzeile[];
  mit: Schritt[];
  messwerte: Messwert[];
  annahme: string;
};

export const MODULE: Modul[] = [
  {
    id: "anfrage",
    kurz: "Anfrage wird Vorgang",
    titel: "Eine Störungsmeldung geht nicht mehr verloren",
    frage: "Was passiert, wenn mittwochs früh eine Mail zum Heizungsausfall kommt?",
    heute: [
      { zeit: "Mi 07:42", text: "Mail geht ein. Alle sind auf Baustellen." },
      { zeit: "Mi 17:30", text: "Büro sieht die Mail beim Zusammenräumen." },
      { zeit: "Mi 17:50", text: "Kundendaten abtippen, Zettel für den Monteur schreiben." },
      { zeit: "Do 09:00", text: "Rückruf bei der Kundin. Sie hat inzwischen einen anderen Betrieb gefunden." },
    ],
    mit: [
      {
        id: "eingang",
        titel: "Die Mail kommt an",
        erklaerung: "Das System liest Ihr Postfach mit. Anfragen aus Mail, Formular und Anrufnotiz landen am selben Ort.",
        karte: {
          art: "nachricht",
          von: "Frau Hoffmann",
          kanal: "E-Mail",
          zeit: "Mi 07:42",
          text: "Guten Morgen, unsere Therme brummt seit gestern Abend und geht immer wieder aus. Seit heute früh kommt kein warmes Wasser mehr. Wir haben zwei kleine Kinder. Können Sie bald vorbeikommen? Kleine Gasse 4, Wolmirstedt. Danke, S. Hoffmann",
        },
      },
      {
        id: "verstanden",
        titel: "Das System liest heraus, worum es geht",
        erklaerung: "Kunde, Adresse, Gerät und Dringlichkeit stehen sofort da. Niemand tippt etwas ab.",
        karte: {
          art: "felder",
          titel: "Herausgelesen aus der Mail",
          zeilen: [
            { label: "Kundin", wert: "Frau Hoffmann, neu in der Kundenliste" },
            { label: "Adresse", wert: "Kleine Gasse 4, Wolmirstedt" },
            { label: "Anliegen", wert: "Gastherme brummt und schaltet ab, kein Warmwasser" },
            { label: "Dringlichkeit", wert: "Hoch: kein Warmwasser, zwei Kinder im Haushalt", markiert: true },
          ],
        },
      },
      {
        id: "vorgang",
        titel: "Der Vorgang liegt angelegt bereit",
        erklaerung: "Aus der Mail ist ein Vorgang mit Terminvorschlag geworden. Der steht vor dem ersten Kaffee bei Ihnen oben.",
        karte: {
          art: "felder",
          titel: "Vorgang S-0418: Störung Heizung",
          zeilen: [
            { label: "Zuständig", wert: "Monteur-Team Nord" },
            { label: "Terminvorschlag", wert: "Do 08.10., 08:00 bis 10:00. Freier Platz im Plan", markiert: true },
            { label: "Zu klären", wert: "Baujahr und Hersteller der Therme" },
            { label: "Status", wert: "Wartet auf Ihre Freigabe der Antwort" },
          ],
        },
      },
      {
        id: "freigabe",
        titel: "Sie geben die Antwort frei",
        erklaerung: "Die Antwort ist fertig geschrieben. Raus geht sie erst, wenn Sie auf Freigeben tippen.",
        karte: {
          art: "entwurf",
          an: "Frau Hoffmann",
          betreff: "Ihre Heizungsstörung: Termin am Donnerstag",
          text: "Guten Morgen Frau Hoffmann,\n\nvielen Dank für Ihre Nachricht. Wir kommen am Donnerstag, 8. Oktober, zwischen 8 und 10 Uhr zu Ihnen nach Wolmirstedt.\n\nDamit unser Monteur das richtige Teil dabei hat, nennen Sie uns bitte kurz Hersteller und Baujahr der Therme. Sie finden beides auf dem Typenschild.\n\nBis dahin: Bitte lassen Sie die Therme ausgeschaltet.\n\nFreundliche Grüße\nMuster Haustechnik GmbH",
          freigabe: "Freigeben und senden",
          erledigt: "Gesendet um 07:49. Vorgang S-0418 steht im Plan von Donnerstag.",
        },
      },
    ],
    messwerte: [
      { label: "Bis die Kundin eine Antwort hat", heute: 1518, mit: 7 },
      { label: "Arbeit im Büro", heute: 20, mit: 2 },
    ],
    annahme: "Beispielrechnung mit angenommenen Zeiten, kein Messwert aus einem echten Betrieb.",
  },
  {
    id: "angebot",
    kurz: "Angebot und Nachfassen",
    titel: "Das Angebot geht am selben Tag raus und wird nachgefasst",
    frage: "Was passiert nach dem Aufmaß im Badezimmer?",
    heute: [
      { zeit: "Di 14:10", text: "Aufmaß beim Kunden. Der Monteur merkt sich alles im Kopf." },
      { zeit: "Di 18:40", text: "Im Auto diktiert er eine Sprachnachricht ans Büro." },
      { zeit: "Mi 19:00", text: "45 Minuten Angebot abtippen, Preise einzeln nachschlagen." },
      { zeit: "Do 08:00", text: "Angebot geht raus, zwei Tage nach dem Aufmaß." },
      { zeit: "danach", text: "Niemand fragt nach. Es gibt immer Wichtigeres." },
    ],
    mit: [
      {
        id: "diktat",
        titel: "Der Monteur spricht seine Notiz ein",
        erklaerung: "Er diktiert noch beim Kunden. Das System schreibt mit, kein Zettel, kein Auswendiglernen.",
        karte: {
          art: "nachricht",
          von: "Jonas, Monteur",
          kanal: "Sprachnotiz, abgetippt",
          zeit: "Di 14:35",
          text: "Aufmaß Familie Schubert, Bad im ersten Stock. Wanne raus, bodengleiche Dusche 120 mal 90, Duschwand Glas. Zwei Heizkörper tauschen. Neue Armaturen für Waschtisch. Fliesen macht der Kunde selbst. Etwa zwei Tage Arbeit.",
        },
      },
      {
        id: "positionen",
        titel: "Das System macht daraus Positionen",
        erklaerung: "Menge und Preis kommen aus Ihrer Preisliste. Was dort fehlt, bleibt leer. Es wird nichts geraten.",
        karte: {
          art: "positionen",
          titel: "Angebotsentwurf A-2026-117",
          positionen: [
            { bez: "Badewanne demontieren und entsorgen", menge: 1, einheit: "psch", einzel: 280 },
            { bez: "Bodengleiche Dusche 120×90, Montage", menge: 1, einheit: "psch", einzel: 1450 },
            { bez: "Duschwand Glas liefern und montieren", menge: 1, einheit: "Stk", einzel: 690 },
            { bez: "Heizkörper tauschen", menge: 2, einheit: "Stk", einzel: 385 },
            { bez: "Waschtischarmatur", menge: 1, einheit: "Stk", einzel: null },
          ],
          hinweis: "Bei der Waschtischarmatur fehlt der Preis in Ihrer Liste. Bitte ergänzen, bevor das Angebot rausgeht.",
        },
      },
      {
        id: "angebot-frei",
        titel: "Sie prüfen und geben das Angebot frei",
        erklaerung: "Anschreiben und Positionen sind fertig. Sie prüfen, ergänzen den fehlenden Preis und tippen auf Freigeben.",
        karte: {
          art: "entwurf",
          an: "Familie Schubert",
          betreff: "Ihr Angebot für das Badezimmer",
          text: "Guten Tag Familie Schubert,\n\nanbei das Angebot für den Umbau Ihres Badezimmers, so wie wir es am Dienstag besprochen haben.\n\nWir rechnen mit etwa zwei Arbeitstagen. Die Fliesen übernehmen Sie, das haben wir so eingeplant.\n\nBei Fragen rufen Sie einfach an.\n\nFreundliche Grüße\nMuster Haustechnik GmbH",
          freigabe: "Angebot freigeben",
          erledigt: "Angebot A-2026-117 gesendet am Dienstag um 15:20, über einen Tag früher als sonst.",
        },
      },
      {
        id: "nachfassen",
        titel: "Nach fünf Tagen meldet sich das System",
        erklaerung: "Keine Antwort auf das Angebot? Dann kommt eine Erinnerung an Sie. Der Entwurf zum Nachfassen liegt schon da.",
        karte: {
          art: "felder",
          titel: "Nachfassen fällig",
          zeilen: [
            { label: "Angebot", wert: "A-2026-117, Familie Schubert, gesendet am Di" },
            { label: "Seitdem", wert: "Fünf Tage ohne Antwort", markiert: true },
            { label: "Vorschlag", wert: "Kurze, freundliche Nachfrage per Mail" },
            { label: "Status", wert: "Wartet auf Ihre Freigabe" },
          ],
        },
      },
      {
        id: "nachfass-frei",
        titel: "Sie geben die Nachfrage frei",
        erklaerung: "Auch das Nachfassen geht nur mit Ihrem OK raus. Sie entscheiden, ob und wann.",
        karte: {
          art: "entwurf",
          an: "Familie Schubert",
          betreff: "Kurze Nachfrage zu Ihrem Badezimmer-Angebot",
          text: "Guten Tag Familie Schubert,\n\nich wollte kurz nachfragen, ob Sie unser Angebot für das Badezimmer schon ansehen konnten. Gern gehen wir einzelne Positionen noch einmal mit Ihnen durch.\n\nFreundliche Grüße\nMuster Haustechnik GmbH",
          freigabe: "Nachfrage freigeben",
          erledigt: "Nachfrage gesendet. Das System erinnert in fünf Tagen noch einmal, wenn weiter keine Antwort kommt.",
        },
      },
    ],
    messwerte: [
      { label: "Bis das Angebot beim Kunden ist", heute: 2510, mit: 45 },
      { label: "Arbeit im Büro", heute: 45, mit: 8 },
    ],
    annahme: "Beispielrechnung mit angenommenen Zeiten, kein Messwert aus einem echten Betrieb. Nachfassen gibt es heute nur, wenn jemand daran denkt.",
  },
];

export function summe(positionen: Position[]): { betrag: number; offen: number } {
  return positionen.reduce(
    (acc, p) => (p.einzel === null ? { ...acc, offen: acc.offen + 1 } : { ...acc, betrag: acc.betrag + p.menge * p.einzel }),
    { betrag: 0, offen: 0 },
  );
}

export function dauer(minuten: number): string {
  if (minuten < 60) return `${minuten} Min.`;
  const std = minuten / 60;
  if (std < 48) return `${Math.round(std)} Std.`;
  return `${Math.round(std / 24)} Tage`;
}

export function euro(betrag: number): string {
  return betrag.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
}

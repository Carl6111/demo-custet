// Zeitpunkte sind Minuten ab Montag 00:00 der Beispielwoche. So laufen "heute" und "mit Custet" auf derselben Uhr.
export type Minute = number;

export type Betrieb = { name: string; persoenlich: boolean };

export type HeuteEintrag = { t: Minute | null; text: string };

export type Zeile = { label: string; wert: string; markiert?: boolean; beleg?: string };
export type Position = { bez: string; menge: number; einheit: string; einzel: number | null; beleg: string };
export type Redebeitrag = { wer: "agent" | "kunde"; text: string; audio?: string };

export type Karte =
  | { art: "anruf"; anrufer: string; zeilen: Redebeitrag[] }
  | { art: "nachricht"; von: string; kanal: string; text: string }
  | { art: "auslesen"; titel: string; quelle: string; zeilen: Zeile[] }
  | { art: "felder"; titel: string; zeilen: Zeile[] }
  | { art: "positionen"; titel: string; quelle: string; positionen: Position[]; hinweis: string }
  | {
      art: "handy";
      push: string;
      kanal: "SMS" | "E-Mail";
      an: string;
      betreff?: string;
      text: string;
      freigabe: string;
      erledigt: string;
      fehlenderPreis?: { positionen: Position[] };
    };

export type Schritt = {
  id: string;
  t: Minute;
  /** Nur bei Freigaben: wann es nach dem Tippen auf Freigeben draußen ist. */
  tErledigt?: Minute;
  /** Ein Wort für die Bildfolge oben. */
  kurz: string;
  status: string;
  statusErledigt?: string;
  titel: string;
  erklaerung: string;
  sprecher: string;
  karte: Karte;
};

export type Messwert = { art: "warten" | "buero"; label: string; heute: number; mit: number };

export type Modul = {
  id: "anruf" | "angebot";
  kurz: string;
  titel: string;
  frage: string;
  heute: HeuteEintrag[];
  mit: Schritt[];
  messwerte: Messwert[];
  annahme: string;
  sprecherEinstieg: string;
  sprecherVergleich: string;
};

import { describe, expect, it } from "vitest";
import { alleModule } from "./index";
import { auftragsSumme, ersparnisMinuten } from "./bericht";
import { STANDARD_BETRIEB, arbeitstage, betriebAus, dauer, markiere, stunden, summe, uhrzeit } from "./rechnen";
import { POSITIONEN } from "./angebot";
import type { Modul } from "./typen";

const STANDARD = { name: STANDARD_BETRIEB, persoenlich: false };
const MODULE = alleModule(STANDARD);

describe("Formate", () => {
  it("uhrzeit zählt ab Montag 00:00", () => {
    expect(uhrzeit(2 * 1440 + 7 * 60 + 42)).toBe("Mi 07:42");
    expect(uhrzeit(7 * 1440 + 9 * 60)).toBe("Mo 09:00");
  });
  it("dauer wählt die lesbare Einheit", () => {
    expect(dauer(7)).toBe("7 Min.");
    expect(dauer(1518)).toBe("25 Std.");
    expect(dauer(2880)).toBe("2 Tage");
  });
  it("stunden rundet auf halbe Stunden", () => {
    expect(stunden(1047)).toBe("17,5 Std.");
    expect(arbeitstage(1047)).toBe(2.2);
  });
});

describe("summe", () => {
  it("zählt fehlende Preise als offen", () => {
    expect(summe(POSITIONEN)).toEqual({ betrag: 3190, offen: 1 });
  });
  it("rechnet einen ergänzten Preis mit", () => {
    expect(summe(POSITIONEN, 240)).toEqual({ betrag: 3430, offen: 0 });
  });
});

describe("markiere", () => {
  it("schneidet Belegstellen heraus und behält den Rest", () => {
    const teile = markiere("Wanne raus. Dusche rein.", ["Dusche rein", "Wanne raus"]);
    expect(teile).toEqual([
      { text: "Wanne raus", beleg: 1 },
      { text: ". ", beleg: null },
      { text: "Dusche rein", beleg: 0 },
      { text: ".", beleg: null },
    ]);
  });
});

describe("betriebAus", () => {
  it("nimmt den Namen aus dem Link", () => {
    expect(betriebAus("?betrieb=Heizung%20Krause%20GmbH")).toEqual({ name: "Heizung Krause GmbH", persoenlich: true });
  });
  it("fällt ohne Namen auf den Beispielbetrieb zurück", () => {
    expect(betriebAus("")).toEqual(STANDARD);
    expect(betriebAus("?betrieb=%20%20")).toEqual(STANDARD);
  });
  it("entfernt Steuerzeichen und kürzt", () => {
    const b = betriebAus(`?betrieb=${encodeURIComponent("<b>Krause</b>\n" + "x".repeat(100))}`);
    expect(b.name).not.toMatch(/[<>\n]/);
    expect(b.name.length).toBeLessThanOrEqual(60);
  });
});

const belegeVon = (m: Modul) =>
  m.mit.flatMap((s) => {
    const k = s.karte;
    if (k.art === "auslesen") return k.zeilen.map((z) => ({ quelle: k.quelle, beleg: z.beleg! }));
    if (k.art === "positionen") return k.positionen.map((p) => ({ quelle: k.quelle, beleg: p.beleg }));
    return [];
  });

describe.each(MODULE.map((m) => [m.id, m] as const))("Modul %s", (_, m) => {
  it("Zeiten laufen vorwärts", () => {
    const heute = m.heute.flatMap((e) => (e.t === null ? [] : [e.t]));
    expect(heute).toEqual([...heute].sort((a, b) => a - b));
    const mit = m.mit.map((s) => s.t);
    expect(mit).toEqual([...mit].sort((a, b) => a - b));
    m.mit.forEach((s) => s.tErledigt !== undefined && expect(s.tErledigt).toBeGreaterThanOrEqual(s.t));
  });

  it("jeder Beleg steht wörtlich in der Quelle", () => {
    belegeVon(m).forEach(({ quelle, beleg }) => expect(quelle).toContain(beleg));
  });

  it("Wartezeit heute passt zur Zeitleiste", () => {
    const zeiten = m.heute.flatMap((e) => (e.t === null ? [] : [e.t]));
    const warten = m.messwerte.find((w) => w.art === "warten")!;
    expect(warten.heute).toBe(zeiten[zeiten.length - 1] - zeiten[0]);
  });

  it("Wartezeit mit Custet passt zur ersten Freigabe", () => {
    const erste = m.mit.find((s) => s.karte.art === "handy")!;
    expect(m.messwerte.find((w) => w.art === "warten")!.mit).toBe(erste.tErledigt! - m.heute[0].t!);
  });

  it("endet mit einer Freigabe auf dem Handy", () => {
    expect(m.mit[m.mit.length - 1].karte.art).toBe("handy");
  });

  it("nennt keinen Custet-Preis", () => {
    expect(JSON.stringify(m)).not.toMatch(/[24]\.?000\s*€|pro Monat/);
  });
});

describe("Personalisierung", () => {
  it("setzt den Namen des Interessenten in Nachrichten ein", () => {
    const text = JSON.stringify(alleModule({ name: "Heizung Krause", persoenlich: true }));
    expect(text).toContain("Heizung Krause");
    expect(text).not.toContain(STANDARD_BETRIEB);
  });
});

describe("Bericht", () => {
  it("leitet die Ersparnis aus den Abläufen ab", () => {
    expect(ersparnisMinuten(MODULE)).toBe(23 * 23 + 14 * 37);
  });
  it("Auftrag Schubert passt zum Angebot aus Ablauf 2 mit 240 € Armatur", () => {
    expect(auftragsSumme()).toBe(12500);
    expect(summe(POSITIONEN, 240).betrag).toBe(3430);
  });
});

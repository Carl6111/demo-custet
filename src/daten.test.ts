import { describe, expect, it } from "vitest";
import { MODULE, dauer, summe } from "./daten";

describe("dauer", () => {
  it("wählt die lesbare Einheit", () => {
    expect(dauer(7)).toBe("7 Min.");
    expect(dauer(120)).toBe("2 Std.");
    expect(dauer(1518)).toBe("25 Std.");
    expect(dauer(2880)).toBe("2 Tage");
  });
});

describe("summe", () => {
  it("zählt Positionen ohne Preis als offen, nicht als null", () => {
    const angebot = MODULE.find((m) => m.id === "angebot")!;
    const karte = angebot.mit.map((s) => s.karte).find((k) => k.art === "positionen")!;
    if (karte.art !== "positionen") throw new Error("falsche Karte");
    expect(summe(karte.positionen)).toEqual({ betrag: 3190, offen: 1 });
  });
});

describe("Module", () => {
  it("jedes Modul hat Ausgangslage, Ablauf und Vergleich", () => {
    for (const m of MODULE) {
      expect(m.heute.length).toBeGreaterThan(2);
      expect(m.mit.length).toBeGreaterThan(2);
      m.messwerte.forEach((w) => expect(w.mit).toBeLessThan(w.heute));
    }
  });

  it("endet jedes Modul mit einer Freigabe", () => {
    for (const m of MODULE) expect(m.mit[m.mit.length - 1].karte.art).toBe("entwurf");
  });

  it("nennt keinen Custet-Preis", () => {
    expect(JSON.stringify(MODULE)).not.toMatch(/[24]\.?000\s*€|pro Monat/);
  });
});

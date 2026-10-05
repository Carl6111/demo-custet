import { markiere } from "../daten/rechnen";

export const TAKT_MS = 380;

/** Quelltext, in dem die Belegstellen nacheinander aufleuchten: so sieht man, woher jedes Feld kommt. */
export function Markiert({ quelle, belege }: { quelle: string; belege: string[] }) {
  return (
    <p className="quelle">
      {markiere(quelle, belege).map((a, i) =>
        a.beleg === null ? (
          <span key={i}>{a.text}</span>
        ) : (
          <mark key={i} style={{ animationDelay: `${a.beleg * TAKT_MS}ms` }}>
            {a.text}
          </mark>
        ),
      )}
    </p>
  );
}

export const verzoegert = (i: number, plus = 160) => ({ animationDelay: `${i * TAKT_MS + plus}ms` });

import type { Schritt } from "../daten/typen";

type Props = { schritte: Schritt[]; aktuell: number; erreicht: number; onWahl: (i: number) => void };

/** Die ganze Strecke auf einen Blick: wo ist der Anruf, was ist schon passiert, was kommt noch. */
export function Bildfolge({ schritte, aktuell, erreicht, onWahl }: Props) {
  return (
    <ol className="folge" aria-label="Ablauf">
      {schritte.map((s, i) => {
        const zustand = i === aktuell ? "jetzt" : i < aktuell ? "getan" : "kommt";
        return (
          <li key={s.id} className={`folge-punkt ${zustand}`}>
            <button
              type="button"
              disabled={i > erreicht}
              aria-current={i === aktuell ? "step" : undefined}
              onClick={() => onWahl(i)}
            >
              <span className="folge-kreis" aria-hidden="true">{i < aktuell ? "✓" : i + 1}</span>
              <span className="folge-name">{s.kurz}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

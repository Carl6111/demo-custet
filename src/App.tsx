import { useState } from "react";
import { BETRIEB, MODULE } from "./daten";
import { ModulSeite } from "./ModulSeite";
import { Start } from "./Start";

const START = "start";

export function App() {
  const [seite, setSeite] = useState<string>(START);
  const index = MODULE.findIndex((m) => m.id === seite);
  const modul = index >= 0 ? MODULE[index] : null;
  const naechster = index >= 0 && index < MODULE.length - 1 ? MODULE[index + 1].id : null;

  return (
    <>
      <header className="kopf">
        <button type="button" className="marke" onClick={() => setSeite(START)} aria-label="Zur Startseite">
          <img src="/logo.webp" alt="" width={32} height={32} />
          <span>Custet</span>
        </button>
        <nav className="nav" aria-label="Abläufe">
          {MODULE.map((m) => (
            <button key={m.id} type="button" className={m.id === seite ? "navpunkt aktiv" : "navpunkt"} aria-current={m.id === seite ? "page" : undefined} onClick={() => setSeite(m.id)}>
              {m.kurz}
            </button>
          ))}
        </nav>
        <p className="beispiel">Beispielbetrieb: {BETRIEB.name}. Alle Daten sind erfunden.</p>
      </header>
      <main id="inhalt">
        {modul ? (
          <ModulSeite key={modul.id} modul={modul} onWeiter={naechster ? () => setSeite(naechster) : null} />
        ) : (
          <Start onWahl={setSeite} />
        )}
      </main>
    </>
  );
}

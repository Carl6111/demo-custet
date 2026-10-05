import { useCallback, useEffect, useMemo, useState } from "react";
import { NAV, alleModule, naechsteSeite, type Seite } from "./daten";
import { betriebAus } from "./daten/rechnen";
import { useSeite } from "./lib/navigation";
import { sprecherOeffnen, sprecherSender } from "./lib/sprecher";
import { Abschluss } from "./seiten/Abschluss";
import { Bericht } from "./seiten/Bericht";
import { ModulSeite } from "./seiten/ModulSeite";
import { Sprecher } from "./seiten/Sprecher";
import { Start } from "./seiten/Start";

const WEITER_LABEL: Partial<Record<Seite, string>> = {
  anruf: "Weiter zum Angebot",
  angebot: "Weiter zum Monatsbericht",
};

export function App() {
  const betrieb = useMemo(() => betriebAus(window.location.search), []);
  const istSprecher = useMemo(() => new URLSearchParams(window.location.search).has("sprecher"), []);
  return istSprecher ? <Sprecher betrieb={betrieb} /> : <Demo />;
}

function Demo() {
  const betrieb = useMemo(() => betriebAus(window.location.search), []);
  const module = useMemo(() => alleModule(betrieb), [betrieb]);
  const [seite, geh] = useSeite();
  const [sender] = useState(sprecherSender);

  const melde = useCallback((schritt: number, fertig: boolean) => sender.melde({ seite, schritt, fertig }), [seite, sender]);
  useEffect(() => {
    if (seite === "start" || seite === "bericht" || seite === "weiter") melde(0, false);
  }, [seite, melde]);
  useEffect(() => () => sender.schliessen(), [sender]);

  useEffect(() => {
    const taste = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "n" || e.key === "N") sprecherOeffnen();
    };
    window.addEventListener("keydown", taste);
    return () => window.removeEventListener("keydown", taste);
  }, []);

  const weiter = () => {
    const n = naechsteSeite(seite);
    if (n) geh(n);
  };
  const modul = module.find((m) => m.id === seite);

  return (
    <>
      <a className="sprung" href="#inhalt">Zum Inhalt</a>
      <header className="kopf">
        <button type="button" className="marke" onClick={() => geh("start")} aria-label="Zur Übersicht">
          <img src="/logo.webp" alt="" width={28} height={28} />
          <span>Custet</span>
        </button>
        <nav className="nav" aria-label="Abläufe">
          {NAV.map((n) => (
            <button
              key={n.seite}
              type="button"
              className={n.seite === seite ? "navpunkt aktiv" : "navpunkt"}
              aria-current={n.seite === seite ? "page" : undefined}
              onClick={() => geh(n.seite)}
            >
              {n.label}
            </button>
          ))}
        </nav>
        <p className="beispiel">
          {betrieb.persoenlich ? `Beispiel für ${betrieb.name}. ` : `Beispielbetrieb ${betrieb.name}. `}
          Alle Vorgänge und Zahlen sind erfunden.
        </p>
      </header>

      <main id="inhalt">
        {seite === "start" && <Start betrieb={betrieb} onStart={() => geh("anruf")} />}
        {modul && (
          <ModulSeite key={modul.id} modul={modul} weiterLabel={WEITER_LABEL[seite] ?? "Weiter"} onWeiter={weiter} melde={melde} />
        )}
        {seite === "bericht" && <Bericht betrieb={betrieb} module={module} onWeiter={weiter} />}
        {seite === "weiter" && <Abschluss betrieb={betrieb} />}
      </main>

      <footer className="fuss">
        <span>Custet · Demo mit erfundenen Daten</span>
        <a href="https://www.custet.com/impressum.html">Impressum</a>
        <a href="https://www.custet.com/datenschutz.html">Datenschutz</a>
      </footer>
    </>
  );
}

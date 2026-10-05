import { useEffect, useState } from "react";
import { SEITEN, type Seite } from "../daten";

function lies(): Seite {
  const h = window.location.hash.slice(1);
  return (SEITEN as readonly string[]).includes(h) ? (h as Seite) : "start";
}

/** Seite steht im Hash (#anruf), damit Neuladen und verschickte Links an derselben Stelle landen. */
export function useSeite(): [Seite, (s: Seite) => void] {
  const [seite, setSeite] = useState<Seite>(lies);
  useEffect(() => {
    const folgen = () => setSeite(lies());
    window.addEventListener("hashchange", folgen);
    return () => window.removeEventListener("hashchange", folgen);
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [seite]);
  const geh = (s: Seite) => {
    window.location.hash = s === "start" ? "" : s;
  };
  return [seite, geh];
}

export function wenigBewegung(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

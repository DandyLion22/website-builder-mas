# Erkenntnisse aus dem Prototyp-Bau (Entwurf, ungefiltert)

Status: **Rohsammlung.** Diese Punkte stammen aus dem Bau und Deployment
des ersten konkreten Prototyps ("Salon Lindenblatt", basierend auf
`vorlage-friseursalon.html`) und sind bewusst noch **nicht** in
`planung/mas-website-builder-planung.md` übernommen — dort gehören nur
Punkte hin, die sich über mehrere Branchen/Prototypen bestätigt haben.
Bis dahin: hier sammeln, ergänzen, auch wieder verwerfen.

Live-Demo (Stand 2026-08-21): https://dandylion22.github.io/website-builder-mas/
Repo: `DandyLion22/website-builder-mas`

---

## Rechtstexte

- Sobald aus dem Platzhalter-Link „Impressum" ein echter Text wird, passt
  der nicht mehr in eine Section der Single-Page — es braucht eigene
  HTML-Seiten (`impressum.html`, `datenschutz.html`) mit
  `<meta name="robots" content="noindex">`.
  → Möglicher Schluss: Der Build-Agent muss pro Website mehrere Dateien
  erzeugen können, nicht nur eine.
- Impressum-Pflichtangaben hängen von der Rechtsform ab (Einzelunternehmen
  vs. GmbH unterscheiden sich z. B. bei Handelsregister/Geschäftsführer).
  → Möglicher Schluss: Rechtsform gehört als Pflichtfeld ins
  Intake-Interview, nicht nur "Firmenname".
- Weil weder Cookies noch externe Dienste (Google Fonts, Analytics)
  eingebunden sind, bleibt die Datenschutzerklärung kurz und braucht
  keinen Cookie-Consent-Baustein. Bestätigt eher die bisherige
  Architekturentscheidung, als dass sie etwas Neues verlangt.

## Formular & SEO

- Formular-Spam-Schutz (Honeypot) fehlte im generischen Template komplett
  und musste erst beim konkreten Bau ergänzt werden, obwohl er in der
  Planung schon gefordert war.
  → Möglicher Schluss: Honeypot gehört fest in die
  Kontaktformular-Komponente der Bibliothek statt als Nachtrag pro Kunde.
- `robots.txt` und `sitemap.xml` existierten im Template nicht — fällt nur
  beim tatsächlichen Deployment auf, nicht beim Betrachten der Seite.
  → Möglicher Schluss: Beide Dateien automatisiert pro Build erzeugen
  (mit korrekter, domain-spezifischer URL).
- `schema.org`-Felder (Telefon, Adresse, Öffnungszeiten) waren im
  generischen Template leer. Sie müssen aus strukturierten Intake-Daten
  befüllbar sein, nicht nur der sichtbare Text.

## Deployment

- Kostenlose Veröffentlichung (GitHub Pages) liefert automatisches SSL
  und ist in unter 2 Minuten live — brauchbar, um den grundsätzlichen
  Ablauf zu verstehen, aber **kein** Ersatz für einen Test des echten
  Ziel-Stacks (Hetzner + INWX + Cloudflare), der andere Schritte hat
  (Domain-Kauf, DNS, Cloudflare-Proxy). Das muss separat getestet werden,
  sobald die Konten aus Todo-Phase 1 existieren.
- GitHub Pages im kostenlosen Modus verlangt ein öffentliches Repo —
  relevant für später: falls Kundencode vertraulich bleiben soll, ist
  entweder GitHub Pro/Team oder direkt der Ziel-Stack nötig.
- GitHub Pages im "Legacy"-Modus (Branch + Pfad) kann nur Repo-Root oder
  `/docs` veröffentlichen. Für eine sinnvoll benannte Ordnerstruktur
  (`prototyp/` statt `docs/`) war stattdessen ein GitHub-Actions-Workflow
  nötig (`.github/workflows/deploy-pages.yml`), der gezielt den Ordner
  `prototyp/` veröffentlicht.
- Eine frische Arbeitsumgebung hatte noch keine Git-Identität konfiguriert.
  Für einen späteren Build-/DevOps-Agenten relevant: der braucht eine
  eigene, feste Commit-Identität, nicht die des Betreibers.

## Offene Fragen, noch nicht entschieden

- Welche der obigen Punkte gelten branchenübergreifend (vermutlich:
  Rechtstext-Seiten, Honeypot, robots.txt/sitemap.xml) und welche waren
  friseurspezifisch (z. B. genaue Service-Kategorien)? Erst nach 1–2
  weiteren Branchen-Prototypen zu beantworten.
- Ob echte Domain/DNS-Erkenntnisse (Ziel-Stack) grundsätzlich andere
  Learnings bringen als der GitHub-Pages-Testlauf.

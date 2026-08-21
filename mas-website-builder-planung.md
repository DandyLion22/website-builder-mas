# MAS-Planung: Website-Builder-Startup

Dieses Dokument beschreibt die geplante Multi-Agent-System-Architektur für ein
Startup, das Websites für kleine Unternehmen erstellt und deren Lebenszyklus
(Erstellung → Go-Live → laufende Wartung) verwaltet.

Status: **Konzeptphase** — noch keine Kunden, kein Code. Ziel dieses Dokuments
ist es, Claude Code eine präzise Grundlage zu geben, um das System iterativ
aufzubauen — nicht, alle Agenten sofort produktiv zu implementieren.

---

## 1. Leitprinzipien

1. **Orchestrator + spezialisierte Worker-Agenten**, kein loser Agenten-Schwarm
   mit freier Kommunikation untereinander. Der Orchestrator delegiert über
   klar typisierte Aufrufe; Worker kommunizieren nicht direkt miteinander.
2. **Template-/Komponenten-basiert statt freies Codegen.** Websites werden aus
   einer kuratierten Komponenten-Bibliothek zusammengesetzt, nicht bei jedem
   Kunden von Grund auf generiert. Das hält Qualität, Kosten und Wartbarkeit
   im Rahmen.
3. **Konsolidierung nach Fähigkeit, nicht nach Business-Begriff.** Aufgaben,
   die dieselbe Kernkompetenz erfordern, liegen im selben Agenten, auch wenn
   sie unterschiedliche Geschäftsphasen betreffen.
4. **Kein Kunden-Self-Service.** Kunden bearbeiten ihre Website nicht selbst.
   Änderungswünsche werden dem Betreiber mitgeteilt (über den
   Client-Interface-Agent) und vom System umgesetzt — siehe Abschnitt 7.6.
5. **Human-in-the-loop-Gates** an kritischen Punkten, solange das System noch
   nicht ausreichend Vertrauen verdient hat.
6. **MVP zuerst manuell, dann schrittweise automatisieren.** Reihenfolge der
   Implementierung siehe Abschnitt 6.

---

## 2. Architekturübersicht

```
Kunde
  ↓
Orchestrator-Agent (Zustandsmaschine pro Projekt)
  ├─→ Client-Interface-Agent   (Sales, Intake, nimmt Änderungswünsche entgegen)
  ├─→ Content-Agent            (Texte, SEO, Bilder)
  ├─→ Design-Agent             (Struktur, Layout, Branding)
  ├─→ Build-Agent              (Zusammenbau, setzt Änderungen technisch um)
  ├─→ QA-&-Compliance-Agent    (Tests, Recht, Barrierefreiheit)
  ├─→ DevOps-Agent             (Deployment, Domain, Monitoring)
  └─→ Billing-&-Reporting-Agent (Rechnungen, Reports)

Geteilte Ressource (kein Agent):
  Template-&-Asset-Bibliothek  (gelesen von Design, Build, QA)
```

---

## 3. Agenten im Detail

### 3.0 Orchestrator-Agent

**Zweck:** Zentrale Zustandsmaschine pro Kundenprojekt. Entscheidet, welcher
Agent als Nächstes aktiv wird, verwaltet Freigabe-Gates, kein direkter
Kundenkontakt.

**Aufgaben:**
- Projektstatus pro Kunde führen (siehe Zustände in Abschnitt 4)
- Worker-Agenten in korrekter Reihenfolge mit dem passenden Kontext aufrufen
- Freigabe-Gates einbauen (Entwurf-Freigabe, Go-Live-Freigabe, siehe 7.4)
- Fehler-/Retry-Handling zwischen Agenten
- Bei Unsicherheit an dich (Mensch) eskalieren

**Input:** Projekt-ID, aktueller Zustand, eingetretenes Ereignis
**Output:** Dispatch-Aufruf an nächsten Agenten inkl. Kontext
**Tools/Zugriff:** Projekt-Datenbank (Status), Dispatch-Mechanismus zu allen
Worker-Agenten

---

### 3.1 Client-Interface-Agent

**Zweck:** Sämtliche direkte Kommunikation mit dem Kunden über den gesamten
Lebenszyklus — konsolidiert Sales, Intake/Discovery und die Entgegennahme von
Änderungswünschen.

**Aufgaben:**
- *Erstgespräch:* Bedarf grob klären, Angebot/Preis kommunizieren, zum
  Abschluss führen
- *Intake/Discovery:* strukturiertes Interview — Branche, Zielgruppe,
  gewünschte Seiten, Content-Wünsche, vorhandene Assets, Referenz-Websites,
  gewünschter Ton/Stil
- *Änderungswünsche entgegennehmen:* Kunde teilt Änderung mit (Chat/E-Mail),
  Agent übersetzt sie in eine strukturierte Aufgabe für den Build-Agenten und
  meldet den Bearbeitungsstatus an den Kunden zurück

**Wichtig — kein Self-Service:** Der Kunde bekommt **kein** Bearbeitungs-
Dashboard. Er teilt Wünsche mit, das System (Build-Agent) setzt sie um, und
der Betreiber (du) gibt zumindest anfangs jede Änderung frei, bevor sie live
geht.

**Input:** Kundennachrichten (Chat/Formular/E-Mail), Projektstatus vom
Orchestrator
**Output:** strukturierte Anforderungs-/Änderungsobjekte (JSON) an den
Orchestrator; Antworten an den Kunden
**Tools/Zugriff:** Chat-/Formular-Interface, ggf. E-Mail-Integration,
Kundendaten-Speicher

---

### 3.2 Content-Agent

**Zweck:** Sämtliche Text- und Bildinhalte — konsolidiert Copywriting, SEO,
Bildauswahl/-generierung, Übersetzung.

**Aufgaben:**
- Texte je Seite/Sektion basierend auf Intake-Daten (Hero, Über uns,
  Leistungen, Kontakt, …)
- SEO: Meta-Titles/-Descriptions, Alt-Texte, Keyword-sinnvolle Formulierung
- Bildauswahl bzw. -generierung passend zu Branche/Stil
- Bei Bedarf: Übersetzung in weitere Sprachen

**Input:** strukturierte Anforderungen vom Client-Interface-Agent
**Output:** fertige Content-Blöcke (Text + Bild-Referenzen) je Komponente
**Tools/Zugriff:** Bildgenerierungs-/Stock-Bild-API, ggf. SEO-Keyword-Tool

---

### 3.3 Design-Agent

**Zweck:** Strukturelle und gestalterische Entscheidungen — keine
Content-Erstellung.

**Aufgaben:**
- Seitenstruktur festlegen (welche Seiten/Sections, in welcher Reihenfolge)
- Layout-/Komponentenauswahl aus der Template-Bibliothek passend zu
  Branche/Stil
- Branding ableiten: Farbschema/Schriftart aus Kunden-Logo oder -Präferenzen

**Input:** Anforderungen + fertiger Content vom Content-Agent
**Output:** strukturierte Design-Spezifikation (Komponenten, Reihenfolge,
Farbschema)
**Tools/Zugriff:** Lesezugriff auf Template-Bibliothek, ggf.
Farbextraktion aus Logo-Bild

---

### 3.4 Build-Agent

**Zweck:** Technische Umsetzung — Erst-Erstellung UND spätere
Änderungswünsche, da beides dieselbe Fähigkeit ist (Komponenten
manipulieren). Führt keine eigene Kommunikation mit dem Kunden — bekommt
Aufträge ausschließlich vom Orchestrator/Client-Interface-Agent.

**Aufgaben:**
- Website aus Template-Bibliothek + Design-Spezifikation + Content
  zusammensetzen (Komponenten instanziieren, kein freies Codegen)
- Grundoptimierung (Bildkompression, Ladezeiten)
- Änderungswünsche aus dem Client-Interface-Agent technisch umsetzen und dem
  Betreiber zur Freigabe vorlegen

**Input:** Design-Spezifikation + Content (Erstellung) ODER strukturierte
Änderungsanfrage (Wartung)
**Output:** fertige, deploybare Website (Code/Artefakte)
**Tools/Zugriff:** Template-Bibliothek, Dateisystem/Code-Ausführung, Git

---

### 3.5 QA-&-Compliance-Agent

**Zweck:** Alles, was "prüfen, ob korrekt und rechtssicher" heißt — vor
Go-Live und bei jeder Änderung. Details zu den rechtlichen Anforderungen
siehe Abschnitt 8.1.

**Aufgaben:**
- Funktionale Checks (Links, Formulare, responsives Verhalten)
- Basis-Accessibility-Check (Kontraste, vorhandene Alt-Texte, Tastatur-
  bedienbarkeit) — orientiert an WCAG 2.1 AA
- Rechtstexte: Impressum, Datenschutzerklärung, Cookie-Hinweis
  generieren/prüfen
- Freigabe-Signal (bestanden/nicht bestanden + Begründung) an Orchestrator

**Input:** fertige Website vom Build-Agent
**Output:** QA-Report an Orchestrator
**Tools/Zugriff:** automatisierte Test-Tools (Linkchecker, Lighthouse o. Ä.),
Rechtstext-Vorlagen

---

### 3.6 DevOps-Agent

**Zweck:** Website online und erreichbar halten.

**Aufgaben:**
- Deployment/Hosting-Setup, initiales Ausrollen
- Domain-Registrierung/-Verknüpfung, DNS, SSL-Zertifikate
- Monitoring: Uptime, grundlegende Fehlerüberwachung nach Go-Live

**Input:** freigegebene Website vom QA-Agent
**Output:** Live-URL, Status an Orchestrator
**Tools/Zugriff:** Hosting-API, Domain-Registrar-API, Monitoring-Tool

---

### 3.7 Billing-&-Reporting-Agent

**Zweck:** Kaufmännische Seite — Rechnungen und Statusberichte.

**Aufgaben:**
- Rechnungsstellung (einmalig bei Erstellung, wiederkehrend bei
  Wartungsvertrag/Abo)
- Einfache Erfolgs-Reports an Kunden (z. B. monatlicher Status)
- Interne Reports an dich (Pipeline-Status, offene Rechnungen)

**Input:** Projektstatus vom Orchestrator, ggf. Analytics-Daten
**Output:** Rechnungen, Reports (PDF/E-Mail)
**Tools/Zugriff:** Rechnungs-/Zahlungs-API (z. B. Stripe), E-Mail-Versand,
Analytics-API

---

### 3.8 Template-&-Asset-Bibliothek (kein Agent, geteilte Ressource)

**Zweck:** Kuratierte Komponenten, Branchen-Layouts, Design-Tokens und
Rechtstext-Vorlagen, aus denen Design-, Build- und QA-Agent schöpfen.

**Inhalt (initial manuell kuratiert):**
- 3–5 Branchen-Layout-Sets (siehe Auswahl in 7.3)
- Wiederverwendbare Sections (Hero, Über uns, Leistungen, Team, Kontakt,
  Preistabelle, Testimonials, FAQ)
- Design-Tokens (Farbschemata, Schriftpaare — Schriften lokal gehostet,
  siehe 8.1)
- Rechtstext-Vorlagen (Impressum, Datenschutz, Cookie-Hinweis) nach
  deutschem/EU-Recht
- Komponenten von Grund auf mit ausreichenden Kontrasten und Alt-Text-Feldern
  gebaut (siehe 8.1)

---

## 4. Projekt-Zustandsmaschine

```
LEAD → INTAKE → CONTENT_ERSTELLUNG → DESIGN → KUNDE_FREIGABE_ENTWURF
     → BUILD → QA → BETREIBER_FREIGABE_GOLIVE → DEPLOYMENT → LIVE
     → WARTUNG (Endlosschleife: Änderungswunsch → BUILD → BETREIBER_FREIGABE → LIVE)
```

Jeder Zustand hat: verantwortlichen Agenten, Eingangsbedingung,
Ausgangsbedingung, optionales Freigabe-Gate (Mensch oder Kunde) — siehe 7.4.

---

## 5. Grobes Datenmodell (Skizze für Claude Code)

```json
{
  "project_id": "string",
  "status": "LEAD | INTAKE | ... | WARTUNG",
  "client": {
    "name": "string",
    "branche": "string",
    "kontakt": "string"
  },
  "requirements": { "...vom Client-Interface-Agent erzeugt..." },
  "content_blocks": [ { "component": "string", "text": "string", "images": [] } ],
  "design_spec": { "components": [], "color_scheme": "string" },
  "build_artifact_ref": "string",
  "qa_report": { "passed": "boolean", "issues": [] },
  "deployment": { "url": "string", "domain": "string" },
  "change_requests": [ { "date": "string", "description": "string", "status": "string", "freigegeben_von_betreiber": "boolean" } ]
}
```

Hinweis: Datenmodell von Anfang an so anlegen, dass die Daten mehrerer Kunden
sauber voneinander isoliert sind (kein gemeinsamer Datentopf) — das
nachträglich zu ändern ist der teuerste Umbau in so einem System.

---

## 6. Empfohlene Implementierungsreihenfolge

1. **Template-&-Asset-Bibliothek** von Hand mit den Branchen aus 7.3 befüllen
   (inkl. Rechtstext-Vorlagen und Basis-Barrierefreiheit — Voraussetzung für
   alles Weitere)
2. **Orchestrator-Grundgerüst** mit Zustandsmaschine (Abschnitt 4), zunächst
   mit Stub-Agenten
3. **Client-Interface-Agent** (Intake-Teil zuerst, Sales/Änderungswünsche
   später)
4. **Content-Agent** und **Build-Agent** (Design zunächst manuell durch dich
   erledigen lassen, später automatisieren)
5. **QA-&-Compliance-Agent** — anfangs als manuell abzuhakende Checkliste,
   später automatisiert
6. **DevOps-Agent** — mechanisch, lohnt sich früh zu automatisieren
7. **Billing-&-Reporting-Agent**, erst wenn echte wiederkehrende
   Kundenanfragen beobachtet wurden

---

## 7. Getroffene Entscheidungen zu den Rahmenbedingungen

### 7.1 Agent-Framework
**Claude Agent SDK.** Ist explizit für produktive Multi-Agent-Koordination
gebaut (Session-Persistence, Hook-System, MCP-Anbindung) und passt zum
ohnehin genutzten Claude-Code-Ökosystem.

### 7.2 Hosting & Domain
Ein einziger fester Standard-Stack (nicht kundenwählbar, damit die
Automatisierung funktioniert):
- **Hosting:** Hetzner (deutsches Unternehmen, EU-Rechenzentren)
- **Domain-Registrar:** INWX
- **DNS/SSL:** Cloudflare als vorgeschalteter Layer

### 7.3 Branchen-Templates zum Start
3–5 Branchen, ausgewählt danach, wo eigene Kontakte für erste Kunden
vorhanden sind. Typischer Vorschlag: Handwerk, Gastronomie,
Beratung/Coaching, lokaler Einzelhandel. Praxen/Gesundheit bewusst nicht als
erste Branche (dort gelten oft strengere Anforderungen, siehe 8.1).

### 7.4 Freigabe-Gates
- Angebot/Preis: anfangs kein Zwangs-Gate (macht der Betreiber selbst)
- **Entwurf vor Build: Pflicht**
- **Go-Live: Pflicht**
- Änderungswünsche im Wartungsbetrieb: kleine Textänderungen mit
  Betreiber-Freigabe vor Live-Schaltung, strukturelle Änderungen (neue
  Seite, Layout) zusätzlich mit Kundenbestätigung

### 7.5 Datenspeicherung
- Postgres (EU-Region, z. B. Supabase oder Neon) für Projektstatus/
  strukturierte Daten
- S3-kompatibler Objektspeicher (EU-Region, z. B. Hetzner Object Storage)
  für Bilder/Assets
- Mit jedem eingesetzten Dienstleister, der Kundendaten verarbeitet, wird ein
  Auftragsverarbeitungsvertrag (AVV) abgeschlossen

### 7.6 Content-Pflege-Modell
**Kein Kunden-Self-Service.** Änderungswünsche kommen ausschließlich über den
Client-Interface-Agent herein (Kunde teilt mit, was geändert werden soll),
werden vom Build-Agent umgesetzt und vor Live-Schaltung vom Betreiber
freigegeben. Es gibt kein Bearbeitungs-Dashboard für Kunden.

---

## 8. Rahmenbedingungen & Compliance-Anforderungen

Diese Anforderungen betreffen v. a. die Template-Bibliothek (Abschnitt 3.8)
und den QA-&-Compliance-Agenten (Abschnitt 3.5) und sollten von Anfang an
mitgebaut werden, nicht nachträglich.

### 8.1 Rechtliches (Deutschland/EU)
- **Impressumspflicht:** jede erstellte Website braucht ein korrektes
  Impressum — muss aus den Kundendaten automatisiert generierbar sein
- **DSGVO:** Datenschutzerklärung + Cookie-Consent, sobald Tracking/
  Drittanbieter eingebunden werden. Feste Regel in der Template-Bibliothek:
  **Google Fonts immer lokal hosten**, nie über Google-CDN einbinden
  (bekanntes Abmahnrisiko in Deutschland)
- **BFSG (Barrierefreiheitsstärkungsgesetz):** seit 28.06.2025 in Kraft.
  Kleinstunternehmen (< 10 Mitarbeitende, < 2 Mio. € Jahresumsatz) sind bei
  reinen Dienstleistungs-Websites ausgenommen — trifft auf viele Kunden zu,
  aber nicht automatisch auf alle (z. B. bei Buchungsfunktionen). Empfehlung:
  Komponenten-Bibliothek von Anfang an WCAG-2.1-AA-nah bauen (Kontraste,
  Alt-Texte, Tastaturbedienbarkeit) — einmaliger Mehraufwand pro Template,
  danach bei jeder Website automatisch mit dabei
- Vertraglich klarstellen: generierte Rechtstexte ersetzen keine
  Rechtsberatung, der Kunde verantwortet die Endfassung

### 8.2 Technische Qualität
- Mobile-first (Großteil des Traffics kommt über Smartphones)
- Performance/Ladezeiten im Blick behalten (wirkt sich auf Google-Ranking
  aus) — bei generierten/ausgewählten Bildern immer komprimieren
- SSL obligatorisch, Formular-Spam-Schutz einbauen (z. B. Honeypot)
- Backups/Rollback-Fähigkeit — ergibt sich bei Git-basiertem Build-Agent von
  selbst

### 8.3 SEO & Auffindbarkeit
- Sitemap, robots.txt, strukturierte Daten (`schema.org`, besonders
  `LocalBusiness`-Schema) direkt in die Template-Bibliothek einbauen
- Verknüpfung mit Google-Business-Profil mitdenken — für lokale Kunden oft
  wichtiger als die Website selbst

### 8.4 Analytics
Datenschutzfreundliche Tools bevorzugen (z. B. Plausible, Matomo) statt
Google Analytics — reduziert Cookie-Banner-Komplexität und ist bei deutschen
Kunden ein Verkaufsargument.

### 8.5 Geschäftliches
- Eigentumsfrage vertraglich klären: wem gehören Domain, Code, Inhalte nach
  Vertragsende (Exit-Klausel)
- Reaktionszeiten für Support klar kommunizieren
- Preismodell an den tatsächlichen Automatisierungsgrad koppeln

---

## 9. Auftrag an Claude Code

Bitte auf Basis dieses Dokuments:
1. Grundlegende Projektstruktur anlegen (Ordner je Agent, Orchestrator-Kern)
2. Zustandsmaschine aus Abschnitt 4 als Code-Modell implementieren
3. Datenmodell aus Abschnitt 5 als Schema/Typen umsetzen (mandantenfähig,
   siehe Hinweis in Abschnitt 5)
4. Orchestrator mit Stub-Aufrufen an alle sieben Worker-Agenten aufsetzen
   (noch ohne echte Logik in den Workern)
5. Erste funktionsfähige Version: nur Intake-Teil des Client-Interface-Agent
   + Template-Bibliothek-Zugriff, Rest bleibt Stub
6. Compliance-Anforderungen aus Abschnitt 8.1 (Impressum, lokale Google
   Fonts, Basis-Barrierefreiheit) direkt in die Template-Bibliothek und den
   QA-Agenten einplanen, nicht erst am Ende nachrüsten

---

## 10. Erkenntnisse aus der ersten manuellen Vorlage (Frisörsalon)

Aus dem Bau von `vorlage-friseursalon.html` (erste Branchen-Vorlage der
Template-Bibliothek) lassen sich konkrete Anforderungen für das System
ableiten.

### 10.1 Pflichtfelder pro Kunde
Jede Stelle, die in der Vorlage mit `<!-- ANPASSEN -->` markiert ist,
entspricht genau einem Feld, das der Intake-Teil des Client-Interface-Agenten
später beim Kunden abfragen muss:
- Salonname, Ort/Adresse, Telefon, E-Mail
- Kurzer Einleitungstext/Claim
- Öffnungszeiten je Wochentag
- Leistungen je Kategorie (Schnitt/Farbe/Styling/Pflege) mit Beschreibung
  und Preis
- Team: Name, Rolle, Foto je Mitglied
- Galeriefotos
- Optional: Kundenstimmen (Name + Zitat)
- Rechtliche Basisdaten für das Impressum (Firmenname, Rechtsform,
  vertretungsberechtigte Person, USt-ID falls vorhanden)

**Konsequenz:** Das Datenmodell aus Abschnitt 5 sollte pro Branche ein
eigenes, strukturiertes `requirements`-Unterschema bekommen (hier:
`requirements.friseur`) statt eines generischen Freitextfelds — sonst kann
der Content- und Build-Agent die Felder nicht zuverlässig befüllen.

### 10.2 Was strukturell konstant bleibt (= die eigentliche Vorlage)
Farbsystem, Typografie, Layout-Grid, das Swatch-Signature-Element,
Responsive-Verhalten und die Barrierefreiheits-Basis (sichtbarer
Fokus-Zustand, Kontraste, keine externen Font-CDNs) sind bewusst nicht pro
Kunde veränderbar — das ist der Teil, der die Wiederverwendbarkeit bringt.

### 10.3 Was vor einem echten Go-Live zusätzlich fehlt (nicht durch die
Vorlage lösbar, sondern pro Kunde)
- echte, geprüfte Rechtstexte statt Platzhalter
- echte Fotos statt Platzhalter-Kacheln
- **Offene Entscheidung, die mit dem ersten echten Kunden geklärt werden
  sollte:** reicht ein einfaches Kontaktformular für Terminanfragen, oder
  braucht der Salon eine echte Online-Terminbuchung (Anbindung an ein
  externes Buchungstool)? Das verändert die Kontakt-Sektion technisch und
  sollte nicht spekulativ vorab entschieden werden.
- Bestätigung von Preisen und Öffnungszeiten durch den Kunden selbst
  (Haftungsfrage)

### 10.4 Nächster sinnvoller Schritt
Diese Vorlage 2–3 echten Friseursalons zeigen (aus der Kundenansprache in
Schritt 1 des Vorgehens) und Feedback einholen, **bevor** Automatisierung
mit Claude Code begonnen wird. Das validiert, ob Struktur und
Pflichtfelder aus 10.1 tatsächlich passen.

### 10.5 Erkenntnisse aus dem konkreten Prototyp „Salon Lindenblatt"
(inkl. Deployment)

Aufbauend auf 10.1–10.4 wurde die generische Vorlage zusätzlich einmal mit
konkreten (fiktiven) Daten vollständig durchgebaut und über GitHub Pages
live geschaltet — Repo: `DandyLion22/website-builder-mas`,
Live-Demo: `https://dandylion22.github.io/website-builder-mas/`. Dabei
sind Anforderungen aufgefallen, die im rein generischen Template noch
nicht sichtbar waren:

**Rechtstexte brauchen eigene Seiten, keine Anker-Links.** Sobald aus dem
Platzhalter-Link „Impressum" ein echter Text wird, passt der nicht mehr in
eine Section der Single-Page — es braucht mindestens zwei zusätzliche
HTML-Seiten (`impressum.html`, `datenschutz.html`) mit `<meta
name="robots" content="noindex">`. **Konsequenz:** Der Build-Agent muss pro
Website mehrere Dateien erzeugen können, nicht nur eine einzelne Seite.

**Impressum-Pflichtangaben hängen von der Rechtsform ab.** Ein
Einzelunternehmen braucht andere Pflichtangaben als eine GmbH (z. B.
Handelsregistereintrag, Geschäftsführer). **Konsequenz:** Der Intake-Teil
des Client-Interface-Agenten muss die Rechtsform explizit erfragen, damit
der QA-&-Compliance-Agent den passenden Impressum-Baustein statt eines
einzigen generischen Textes einsetzt.

**Cookie-/CDN-freie Bauweise zahlt sich bei der Datenschutzerklärung aus.**
Weil weder Cookies noch externe Dienste (keine Google Fonts, keine
Analytics) eingebunden sind, bleibt die Datenschutzerklärung kurz und ganz
ohne Cookie-Consent-Baustein. Das bestätigt die Entscheidung aus 7.1/8.1,
lokale Fonts und den Verzicht auf Google Analytics als Standard zu setzen —
nicht nur aus Datenschutz-, sondern auch aus Komplexitätsgründen.

**Strukturierte Daten (`schema.org`) müssen aus echten Intake-Feldern
befüllt werden.** Im generischen Template waren `telephone`, `address` und
`openingHoursSpecification` im JSON-LD-Block leer. **Konsequenz:** Das
Datenmodell aus Abschnitt 5 sollte pro Branche nicht nur Felder für
sichtbaren Text vorsehen, sondern auch für die zugehörigen
schema.org-Properties (z. B. `requirements.friseur.oeffnungszeiten` direkt
in ein `openingHoursSpecification`-Array übersetzbar).

**Formular-Spam-Schutz (Honeypot) fehlte im Template komplett** und musste
beim konkreten Bau erst ergänzt werden, obwohl er in 8.2 bereits gefordert
war. **Konsequenz:** Der Honeypot gehört fest in die
Kontaktformular-Komponente der Template-Bibliothek, nicht als optionaler
Nachtrag pro Kunde.

**`robots.txt` und `sitemap.xml` (gefordert in 8.3) existierten im
Template nicht** — das fällt erst beim tatsächlichen Deployment auf, nicht
beim Betrachten der Seite selbst. **Konsequenz:** Diese beiden Dateien
müssen automatisierter Teil jedes Build-Outputs sein (inkl. korrekter,
domain-spezifischer URLs), nicht manuell nachgetragen.

**Deployment-Vergleich, kostenloser Weg vs. Ziel-Stack.** GitHub Pages
(kostenlos) liefert automatisches SSL und ist in unter zwei Minuten live —
gut geeignet, um den grundsätzlichen Deployment-Ablauf zu lernen. Der
geplante Ziel-Stack (Hetzner + INWX + Cloudflare, siehe 7.2) hat davon
abweichende Schritte (Domain-Kauf, DNS-Einrichtung, Cloudflare als
vorgeschalteter Layer) und muss separat getestet werden, sobald die Konten
aus Phase 1 der To-do-Liste angelegt sind. Zusätzlich: GitHub Pages im
kostenlosen Modus verlangt ein öffentliches Repo — für den späteren
Build-/DevOps-Agenten heißt das, dass Kundencode dort nicht vertraulich
bleiben kann; der produktive Stack (Hetzner) hat dieses Problem nicht.

**Commit-Identität für Automatisierung.** Eine frische Arbeitsumgebung hatte
noch keine Git-Identität konfiguriert. Für den späteren Build-/DevOps-Agenten
relevant: Er braucht eine eigene, feste Commit-Identität (Service-Account),
nicht die des Betreibers.

### 10.6 Nächster sinnvoller Schritt (aktualisiert)
Vor Beginn der MAS-Automatisierung (Abschnitt 9): weitere 1–2
Branchen-Vorlagen nach demselben Muster (generisches Template + ein
konkret durchgebauter Prototyp) bauen, um zu prüfen, welche der obigen
Erkenntnisse branchenübergreifend gelten (vermutlich: Rechtstext-Seiten,
Honeypot, robots.txt/sitemap.xml) und welche friseurspezifisch waren
(z. B. genaue Service-Kategorien).

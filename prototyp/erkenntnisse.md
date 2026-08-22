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

## "Wirkt altmodisch" ist keine konkrete Anweisung

- Rückmeldung "die Seite wirkt wie aus den Zweitausendern, ich brauche
  aufwendigere Grafiken" kam auf, nachdem schon mehrere eigene
  Design-Elemente eingebaut waren. Bei genauerem Hinsehen: die
  Farb-/Typografie-Wahl (gedeckte Salbei/Messing-Palette, Serifen,
  viel Weißraum) ist eigentlich ein aktueller "ruhiger Boutique"-Trend,
  kein 2000er-Look (der eher Verläufe/Glanz-Buttons/Bevel bedeutet hätte).
  → Möglicher Schluss: Bevor auf so ein Feedback hin umgebaut wird, lohnt
  sich eine Rückfrage mit konkreten, vorzeigbaren Optionen statt sofort
  "mehr"/"aufwendiger" zu bauen — sonst wird evtl. in eine Richtung
  gebaut, die das eigentliche Problem nicht trifft oder es sogar
  verschlimmert (z. B. Glanzeffekte hätten tatsächlich veralteter
  gewirkt).
- Konkret angefragt (per Auswahl aus vorgeschlagenen Optionen mit
  Vorschau) und umgesetzt: Bento-Grid für die Galerie (unterschiedlich
  große Kacheln statt uniformem Raster), Textur/Tiefe (Grain-Overlay +
  Glasmorphismus-Panels + erweiterte Ambient-Formen), 3D-Tilt-Hover auf
  Karten (reines CSS/Vanilla-JS, kein WebGL).
  → Möglicher Schluss: Diese drei Techniken sind generisch genug, um
  Teil der Komponenten-Bibliothek zu werden (nicht friseurspezifisch),
  sollten also bei den nächsten Branchen-Prototypen wiederverwendet statt
  neu erfunden werden.
- Für den eigenen Verkaufsprozess relevant: "moderner"/"aufwendiger" als
  Kundenwunsch ist erfahrungsgemäß vage — hier hat sich bewährt, mit 3-4
  konkreten, benannten Stilrichtungen zurückzufragen statt zu raten.

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

## Differenzierung: eigene statt geliehene Design-Elemente

- Versuch, unDraw-Illustrationen automatisiert per URL einzubinden, ist
  gescheitert — die unDraw-Seite rendert die Download-Links per
  JavaScript, es gibt keine dokumentierte, stabil abrufbare Asset-URL.
  → Zufälliger, aber passender Beleg für den vorher diskutierten Punkt:
  fertige Assets von der "üblichen" Anlaufstelle sind weder eigenständig
  noch technisch immer einfach automatisiert einbindbar.
- Stattdessen eine eigene, kleine Inline-SVG-Illustration (Terminkalender)
  von Hand gebaut, die direkt die bestehenden CSS-Variablen
  (`--pine`/`--brass`/`--paper`) referenziert. **Wichtig:** Das geht nur
  mit *Inline*-SVG im HTML-Dokument — ein per `<img>` eingebundenes
  externes `.svg` hat keinen Zugriff auf die CSS-Variablen der Seite und
  müsste seine Farben fest codieren.
  → Möglicher Schluss: Für Branding-konsistente Grafik-Elemente sollte
  die Komponenten-Bibliothek auf Inline-SVG statt Bild-Dateien setzen.
- Scroll-Einblendung und Hover-Effekte bewusst selbst geschrieben
  (IntersectionObserver, reines CSS) statt einer Bibliothek wie AOS —
  spart eine externe Abhängigkeit/Datei, und die bereits bestehende
  `prefers-reduced-motion`-Regel greift automatisch mit, ohne Zusatzcode.
- Für Sichtbarkeit ohne JavaScript wichtig: Die "Einblenden"-Optik wird
  nur aktiv, wenn JS eine Klasse an `<body>` hängt (`js-enabled`). Ohne
  JS bleibt alles regulär sichtbar. Sonst würden Besucher mit
  deaktiviertem JavaScript dauerhaft unsichtbare Inhalte sehen.

## Größere Menge an Design-Elementen auf einmal

- Auf Wunsch bewusst eine ganze Reihe zusätzlicher Elemente in einem
  Durchgang gebaut (Monogramm/Favicon, Stats-Leiste mit Zähl-Animation,
  eigene Kategorie-Icons, Trenner-Ornamente, ambiente Hintergrundformen,
  Anführungszeichen-Ornament, Sterne-Bewertung, Galerie-Bildunterschriften,
  Team-Badges) — alle nach demselben Muster wie die Kalender-Illustration:
  selbst gebaut, Inline statt Datei, bestehende CSS-Variablen
  wiederverwendet.
  → Möglicher Schluss: Eine "Fülle" an Elementen wirkt nur zusammenhängend,
  wenn alle auf dieselbe kleine Formensprache zurückgreifen (dieselben
  Farbvariablen, derselbe Radius, dieselbe Serifenschrift für Zahlen/
  Zitate) — sonst entsteht schnell ein Sammelsurium statt eines Systems.
- Favicon als Inline-SVG-Data-URI umgesetzt statt als Datei — spart einen
  HTTP-Request, kann aber keine CSS-Variablen nutzen (Farben mussten dort
  hart codiert werden, einzige Ausnahme von der "immer var()"-Regel).
- Für Tastaturzugänglichkeit der neuen Hover-Effekte (Galerie-Bildunter-
  schriften) zusätzlich `tabindex="0"` und `:focus-visible` ergänzt, nicht
  nur `:hover` — sonst wäre die neue Optik für Tastaturnutzer:innen
  unsichtbar geblieben.
- Zähl-Animation der Stats-Leiste prüft `prefers-reduced-motion` explizit
  in JavaScript (nicht nur per CSS) und zeigt den Zielwert dann sofort an
  — reine CSS-Transition-Regel hätte hier nicht gereicht, weil der
  Zähleffekt über `requestAnimationFrame`-Textänderungen läuft, nicht über
  eine CSS-Transition.

## Feintuning nach direktem Feedback

- Bento-Grid-Galerie wurde als "zu eng" empfunden, Tilt-Effekt als "zu
  stark". Konkrete Korrektur: Zeilenhöhe von fix 140px auf
  `clamp(180px, 20vw, 260px)` erhöht, Tilt-Winkel von max. 14° auf max. 5°
  reduziert.
  → Möglicher Schluss: Effekt-Stärken (Tilt-Winkel, Kachelgröße o. Ä.)
  sollten in der Komponenten-Bibliothek als benannte, leicht einstellbare
  Werte vorliegen (z. B. `--tilt-max: 5deg`), nicht als Magic Numbers im
  JS/CSS vergraben — sonst ist jede Korrektur eine Sucherei.

## Echte Google-Bewertungen einbinden

**Entscheidung (2026-08-21): API verworfen, manuelle Pflege gewählt.**
Nach Abwägung von Komplexität (Google-Cloud-Account, Billing,
Cache-Regeln) gegen den Nutzen für eine einzelne Salon-Website: zu hoher
Aufwand für zu wenig Gewinn gegenüber "Betreiber trägt neue Bewertungen
gelegentlich von Hand als Text ein". Passt außerdem zu Leitprinzip 6 der
Planung ("MVP zuerst manuell, dann automatisieren") — die Google-Optik
(Logo, Sternfarbe) bleibt als Design-Signal, nur ohne Live-API dahinter.
Automatisierung ist damit nicht für alle Zeit ausgeschlossen, nur aktuell
nicht der richtige Aufwand-Nutzen-Punkt.

- Technisch möglich über die Google Places API (liefert bis zu 5
  Bewertungen je Standort), aber mit Auflagen: Google-Cloud-Account mit
  Zahlungsmethode nötig, Attributionspflicht ("powered by Google"), kein
  dauerhaftes Zwischenspeichern der Texte, und der API-Key darf nicht im
  Frontend offen liegen — Abruf muss server-/build-seitig passieren und
  als statischer Inhalt ausgeliefert werden (gleiches Muster wie bei den
  selbst gehosteten Bildern/Fonts).
  → Möglicher Schluss: Bewertungs-Anbindung gehört als eigener, kleiner
  "Datenquellen"-Baustein in den Build-Agenten (periodischer Abruf +
  Re-Deploy), nicht als Live-Client-Request bei jedem Seitenaufruf.
- Für den Prototyp (fiktive Firma, kein echtes Google-Profil) stattdessen
  nur die **Optik** im Google-Bewertungs-Stil gebaut (Avatar, Google-
  Sternfarbe #FBBC04, Google-Logo, relative Zeitangabe), mit Mock-Daten
  und klarer Kennzeichnung im HTML-Kommentar. Layout ist so vorbereitet,
  dass später nur die Dateninhalte ausgetauscht werden müssten.
  → Möglicher Schluss: "Optik jetzt vorbereiten, echte Anbindung später
  nachrüsten" ist ein brauchbares Muster für alle Fälle, wo eine
  Integration von echten (noch nicht vorhandenen) Kundendaten abhängt.

## Echten Instagram-Feed einbinden

**Entscheidung (2026-08-21): API verworfen, manuelle Pflege gewählt.**
Instagram/Meta Graph API wurde als unnötig komplex eingeschätzt
(Facebook-Seiten-Verknüpfung, App-Review, Token läuft alle 60 Tage ab) —
noch mehr als bei Google. Stattdessen liefert der Salon gelegentlich
Fotos (z. B. per Handy-Export), die von Hand als lokale Dateien
ausgetauscht werden, genau wie die Galerie-Fotos. Kein API-Key, kein
Token-Handling, kein DSGVO-Thema für diese Funktion.

- Gleiches Muster wie bei Google-Bewertungen: Instagram/Meta Graph API
  braucht einen echten Business-/Creator-Account, Verknüpfung mit einer
  Facebook-Seite und Token-Handling, das nicht im Frontend liegen darf.
  Fertige Embed-Widgets (SnapWidget u. Ä.) wären einfacher, laden aber bei
  jedem Seitenaufruf ein Drittanbieter-Script nach — Konflikt mit der
  bestehenden "keine externen Requests"-Linie (siehe Fonts/Bilder).
  → Möglicher Schluss: Auch hier serverseitiger/periodischer Abruf +
  selbst gehostete Auslieferung statt Live-Embed, sobald ein echter
  Kunden-Account existiert.
- Wichtig war hier zusätzlich, eine bereits getroffene Design-Entscheidung
  nicht versehentlich zu überschreiben: Das Swatch-Panel im Hero ist laut
  Planungsdatei (Abschnitt 10.2) bewusst branchen-/kundenübergreifend
  konstant. Der ursprüngliche Wunsch zielte optisch auf genau diesen
  Bereich — stattdessen wurde eine neue, eigenständige Section gebaut.
  → Möglicher Schluss: Bevor ein neuer Wunsch in ein bestehendes
  Signature-Element eingebaut wird, lohnt sich ein kurzer Abgleich mit
  bereits dokumentierten "das bleibt konstant"-Entscheidungen.
- Mock-Raster nutzt bewusst die bereits vorhandenen, lokal gehosteten
  Fotos aus der Galerie wieder statt neuer Downloads — vermeidet
  zusätzliche externe Requests und Lizenzfragen für eine Funktion, die
  ohnehin nur Platzhalter ist.

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

## Bilder statt Platzhalter

- Test: Platzhalter-Kacheln (Team, Galerie) durch echte Stock-Fotos
  ersetzt, restliches Design (Farben, Typografie, Swatch-Signature-Element
  im Hero) bewusst unverändert gelassen — Annahme war, dass fehlende echte
  Fotos der größere "wirkt unfertig"-Faktor sind als CSS-Komplexität.
  Bewertung nach Betrachtung: bestätigt sich, wirkt deutlich fertiger,
  ohne dass Layout/Struktur angefasst werden mussten.
- Bilder wurden **lokal heruntergeladen und eingebunden**
  (`prototyp/assets/img/`), nicht extern von Pexels verlinkt — aus
  demselben Grund wie bei den Fonts (7.1/8.1): Hotlinking würde bei jedem
  Seitenaufruf eine Anfrage an einen Drittanbieter auslösen.
  → Möglicher Schluss: Die Bild-Komponente der Bibliothek sollte
  grundsätzlich nur selbst gehostete Bilder zulassen, kein
  Drittanbieter-Hotlinking.
- Bildquelle/Lizenz wurde in `assets/img/CREDITS.md` dokumentiert (Pexels,
  lizenzfrei, aber Foto-ID pro Datei nachvollziehbar gehalten).
  → Möglicher Schluss: Ein Credits-/Lizenznachweis pro Website könnte
  sich lohnen, sobald mit echten Kundenfotos oder bezahlten Stock-Lizenzen
  gearbeitet wird (Nachweispflicht bei manchen Lizenzen).
- Bilder wurden bereits komprimiert/verkleinert heruntergeladen (Team-Fotos
  ~600px, Galerie ~900px, 28–208 KB pro Datei) statt Originalauflösung.
  → Bestätigt die Anforderung aus 8.2 (Bildkompression), aber zeigt auch:
  die richtige Zielgröße hängt vom Anzeigekontext ab (Kachel vs. große
  Hero-Fläche) — der Build-Agent müsste das je Komponente unterschiedlich
  handhaben, nicht mit einer einzigen Kompressionsregel für alle Bilder.

## Modul-Katalog (erste Kategorisierung für Kunden-Konfiguration)

Status: Erster Versuch, die Bausteine der Website in Kategorien zu
sortieren, aus denen ein Kunde später auswählen könnte ("Baukasten"-
Gedanke, damit er sich seine Website aus fertigen Modulen
zusammenstellt statt alles einzeln zu verhandeln). Basiert auf dem, was
am Salon-Lindenblatt-Prototyp bereits gebaut wurde, plus offensichtlichen
Lücken. Gehört inhaltlich zu Abschnitt 3.8 der Planungsdatei
(Template-&-Asset-Bibliothek), ist dort aber noch nicht eingearbeitet,
da diese Kategorisierung selbst noch ein Entwurf ist und erst an
weiteren Branchen-Prototypen geprüft werden sollte, bevor sie als
verbindliche Modul-Liste gilt.

### A. Immer dabei — keine Kundenauswahl, sondern Pflicht-Checkliste
- Header/Navigation (inkl. mobilem Menü)
- Footer mit Impressum-/Datenschutz-Links
- Rechtstexte: Impressum, Datenschutzerklärung (eigene Unterseiten)
- SEO-Grundausstattung: `robots.txt`, `sitemap.xml`, `schema.org`-Daten,
  Meta-/OG-Tags
- Formular-Spam-Schutz (Honeypot), sobald irgendein Formular existiert

### B. Kern-Inhalts-Module — wählbar, meist mehrere gleichzeitig
- Hero/Einstieg (inkl. Signature-Element — Farben/Typografie/Grid
  bleiben laut 10.2 konstant, der *Inhalt* drumherum ist das Modul)
- Leistungen/Angebot (Kategorien + Preise)
- Team (Personen mit Foto, Rolle, "seit Jahr")
- Galerie (Fotos — im Prototyp als Bento-Grid)
- Zahlen-/Stats-Leiste (Vertrauens-Kennzahlen)
- Kontakt & Öffnungszeiten (Adresse, Telefon, Zeiten)

### C. Social-Proof-Module — wählbar
- Bewertungen (im Prototyp im Google-Stil; Datenquelle: manuell gepflegt,
  keine Live-API — siehe Entscheidung oben)
- Social-Media-Raster (im Prototyp Instagram; ebenfalls manuell gepflegt)
- *Noch nicht gebaut, aber naheliegend:* Marken-/Partner-Logo-Leiste —
  beim Wettbewerber `haarstudio-light.de` gesehen (Paul Mitchell u. Ä.
  als Vertrauenssignal)

### D. Kontaktaufnahme-/Conversion-Module — wählbar, sehr unterschiedlicher Aufwand
- Einfaches Kontaktformular (aktuell im Prototyp, mit Honeypot)
- Echte Online-Terminbuchung (externes Buchungstool wie Salonized/Fresha
  eingebettet) — die offene Entscheidung aus Abschnitt 10.3 der Planung.
  Technisch ein Bruch mit der "kein Drittanbieter-Embed"-Linie, weil
  echte Buchungssysteme praktisch immer über ein fremdes iframe/Widget
  laufen — anders als bei Bewertungen/Social-Media lässt sich das nicht
  einfach "manuell nachbauen".
- *Noch nicht gebaut:* Anfahrtskarte/Karten-Einbettung — hat dasselbe
  Drittanbieter-Problem (Google Maps lädt extern nach)

### E. Betriebs-Modell pro Modul (wichtig für spätere Angebotskalkulation)
Jedes Modul mit externer Datenquelle hat im Kern drei mögliche
Betriebsarten, die sich im Preis/Aufwand stark unterscheiden:
1. **Statisch/manuell gepflegt** (aktuell: Bewertungen, Social-Media) —
   technisch kein Zusatzaufwand, aber laufender Pflegeaufwand beim
   Betreiber
2. **Automatisiert über offizielle API, server-/build-seitig** (bewusst
   verworfen für Bewertungen/Instagram, siehe oben) — einmaliger
   Einrichtungsaufwand plus laufende Wartung (Token-Erneuerung usw.)
3. **Eingebettetes Drittanbieter-Widget** (z. B. echte Terminbuchung,
   Kartenembed) — am wenigsten Aufwand für den Betreiber, aber Kompromiss
   bei der "keine externen Requests"-Linie; muss im Einzelfall abgewogen
   werden (ggf. Cookie-Hinweis je nach Anbieter nötig)

→ Möglicher Schluss: Ein Kunden-Konfigurator müsste nicht nur "welche
Module", sondern auch "mit welchem Betriebsmodell" abfragen — das
beeinflusst Preis, Datenschutzerklärung und Wartungsaufwand direkt.

## Offene Fragen, noch nicht entschieden

- Welche der obigen Punkte gelten branchenübergreifend (vermutlich:
  Rechtstext-Seiten, Honeypot, robots.txt/sitemap.xml) und welche waren
  friseurspezifisch (z. B. genaue Service-Kategorien)? Erst nach 1–2
  weiteren Branchen-Prototypen zu beantworten.
- Ob echte Domain/DNS-Erkenntnisse (Ziel-Stack) grundsätzlich andere
  Learnings bringen als der GitHub-Pages-Testlauf.

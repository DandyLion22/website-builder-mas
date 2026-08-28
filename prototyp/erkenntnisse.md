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
  - *Ausbaustufe:* Dauer je Leistung zusätzlich zum Preis (wichtig für
    Terminplanung, fehlt im Prototyp bisher)
  - *Ausbaustufe:* "Online buchen"-Button direkt neben jeder einzelnen
    Leistung, sobald es ein echtes Buchungstool gibt (Modul D)
- Team (Personen mit Foto, Rolle, "seit Jahr")
  - *Ausbaustufe:* eigene Profilseite je Person (Spezialisierung, eigener
    Buchungslink) — lohnt sich erst ab größeren Teams
  - *Ausbaustufe:* Social-Media-Link pro Teammitglied
- Galerie (Fotos — im Prototyp als Bento-Grid)
  - *Ausbaustufe:* Vorher/Nachher-Vergleichsslider — in der Beauty-Branche
    praktisch Standard, passt zu den "Ergebnis"-Fotos, die schon jetzt in
    der Galerie sind
- Zahlen-/Stats-Leiste (Vertrauens-Kennzahlen)
- Kontakt & Öffnungszeiten (Adresse, Telefon, Zeiten)
  - *Ausbaustufe:* Anfahrtsbeschreibung als Text (ÖPNV/Parkplätze) statt
    Karten-Embed — vermeidet das Drittanbieter-Problem, das eine echte
    Google-Maps-Karte hätte (siehe Betriebsmodell 3 unten)
  - *Ausbaustufe, nur für Filialbetriebe:* mehrere Standorte mit
    Standort-Auswahl

### C. Social-Proof-Module — wählbar
- Bewertungen (im Prototyp im Google-Stil; Datenquelle: manuell gepflegt,
  keine Live-API — siehe Entscheidung oben)
  - *Ausbaustufe:* mehrere Quellen parallel (Google + Facebook)
  - *Ausbaustufe:* sichtbare Antwort des Betreibers auf eine Bewertung
    (zeigt Reaktionsfähigkeit, ohne echte API auszukommen — einfach als
    weiteres Textfeld in der manuell gepflegten Karte)
- Social-Media-Raster (im Prototyp Instagram; ebenfalls manuell gepflegt)
  - *Ausbaustufe:* weitere Plattform (TikTok wird für diese Zielgruppe
    zunehmend wichtiger als Instagram)
- *Noch nicht gebaut, aber naheliegend:* Marken-/Partner-Logo-Leiste —
  beim Wettbewerber `haarstudio-light.de` gesehen (Paul Mitchell u. Ä.
  als Vertrauenssignal)

### D. Kontaktaufnahme-/Conversion-Module — wählbar, sehr unterschiedlicher Aufwand
- Einfaches Kontaktformular (aktuell im Prototyp, mit Honeypot)
  - *Ausbaustufe:* Datei-Upload (z. B. Referenzfoto der Wunschfrisur)
  - *Ausbaustufe:* mehrstufiges Formular (erst Leistung wählen, dann
    Zeitwunsch, dann Kontaktdaten) statt einem Freitextfeld
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

### F. Weitere Module mit belegter Nachfrage (noch nicht gebaut)
- **Gutschein-Verkauf** — bei Friseuren/Beauty praktisch Standard, vor
  allem saisonal (Weihnachten, Muttertag). Einfachste Stufe: Kontakt-
  formular "Gutschein anfragen" (Betriebsmodell 1). Aufwendigste Stufe:
  echter Online-Verkauf mit Zahlungsanbieter — gehört dann eigentlich zum
  Billing-&-Reporting-Agenten aus Abschnitt 3.7 der Planung, nicht zur
  reinen Website.
- **FAQ-Sektion** — auf Dienstleister-Websites praktisch universell,
  senkt Rückfragen vor dem ersten Besuch (Parken, Zahlungsarten,
  Stornobedingungen).
- **Click-to-Call-/WhatsApp-Button** — technisch nur ein `tel:`- bzw.
  `wa.me`-Link, also Betriebsmodell 1 (kein Zusatzaufwand), aber hohe
  Wirkung gerade bei mobilen Besucher:innen.
- **Ankündigungsleiste** — schmaler Hinweisstreifen über dem Header für
  kurzfristige Meldungen ("heute krankheitsbedingt geschlossen",
  Betriebsferien). Passt zum bereits etablierten "manuell pflegen"-Modell
  und ist technisch trivial.
- **Karriere/Ausbildung** — Hinweis auf offene Stellen/Ausbildungsplätze.
  Angesichts Fachkräftemangel im Handwerk real nachgefragt, passt auch
  zum bereits vorhandenen "Auszubildende"-Profil im Team.
- **Mehrsprachigkeit** — war in der Planung (3.2, Content-Agent) schon als
  Aufgabe vorgesehen, aber nie als sichtbares UI-Modul (Sprachumschalter)
  gefasst. Nur dort sinnvoll, wo tatsächlich Bedarf besteht
  (grenznah/touristisch), nicht als Standardmodul für jede Website.

→ Möglicher Schluss: Bei den nächsten Branchen-Prototypen prüfen, welche
dieser Module branchenspezifisch sind (Gutschein/Vorher-Nachher eher
Beauty-typisch) und welche generisch für alle Branchen aus 7.3 gelten
(FAQ, Click-to-Call, Ankündigungsleiste, Karriere wirken universeller).

## Umsetzungsrunde: Module gebaut (2026-08-22)

**Gebaut:** Ankündigungsleiste (dismissible), WhatsApp-Kontaktbutton,
Dauer je Leistung, Partner-/Marken-Leiste (fiktive Namen), Social-Media-
Link pro Teammitglied, Karriere-/Ausbildungs-Strip, TikTok-Ergänzung,
FAQ-Sektion (natives `<details>`, kein JS nötig), Gutschein-Panel
(Anfrage-Stufe), zweite Bewertungsquelle (Facebook) + sichtbare
Betreiber-Antwort, Anfahrtsbeschreibung als Text, Datei-Upload im
Kontaktformular.

**Bewusst nicht gebaut**, mit Begründung aus dem eigenen Katalog:
- Team-Profilseiten — "lohnt sich erst ab größeren Teams" (Salon
  Lindenblatt hat 3 Personen)
- Mehrere Standorte — nur für Filialbetriebe relevant
- Echte Terminbuchung / Karten-Embed — weiterhin offene Entscheidung,
  bräuchte einen echten Drittanbieter-Entscheid und würde die
  "kein Drittanbieter-Embed"-Linie brechen; nicht einfach "mitgebaut"
- Mehrstufiges Kontaktformular — Scope-Sprung; der Datei-Upload deckt
  den naheliegendsten Einzelfall (Referenzfoto) schon ab
- Vorher/Nachher-Slider — fehlende echte, gepaarte Vorher/Nachher-Fotos;
  die vorhandenen Stock-Fotos zeigen unterschiedliche Personen, ein Mock
  hier wäre inhaltlich irreführend statt nur illustrativ
- Mehrsprachigkeit — laut eigenem Katalog nur bei echtem Bedarf sinnvoll,
  für Kaiserslautern nicht begründet

→ Möglicher Schluss: "Alle fehlenden Module bauen" ist in der Praxis
"alle bauen, die zum konkreten Kunden passen und ohne offene
Fremdentscheidung auskommen" — der Katalog selbst liefert schon die
Kriterien dafür (Kategorie E: Betriebsmodell; Team-/Standort-Module:
Unternehmensgröße als Schwelle).

## Nachtrag: Karten-Embed doch gebaut — für Vorführzwecke

Direkt im Anschluss kam die Klarstellung: Das "passt nicht zu diesem
Kunden"-Argument gilt nicht, wenn der Zweck nicht der reale
Salon-Lindenblatt-Betrieb ist, sondern eine **Vorführung gegenüber
zukünftigen Kunden** — dann will man möglichst viele Module einmal
gebaut und vorzeigbar haben, unabhängig davon, ob dieser eine Prototyp
sie "braucht".

- Karten-Embed umgesetzt, aber mit der **Zwei-Klick-Lösung**: Die Karte
  lädt nicht automatisch, sondern erst nach Klick auf "Karte laden" —
  das ist die in Deutschland gängige, DSGVO-konforme Lösung für genau
  dieses Drittanbieter-Problem. Passende Klausel in `datenschutz.html`
  ergänzt (Rechtsgrundlage: Einwilligung durch den Klick).
  → Möglicher Schluss: Betriebsmodell 3 (Drittanbieter-Widget) aus
  Kategorie E lässt sich also doch mit vertretbarem Aufwand
  DSGVO-konform bauen, wenn man das Zwei-Klick-Muster als Standard für
  alle Drittanbieter-Embeds in der Komponenten-Bibliothek festlegt
  (gilt später vermutlich auch für eine echte Terminbuchung).
- Wichtige Unterscheidung für die Planung: **"Baut das der Kunde in
  Produktion?"** und **"Zeige ich das als Verkaufsdemo?"** sind zwei
  verschiedene Fragen mit unterschiedlichen Antworten. Ein
  Demo-/Vorführ-Modus der Website-Vorlagen (alle Module einmal aktiv,
  losgelöst vom Bedarf eines einzelnen Kunden) könnte sich lohnen, um
  im Verkaufsgespräch zu zeigen, was grundsätzlich möglich ist.

## Vier weitere Demo-Module gebaut (2026-08-22)

Konsequent im "Vorführ-Modus" weitergebaut: Team-Profilseiten,
Vorher/Nachher-Regler, zweiter Standort, Sprachumschalter. Alle rein zu
Demozwecken, keine echten Anforderungen für Salon Lindenblatt.

- **Vorher/Nachher-Regler**: Ehrlichkeits-Kompromiss, weil es keine
  echten gepaarten Fotos gibt — dasselbe Foto wird zweimal gezeigt
  (entsättigt vs. Original) statt zwei verschiedener Personen als
  "Ergebnis" auszugeben. → Möglicher Schluss: Bei Demo-Inhalten ist die
  Grenze "zeigt die Mechanik" vs. "behauptet ein falsches Ergebnis"
  wichtiger als die Grenze "Mock-Daten ja/nein" — Mock-Daten sind okay,
  irreführende Mock-Daten nicht.
- **Zweiter Standort**: Karten-Logik musste dafür von "eine feste ID"
  auf "beliebig viele, datengetrieben über `data-map-query`"
  umgebaut werden. → Möglicher Schluss: Sobald ein Muster zweimal
  vorkommt, lohnt sich die generische Version sofort — nicht erst beim
  dritten Mal.
- **Sprachumschalter**: Bewusst nur Nav/Hero/Section-Überschriften/
  Stats/CTAs übersetzt, lange Inhalte (Leistungs-Details, Bewertungen,
  FAQ-Antworten, Rechtstexte) bleiben deutsch mit sichtbarem Hinweis.
  Rechtstext-Links (Impressum/Datenschutz) bewusst NICHT übersetzt, da
  es keine englischen Rechtstext-Seiten gibt — ein übersetzter Link
  hätte etwas Nichtexistierendes vorgetäuscht. → Möglicher Schluss: Eine
  „echte" Mehrsprachigkeit ist in Wahrheit ein Content-Agent-Projekt
  (jeder Text braucht eine geprüfte Übersetzung), kein reines
  Frontend-Feature — das UI-Umschalten ist der leichte Teil.
- **Team-Profilseiten**: technisch unproblematisch, aber bestätigt die
  ursprüngliche Einschätzung aus dem Modul-Katalog — für 3 Personen ist
  der Mehrwert gegenüber der bestehenden Team-Section gering, wird aber
  bei größeren Teams schnell wertvoller (mehr Platz für Spezialisierung,
  eigener Buchungslink pro Person).

**Update:** Die bewusste Teilübersetzung beim Sprachumschalter wurde auf
Nutzer-Feedback hin ("es fehlen noch einige Schriftzüge") zur
Vollübersetzung ausgebaut — alle sichtbaren Texte sind jetzt zweisprachig,
nur aria-labels/Alt-Texte/Eigennamen/Meta-Tags bleiben deutsch. Zusätzlich
ein Formatierungs-Bug behoben: das Instagram-Icon in den Team-Karten hatte
keine CSS-Größenangabe und wurde dadurch überdimensioniert dargestellt.
→ Möglicher Schluss: Bei jedem neu hinzugefügten Icon/Link-Element sofort
prüfen, ob eine CSS-Regel die Größe tatsächlich greift — ein vergessener
Selektor fällt optisch sofort auf, aber im Code-Review leicht zu übersehen.

## Online-Buchungsstrecke statt Fresha-Embed

**Entscheidung:** Fresha (oder jedes andere echte Buchungstool) lässt
sich nur einbetten, wenn ein echtes, registriertes Geschäftskonto dort
existiert. Für die fiktive Salon Lindenblatt gibt es das nicht — ein
iframe-Embed hätte nur einen Fehler oder eine leere Seite gezeigt.
Stattdessen eine vollständig selbst gebaute, 5-stufige Buchungsstrecke
(Leistung → Mitarbeiter:in → Termin → Kontakt → Zusammenfassung).

- Der letzte Schritt öffnet einen vorausgefüllten `mailto:`-Entwurf statt
  eine vorgetäuschte "Anfrage erfolgreich gesendet"-Meldung zu zeigen —
  es gibt keinen Server, der etwas speichern könnte, und das sollte auch
  so kommuniziert werden. → Möglicher Schluss: Bei jedem Formular ohne
  echtes Backend ehrlich sagen, was technisch tatsächlich passiert
  (E-Mail-Entwurf öffnen), nicht so tun, als sei Daten irgendwo
  angekommen.
- Termin-Datumsauswahl wird dynamisch generiert (nächste 6 Öffnungstage
  ab heute, Montag/Sonntag übersprungen) statt fest codierter Daten —
  damit die Demo nicht in ein paar Wochen mit sichtbar veralteten Daten
  dasteht.
  → Möglicher Schluss: Jedes Datum, das in einer Demo auftaucht, sollte
  relativ zum Aufrufzeitpunkt berechnet werden, nicht hart codiert sein.
- Haupt-CTAs ("Termin anfragen") zeigen jetzt auf die Buchungsstrecke
  statt auf das einfache Kontaktformular — beide Kanäle bleiben
  nebeneinander bestehen (Buchungsstrecke für konkrete Termine, Formular
  für allgemeine Anfragen), genau die zwei Ausbaustufen aus Modul-
  Kategorie D im Katalog.

## Fresha-Kosten und konkreter Ablauf recherchiert

**Preise (fresha.com/pricing, EUR, netto zzgl. 19 % USt.):** Independent
12,95 €/Monat (1 Person), Team 8,95 €/Monat **pro Teammitglied**. Für
einen 3-Personen-Salon wie Salon Lindenblatt: 3 × 8,95 € ≈ 27 € netto
(~32 €/Monat brutto, ~380 €/Jahr) — plus optional 1,29 % + 0,20 € pro
Kartenzahlung, falls über Fresha abgewickelt. Die "Marketplace New
Client Fee" (~20 % vom ersten Umsatz laut Branchenberichten) fällt laut
Fresha **nicht** an, wenn über den eigenen Website-Button gebucht wird
— nur wenn ein Neukunde zuerst über Freshas eigene Marketplace-App auf
den Salon aufmerksam wird.

**Entscheidung:** Kosten werden an den Kunden weitergereicht (passt zum
Wartungsvertrag-Modell aus 7.4), kein Eigenbau vorerst — ein
selbst gehostetes Tool wie Cal.diy wäre zwar lizenzkostenfrei, aber
funktional schwächer für Salons (kein fertiger Personal-/Leistungs-
Katalog) und würde Betrieb/Wartung ins eigene Geschäftsmodell ziehen.
Lohnt sich erst bei genug Kunden, dass die Summe der Fresha-Gebühren das
rechtfertigt (vgl. Leitprinzip 6, "erst manuell/zugekauft, dann
automatisieren/eigenbauen").

**Konkreter Ablauf laut Fresha-Hilfe-Center:** Der *Kunde* (Salon)
braucht ein eigenes Fresha-Konto (nicht die Agentur) — sonst hängen
Kundendaten am Website-Bauer statt am Salon, problematisch bei Wechsel/
Kündigung. Ablauf: Salon legt Konto an → pflegt Leistungen/Preise/
Personal/Öffnungszeiten in Fresha ein → muss das Profil auf Freshas
Marketplace listen (Voraussetzung für Buchungslinks) → generiert über
"Online Booking → Link Builder" einen Buchungslink/Button → dieser wird
per Copy-paste in die Website eingebettet (kein komplexes API-Setup).

**Offener Punkt für die MAS-Planung:** Das bedeutet **doppelte
Datenpflege** — Leistungen/Preise stehen dann sowohl auf der statischen
Website als auch in Fresha. Entweder wird das in Kauf genommen, oder
später per Fresha-API automatisiert synchronisiert (Aufgabe für einen
späteren Build-/Content-Agenten, nicht jetzt).
→ Möglicher Schluss: Sobald ein Drittanbieter-Tool (Fresha, aber auch
Google/Instagram vorher) echte Geschäftsdaten braucht, entsteht
zwangsläufig eine zweite Datenquelle neben der Website selbst — das ist
ein wiederkehrendes Muster, kein Einzelfall, und sollte im Datenmodell
(Abschnitt 5 der Planung) irgendwann mitgedacht werden.

## Echter Fresha-Testaccount eingebunden

Der Betreiber hat selbst (mit eigenen Daten) einen 7-Tage-Fresha-
Testaccount samt Demo-Unternehmen angelegt und den über "Online Booking
→ Link Builder → Link to services" erzeugten Buchungslink
bereitgestellt. Der Mock-Button samt Vorschau-Overlay wurde durch einen
echten Link ersetzt (öffnet in neuem Tab), totes Overlay-Markup/CSS/JS
entfernt. Live-Check: sowohl die Website als auch der Fresha-Link
antworten mit HTTP 200.

- Bestätigt den in der Recherche gefundenen Ablauf 1:1 in der Praxis:
  Konto anlegen → Grunddaten pflegen → Marketplace-Listing aktivieren →
  Link Builder → Link kopieren → auf der Website verlinken. Kein
  API-Key, kein OAuth, keine komplexe Integration nötig — reiner Link.
  → Möglicher Schluss: Für den späteren Build-Agenten ist die
  Fresha-Anbindung ein reiner "Link einfügen"-Schritt, kein
  Entwicklungsaufwand — die eigentliche Arbeit liegt beim Kunden
  (Kontoeinrichtung bei Fresha), nicht bei der Website selbst.
- **Befristung im Hinterkopf behalten:** Der Link funktioniert nur für
  die Dauer des Testaccounts (7 Tage). Danach vermutlich Fresha-
  Fehlerseite. Muss entweder erneuert oder zurück auf die reine
  Vorschau-Variante gebaut werden — Erinnerung steht auch als
  Code-Kommentar direkt im HTML.

## Entscheidung: eigene Buchungsstrecke wieder entfernt

Kurz nach der Fresha-Einbindung kam die Rückmeldung, die zuvor gebaute
selbst gebaute Mehrschritt-Buchungsstrecke (5 Schritte, mailto-Fallback,
siehe oben) doch nicht anzubieten: **Ohne echtes Backend lassen sich
Terminabsage und -bestätigung nicht verlässlich lösen**, und genau das
sollte Kunden nicht zugemutet werden. Komplett entfernt (Markup, CSS,
JS). Online-Terminbuchung existiert jetzt ausschließlich über den
echten Fresha-Link, klar als **optionales Zusatzmodul** formuliert, das
der Kunde dazubuchen kann — nicht als Standard-Bestandteil jeder
Website.

→ Möglicher Schluss: Das bestätigt rückblickend eine Einschätzung von
ganz früh im Modul-Katalog (Kategorie D): Ein selbst gebautes
Buchungssystem ist nicht einfach "die aufwendigere Variante" des
Kontaktformulars, sondern eine andere Risikoklasse — ein Formular, das
nicht ankommt, ist ärgerlich, ein Termin, der nicht storniert werden
kann, kostet den Kunden echtes Geld/Vertrauen. Für die
Komponenten-Bibliothek heißt das: Echte Terminbuchung sollte generell
nur über ein geprüftes Drittanbieter-Tool angeboten werden, nie als
Eigenbau-Feature — unabhängig davon, wie gut die Demo-Version aussieht.

## Feinere Bewegung nach externem Vorbild (notthoff.de)

Auslöser war eine reale Agentur-Website (notthoff.de, Münster) mit
sichtbar mehr Bewegung/Übergängen als bei uns, aber ohne aufdringlich
zu wirken. Wichtige Einordnung vorab: notthoff ist selbst eine Design-
Agentur — deren eigene Website hat vermutlich unbegrenztes Budget für
eine einzige Seite, ganz anders als eine Vorlage, die für viele Kunden
zum Festpreis wiederverwendet werden muss. Direkt vergleichen hinkt
also etwas, die Prinzipien lassen sich aber trotzdem übernehmen.

Vier gewünschte Bewegungsarten abgefragt, drei vollständig umgesetzt:

- **Gestaffelte Eintritts-Animationen:** `.reveal`-Elemente bekommen
  jetzt einen `--stagger`-Index (Position unter Geschwister-Elementen)
  und verzögern sich gegenseitig leicht (`transition-delay`), plus eine
  weichere Kurve (`cubic-bezier(.16,1,.3,1)` statt linearem `ease`).
- **Bild-/Hover-Feinheiten:** Galerie- und Team-Fotos bekommen jetzt
  denselben dezenten Hover-Zoom, den das Instagram-Raster schon hatte —
  vorher inkonsistent, jetzt einheitlich.
- **Echte Seitenübergänge:** Sanftes Aus-/Einblenden beim Navigieren
  zwischen allen sechs Seiten (Klick auf interne Links wird abgefangen,
  kurze Verzögerung, dann Navigation). Nutzt dasselbe
  Progressive-Enhancement-Muster wie die Reveal-Animationen: ohne JS
  immer sofort sichtbar, kein Risiko einer dauerhaft unsichtbaren Seite.
- **Nebenbei gefunden:** `scroll-margin-top` fehlte auf den
  Sections — Anker-Sprünge (Nav-Klicks) haben Inhalte teilweise unter
  dem fixierten Header versteckt. Kleiner, aber echter Bugfix.

**Bewusst NICHT umgesetzt:** volles Inertia-/Smooth-Scrolling
(Lenis-artig, jeder Mausrad-Tick wird gedämpft). Grund: Technisch
deutlich aufwendiger, robust selbst zu bauen (virtuelle Scroll-Position,
Transform-basierter Content-Wrapper), und ein echtes
Barrierefreiheits-Risiko (kann mit Tastatur-Navigation und
Screenreadern kollidieren). Stattdessen nur die schon vorhandene
Anker-Sprung-Mechanik (`scroll-behavior:smooth`) sauber gemacht.
→ Möglicher Schluss: "Wirkt hochwertiger" lässt sich oft schon mit
gezielten, risikoarmen Details erreichen (Staffelung, Kurven, Hover-
Feinschliff) — die auffälligste/teuerste Technik (Scroll-Hijacking)
ist nicht zwingend der Hebel mit dem besten Aufwand-Nutzen-Verhältnis.

## Strukturelle statt dekorative Erkennungsmerkmale

Nächster Schritt nach der Bewegungs-Feinjustierung: Wunsch nach etwas,
das "komplett hervorstechen lässt". Wichtige Unterscheidung, die dabei
getroffen wurde: nach Bento-Grid/Glas/Tilt/Staffelung ist "noch ein
Effekt mehr" nicht mehr der wirksamste Hebel — eher ein **strukturelles
Merkmal**, das eine Seite auch ganz ohne Animation als "eine von uns"
erkennbar macht. Vier konkrete Optionen mit Vorschau zur Auswahl
gestellt (Duotone-Fotoveredelung, Icon-System, Editorial-Layout,
Signature-Mikrointeraktion), drei davon gewählt und umgesetzt:

- **Icon-System vervollständigt statt nur punktuell:** Stats-Karten,
  Gutschein-Panel und Karriere-Strip hatten bisher keine oder nur
  abstrakte Icons (Farbbalken). Menü-/Schließen-Symbole liefen bisher
  über Text-Zeichen (☰/×) statt echter Icons — Inkonsistenz, die erst
  auffiel, als bewusst nach einem "System" statt Einzelstücken gefragt
  wurde. → Möglicher Schluss: Ein Icon-"System" bedeutet nicht nur
  gleiche Optik bei den vorhandenen Icons, sondern auch: an *jeder*
  Stelle, wo eigentlich eines hingehört, tatsächlich eines zu setzen.
- **Signature-Mikrointeraktion (Magnetic Buttons):** Alle primären
  CTAs bekommen einen "magnetischen" Effekt (folgt dem Mauszeiger
  dezent, federt zurück beim Verlassen). Technisch einfach dieselbe
  `canTilt`-Prüfung wie beim bestehenden Tilt-Effekt wiederverwendet
  (hover:hover/pointer:fine, respektiert reduced-motion) — kein neuer
  Prüf-Code nötig, nur ein weiterer Verwendungszweck derselben Logik.
- **Editorial-Layout, bewusst eng begrenzt:** Nicht die ganze Seite
  umgebaut (das hätte ich vorher selbst als "größerer Eingriff"
  eingeordnet), sondern zwei gezielte Stellen — leicht versetztes
  Team-Raster (mittlere Karte tiefer) und große, sehr transparente
  Hintergrund-Typografie hinter jeder Leistungs-Kategorie, die bewusst
  den Rand touchiert. Dabei `body{overflow-x:hidden}` als Absicherung
  ergänzt, weil absichtlich über den Rand laufende Elemente sonst leicht
  einen ungewollten horizontalen Scrollbalken erzeugen.
  → Möglicher Schluss: Ein "großer struktureller Umbau" lässt sich oft
  auf 1-2 gezielte, klar abgegrenzte Stellen konzentrieren statt die
  ganze Seite anzufassen — bringt einen Großteil der Wirkung bei einem
  Bruchteil des Risikos.
- **Bewusst nicht gewählt:** Foto-Farbveredelung (Duotone) — vermutlich,
  weil die Wirkung stärker vom tatsächlichen Kundenfoto-Material abhängt
  und schwerer vorführbar ist als die anderen drei, eher konkreten
  Bausteine.

## Swatch-Panel doch nicht konstant: bewusste Abweichung

Direkt im Anschluss kamen drei Detail-Wünsche, darunter: das Hero-
Farbmuster durch ein echtes Salon-Foto ersetzen. Das steht im direkten
Widerspruch zur bisher dokumentierten Entscheidung (Abschnitt 10.2 der
Planung, seitdem mehrfach bestätigt — zuletzt sogar explizit beim
Instagram-Modul, wo das Swatch-Panel deshalb bewusst *nicht* angefasst
wurde): Farbsystem/Typografie/**Swatch-Signature-Element** sollten
branchen-/kundenübergreifend konstant bleiben.

- Umgesetzt wie gewünscht (echtes Foto statt Farbmuster, Ticket-Overlay
  bleibt), mit Code-Kommentar vor Ort, der auf die Abweichung
  hinweist — nicht stillschweigend überschrieben.
  → Möglicher Schluss: "Branchenübergreifend konstant" ist offenbar
  keine unumstößliche Regel, sondern ein *Standard-Vorschlag*, den der
  Betreiber im Einzelfall bewusst überstimmen kann — wichtig ist, dass
  Abweichungen dokumentiert werden, nicht dass sie nie vorkommen. Für
  die Komponenten-Bibliothek heißt das: Signature-Elemente sollten als
  änderbare Voreinstellung modelliert werden, nicht als hart codierte
  Konstante.
- Nebenbei zwei weitere Punkte umgesetzt: eigene Wortmarken-Icons für
  die "Wir arbeiten mit"-Leiste (bisher nur Text) und ein Abstands-Fix
  beim Trenner-Ornament zwischen Hero und Stats-Leiste (kollidierte mit
  dem folgenden Block).

## Eigenes Logo statt Text-Monogramm

Bisher gab es nur ein reines Text-Monogramm ("SL" in einem Kreis). Auf
Wunsch ein echtes Bildzeichen entworfen: eine Lindenblatt-Silhouette,
bei der die Scheren-Klingen gleichzeitig als Blattadern funktionieren
(ein Motiv, zwei Lesarten — Baum-/Firmenname UND Branche in einem
Zeichen). Ersetzt das Monogramm im Header-Logo und als Favicon auf
**allen sechs Seiten** — dabei aufgefallen: Impressum und Datenschutz
hatten bisher gar kein Favicon, das wurde nebenbei ergänzt.
→ Möglicher Schluss: Ein Firmen-Logo sollte in der Komponenten-
Bibliothek von Anfang an als eigenes, wiederverwendbares Bild-Snippet
angelegt werden (Header + Favicon aus derselben Quelle generiert),
nicht als zwei separate, potenziell auseinanderlaufende Kopien.

## Team-Fotos: Glaubwürdigkeit von Foto und Name

Rückmeldung: Die ursprünglich zufällig gewählten Stock-Fotos passten
nicht überzeugend zu den deutschen Namen der (fiktiven) Team-Mitglieder.
Fotos ausgetauscht gegen Portraits, die zur Namensherkunft passen.
→ Möglicher Schluss: Bei der Foto-Auswahl für Kunden-Templates sollte
die Konsistenz zwischen Namen/Kontext und Bildmaterial ein eigener
Prüfpunkt sein, nicht nur "professionell wirkendes Foto" — sonst wirkt
eine sonst überzeugende Seite an genau dieser Stelle unglaubwürdig.

## Visueller Artefakt ohne echten Browser diagnostiziert

Nutzer meldete per Screenshot einen "seltsamen Strich" am linken
Bildrand zwischen Hero und Stats-Leiste, sollte homogener Hintergrund
sein. **Wichtige Einschränkung:** Ich habe keinen echten Browser zur
Verfügung, um das visuell zu verifizieren — nur den Code lesen und
plausible Ursachen einschätzen. Zwei Verdächtige identifiziert und
beide defensiv behoben, ohne 100%ige Gewissheit, welcher tatsächlich
verantwortlich war:

1. Die Grain-Textur nutzte `mix-blend-mode:overlay` — dieser Blend-Mode
   verstärkt lokale Kontraste und kann bei einer gekachelten
   Rauschtextur (auch mit `stitchTiles="stitch"`) an den Kachel-Nähten
   ein schwach sichtbares Muster erzeugen. Blend-Mode entfernt, Opacity
   weiter gesenkt.
2. `filter:blur()` auf absolut positionierten Elementen kann in manchen
   Browser-Engines über das `overflow:hidden` des Elternelements hinaus
   "bluten" (bekannter Rendering-Randfall). `contain:paint` ergänzt,
   das genau das garantiert zuverlässig verhindert. Zusätzlich den
   Bild-Überstand eines Ambient-Blobs am Rand reduziert.

→ Möglicher Schluss: Bei rein codebasiertem visuellem Debugging (kein
Browser-Zugriff) ist "mehrere plausible Ursachen defensiv gleichzeitig
beheben" oft die einzig praktikable Strategie — dabei aber immer klar
kommunizieren, dass es eine Vermutung und keine verifizierte Diagnose
ist, statt so zu tun, als sei die Ursache sicher gefunden. Für einen
echten Build-Agenten wäre ein automatisierter visueller Regressionstest
(Screenshot-Vergleich) hier der eigentliche fehlende Baustein.

## Trenner-Position und Glow-Effekte: "vorhanden" reicht nicht, "wahrnehmbar" ist das Ziel (2026-08-23)

Zwei Rückmeldungen zur selben Änderung aus einer vorherigen Runde:

1. Der obere Trenner (Lindenblatt-Ornament) saß zwischen Hero und
   Stats-Leiste, sollte aber direkt unterhalb der Kopfleiste sitzen, mit
   gleichmäßigem Abstand — also als optischer Abschluss der Navigation,
   nicht als Trenner mitten im Content. Behoben, indem er als erstes
   Element in `<main>` verschoben wurde (statt zwischen Hero/Stats).
2. Die Glow-/Licht-Effekte (`.ambient-blob`) waren zwar im Code
   vorhanden (Hero, Testimonials, Kontakt), aber laut Nutzer optisch
   nicht wahrnehmbar — trotz vorheriger eigener Ankündigung, das Feature
   umgesetzt zu haben.

→ Möglicher Schluss: "Ein Feature ist im Code vorhanden" und "ein Feature
ist für den Nutzer wahrnehmbar" sind zwei verschiedene Behauptungen, die
ich nicht verwechseln darf. Die ursprünglichen Opacity-/Größen-Werte der
Blobs (0.12–0.16, 220–340px, blur 70px) waren offenbar zu subtil, um auf
einem realen Bildschirm aufzufallen — selbst wenn sie im Code technisch
korrekt implementiert waren. Zwei Korrekturen kombiniert: (a) die
Basiswerte deutlich angehoben (Opacity auf 0.32–0.38, Größe auf
280–380px, blur auf 60px), und (b) das Muster mechanisch auf praktisch
jede Section der Seite ausgeweitet (Stats-Strip, Leistungen,
Marken-Strip, Team, Vorher/Nachher, Instagram, Gutschein-Panel, FAQ),
statt nur auf drei ausgewählte Abschnitte. Wenn ein Nutzer meldet, ein
bereits umgesetztes Feature sei "nicht sichtbar", ist die Antwort selten
"das ist schon richtig implementiert" — meistens sind die konkreten
Werte (Deckkraft, Größe, Kontrast) zu konservativ gewählt, gerade bei
dezent gedachten Hintergrund-Effekten.

## Scrollbar im Marken-Look eingefärbt (2026-08-25)

Nutzerwunsch: Die (browserseitige, standardmäßig graue) Scrollbar sollte
farblich zum Salon passen. Umgesetzt über `scrollbar-color`/
`scrollbar-width` (Firefox) und `::-webkit-scrollbar*`
(Chrome/Edge/Safari) auf allen sechs Seiten des Prototyps — Thumb in
Pine-Grün, Hover in Bronze, Track in der helleren Hintergrundfarbe.

→ Möglicher Schluss: Browser-Chrome-Elemente (Scrollbar, aber auch z. B.
Formularfelder, `<select>`-Pfeile, Fokus-Ringe) sind ein eigener,
leicht übersehener Kategorie-Punkt für "Wo überall taucht die
Marken-Identität auf" — sollte in die Modul-/Checklisten-Kategorisierung
mit aufgenommen werden, nicht nur Content-Flächen.

## Leistungskatalog erweitert: Recherche zu Branchenstandard als Ausgangspunkt (2026-08-25)

Nutzerwunsch: Die Leistungsliste wirkte im Vergleich zu echten
Friseursalons unvollständig — Auftrag war, sich an typischen Angeboten
zu orientieren und das Paket entsprechend zu erweitern. Vorher: 4
Kategorien (Schnitt, Farbe, Styling, Pflege), 7 Positionen insgesamt.
Nachher: 5 Kategorien, 16 Positionen. Neu hinzugekommen:

- Schnitt: Pony nachschneiden (kurzer, günstiger Einstiegspunkt)
- Farbe: Foliensträhnen, Tönung, Blondierung/Komplettfärbung (deckt die
  gängige Preisspanne von "Auffrischung" bis "komplette Umfärbung" ab)
- Styling: Hochsteckfrisur/Brautstyling, Glätten (Keratin-Anwendung)
- Pflege: Olaplex-Behandlung (aktuell stark nachgefragtes Zusatzprodukt
  bei Farbservices), Kopfhautbehandlung
- Neue eigene Kategorie "Bart & Herrenpflege" (Bartschnitt/-konturen,
  Bartrasur mit heißem Handtuch) — bei praktisch jedem Vollsortiment-
  Friseursalon mit Herrenkundschaft Standard, fehlte komplett

→ Möglicher Schluss: Ein Leistungsmodul sollte im Modul-Katalog nicht
als "einmal befüllt, fertig" behandelt werden, sondern mit einer Art
Mindest-Checkliste pro Branche hinterlegt sein (z. B. für Friseure:
Schnitt/Farbe/Styling/Pflege/Herrenbereich als Mindestabdeckung), damit
ein Kunde beim Erstaufbau nicht versehentlich mit einer unvollständig
wirkenden Preisliste startet. Das ist vermutlich branchenübergreifend
relevant — jede Branche hat ein "das erwartet man einfach"-Set an
Leistungen, das über generisches Nachfragen hinaus aktiv recherchiert
werden sollte.

## Social-Media-Integration allgemein: vier Muster, ein DSGVO-Kriterium (2026-08-25)

Nutzerfrage: Wie funktioniert Social-Media-Integration technisch, und ist
das DSGVO-konform? Zusammengefasst gibt es vier grundsätzlich
unterschiedliche technische Muster, deren DSGVO-Risiko systematisch mit
der Frage steigt, *wann* eine Verbindung zum Drittanbieter-Server
aufgebaut wird:

1. **Offizielle Plattform-API, automatisch beim Seitenaufruf** (Meta
   Graph/Instagram API, Google Places API für Bewertungen). Braucht
   Business-Account, oft App-Review, Token-/Key-Verwaltung mit Ablauf —
   und weil die Verbindung automatisch beim Laden entsteht (IP-Adresse
   des Besuchers geht an den Anbieter), ist eine Einwilligung nötig
   (Cookie-Banner/Consent-Layer), nicht nur "berechtigtes Interesse".
2. **Drittanbieter-Aggregator-Widget** (Elfsight, SnapWidget, Juicer
   u. Ä.). Gleiches DSGVO-Problem wie 1, plus ein *zusätzlicher*
   Auftragsverarbeiter (der Widget-Anbieter selbst) mit eigenem AVV-
   Bedarf.
3. **Klick-zum-Laden (Consent-Gate)**: Inhalt wird nicht automatisch
   geladen, sondern erst nach aktivem Nutzer-Klick — der Klick selbst
   ist die Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), kein Cookie-Banner
   nötig. Genau das Muster, das hier schon für die Google-Maps-
   Kartenanzeige gebaut wurde (datenschutz.html, Ziffer 5).
4. **Manuell gepflegt, keine Live-Verbindung**: Inhalte werden von Hand
   als lokale Dateien gepflegt (wie hier für Instagram und die Google-
   Bewertungen umgesetzt). Beim Laden der Seite entsteht gar keine
   Verbindung zu Meta/Google — dadurch entfällt die DSGVO-Frage
   komplett, nicht nur die Einwilligungspflicht.

**Gilt das auch für Google?** Ja, unverändert — das Kriterium ist nicht
der Anbieter (Meta vs. Google), sondern *ob und wann* automatisch eine
Verbindung zum jeweiligen Server aufgebaut wird. Die Google-
Bewertungen im Prototyp folgen deshalb bewusst Muster 4 (siehe "Echte
Google-Bewertungen einbinden" oben), während die Kartenanzeige bewusst
Muster 3 nutzt — sie *muss* eine echte externe Karte zeigen, um ihren
Zweck zu erfüllen, ein Bewertungs- oder Feed-Widget dagegen nicht
zwingend live sein muss, um seinen Zweck (Social Proof / Aktualität
zeigen) zu erfüllen.

**Am Prototyp umgesetzt:** Unter dem Instagram-Raster steht jetzt eine
Caption (wie schon beim Vorher/Nachher-Vergleich), die explizit
klarstellt, dass es sich um eine manuell gepflegte Vorschau ohne
automatische Instagram-Verbindung handelt, und in datenschutz.html gibt
es dazu eine eigene neue Ziffer 6 "Social Media (Instagram, TikTok)".
Dabei auch einen bestehenden Nummerierungsfehler behoben: Ziffer 3
verwies fälschlich auf "Ziffer 6" für die Kartenanzeige, korrekt ist
Ziffer 5.

→ Möglicher Schluss: Für die Planungsdatei lohnt sich eine einzige
generische Checkliste "Drittanbieter-Integration" mit genau diesen vier
Mustern, statt für jeden Anbieter (Google, Meta, TikTok, ...) das
DSGVO-Thema neu durchzudenken — das Kriterium (automatische vs.
klickbasierte vs. keine Verbindung) ist anbieterunabhängig und
wiederverwendbar.

## Drei weitere Module ergänzt: Live-Öffnungsstatus, Aktionsbanner, Chat-Widget (2026-08-25)

Auf Nutzerfrage "welche Module wären noch relevant für Friseursalons"
zunächst eine Liste möglicher Ergänzungen zusammengestellt (Newsletter,
Empfehlungsprogramm, Aktionsbanner, Live-Öffnungsstatus, Presse-/
Auszeichnungs-Leiste, Blog, Team-Filter, Barrierefreiheitserklärung,
Live-Chat) und den Nutzer per Auswahl entscheiden lassen, statt alles auf
einmal zu bauen. Ausgewählt: Live-Öffnungsstatus, Aktionsbanner, Chat-
Widget. Umgesetzt:

1. **Live-Öffnungsstatus**: berechnet "Jetzt geöffnet" / "Geschlossen"
   (inkl. nächster Öffnungszeit) direkt aus den bereits hinterlegten
   Öffnungszeiten, live je nach ausgewähltem Standort. **Wichtige
   Einschränkung:** nutzt die Uhrzeit/Zeitzone des Besucher-*Geräts*,
   nicht eine Server-verifizierte Zeit — für einen echten Kunden mit
   Besuchern in anderen Zeitzonen (unwahrscheinlich bei einem lokalen
   Friseursalon, aber grundsätzlich zu bedenken) wäre das ein
   Genauigkeitsproblem. Kein Drittanbieter nötig, Betriebsmodell 1
   (siehe Modul-Katalog Kategorie E).
2. **Aktions-/Rabattbanner**: eigenständiges Promo-Modul, bewusst von
   der bestehenden Ankündigungsleiste abgegrenzt — die Ankündigungsleiste
   ist für kurzfristige Betriebsmeldungen (z. B. "heute geschlossen"),
   das Aktionsbanner für zeitlich begrenzte Marketing-Angebote. Als
   MOCK-Inhalt bewusst an die neue "Bart & Herrenpflege"-Kategorie
   angeknüpft (thematisch stimmig: neue Leistung + Einführungsrabatt).
3. **Chat-Widget**: als Demo-Mechanik mit fest hinterlegten Antworten
   umgesetzt (Quick-Reply-Buttons zu Öffnungszeiten/Buchung/Preisen),
   *keine* echte Live-Chat-Anbindung (Tawk.to/Crisp o. Ä.) gebaut.
   Begründung: Ein echter Live-Chat bräuchte entweder einen echten
   Drittanbieter-Account (den ich nicht autonom für eine fiktive Firma
   anlegen sollte) oder eine reale Support-Person im Hintergrund — beides
   für einen Prototyp nicht sinnvoll. Gleiches Muster wie beim Vorher/
   Nachher-Vergleichsslider: Interaktions-*Mechanik* zeigen, ohne echte
   Funktionalität vorzutäuschen, mit klarer Kennzeichnung im HTML-
   Kommentar.

→ Möglicher Schluss: Bei Modul-Vorschlägen aus eigener Initiative lohnt
es sich, dem Nutzer eine Auswahl zu geben statt alles ungefragt zu bauen
— besonders wenn manche Optionen (wie hier BFSG-Recherche) eher
Recherche- als Umsetzungsaufwand sind und unterschiedlich priorisiert
werden könnten. Und: Nicht jedes „Live"-klingende Feature-Modul
*braucht* eine echte Drittanbieter-Anbindung — bei Chat-Widgets und
Öffnungsstatus lässt sich der Nutzen oft komplett clientseitig
demonstrieren, ganz ohne das DSGVO-Abwägungsproblem aus den Social-
Media-/Bewertungs-Modulen überhaupt erst aufzuwerfen.

## Chatbot-Ausbau und Social-Media-Speed-Dial (2026-08-25)

**Chatbot ausgebaut** (Fortsetzung von "Drei weitere Module ergänzt"
oben): Statt eines echten Live-Chat-Anbieters oder KI-Bots (bewusst
abgelehnt, siehe dort) wurde die bestehende Demo-Mechanik inhaltlich
vertieft, ohne neue Abhängigkeiten:
- Zweite Themenebene über einen "Weitere Fragen"-Button (Parken/
  Anfahrt, Stornierung, Gutschein) statt aller Themen auf einmal —
  einfache Form von Verzweigung, rein clientseitig per JS-generiertem
  DOM, kein Framework nötig.
- Persistenter WhatsApp-Handoff-Footer im Chat-Panel — verbindet
  Chat-Widget und WhatsApp-Button sinnvoll, statt sie als zwei isolierte
  Kontaktkanäle nebeneinander zu betreiben.
- Dynamische Begrüßung: Beim ersten Öffnen außerhalb der Öffnungszeiten
  erscheint automatisch ein Hinweis. Nutzt dieselbe Öffnungszeiten-Logik
  wie der Live-Öffnungsstatus (Wiederverwendung statt Duplizierung der
  Kernberechnung).

**Rechtlicher Hinweis dabei recherchiert:** Bei einem *echten*
KI-gestützten Chatbot (nicht der hier gebauten Demo-Mechanik mit fest
hinterlegten Antworten) greift inzwischen der **EU AI Act** — Nutzer
müssen erkennen können, dass sie mit einem Bot statt einem Menschen
sprechen (Transparenzpflicht). Für die Planungsdatei relevant, sobald
ein echter KI-Chatbot als Modul angeboten werden sollte.

**Social-Media-Speed-Dial ergänzt:** Nutzer wollte Instagram/Facebook/
TikTok-Buttons neben WhatsApp und Chat unten rechts, "in Form eines
roten Logos" — stellte sich in der Rückfrage als echte Mehrdeutigkeit
heraus (rot vs. rund gemeint?), deshalb per Auswahlfrage geklärt statt
geraten. Ergebnis: runde Buttons in den offiziellen Marken-Farben
(Instagram-Gradient, Facebook-Blau, TikTok-Schwarz), aber nicht dauerhaft
gestapelt, sondern als Speed-Dial hinter einem einzelnen Toggle-Button
versteckt — sonst wären es 5 permanent sichtbare runde Buttons
übereinander gewesen, was dem vom Nutzer gewünschten "clean" Look
widersprochen hätte.

→ Möglicher Schluss: Bei mündlich/diktierten Anfragen (dieser ganze
Prototyp-Austausch läuft erkennbar über Diktat) lohnt sich bei
lautähnlichen, aber semantisch stark unterschiedlichen Wörtern
("rot"/"rund") eine kurze Rückfrage mehr als eine Annahme — der
Interpretationsfehler wäre hier sichtbar und musste, aber schwer
rückgängig zu machen gewesen (neue Farbe vs. neue Form sind zwei
verschiedene Design-Entscheidungen mit unterschiedlicher Tragweite).
Zusätzlich: Ein einzelner Toggle, der mehrere gleichartige Buttons
bündelt (Speed-Dial), ist generell die bessere Lösung, sobald mehr als
2 fixierte Kontakt-/Aktions-Buttons in derselben Ecke gewünscht sind —
sollte als generisches UI-Muster in die Planungsdatei aufgenommen
werden, nicht nur für Social-Media-Buttons.

## Speed-Dial wieder rückgängig gemacht: dauerhaft sichtbar gewünscht (2026-08-25)

Direkt im Anschluss an den Speed-Dial (siehe oben) kam die
Rückmeldung, dass die Social-Media-Buttons doch dauerhaft sichtbar
bleiben sollen (nicht ein-/ausklappbar), und der Chat-Button links
davon stehen soll. Umgesetzt: Chat-Widget und die drei Social-Buttons
teilen sich jetzt eine gemeinsame `.fab-row` (horizontales Flexbox,
`justify-content` implizit durch `right`-Positionierung der Zeile
selbst), WhatsApp bleibt als eigener Button darunter. Toggle-Button,
Ein-/Ausklapp-Animation und die zugehörige JS-Logik komplett entfernt.

→ Möglicher Schluss: Bei einem UI-Vorschlag aus eigener Initiative
(hier: Speed-Dial, um die Buttonreihe "clean" zu halten) sollte klarer
kommuniziert werden, dass das eine von mehreren gültigen Lösungen für
das genannte Ziel ist, nicht die einzige — der Nutzer hatte ein anderes
Verständnis von "clean" (alles sichtbar, aber ordentlich in einer Reihe)
als ich unterstellt hatte (möglichst wenig dauerhaft sichtbare Elemente).
Sollte in Zukunft bei rein geschmacklichen/layout-bezogenen
Eigenentscheidungen eher kurz nachfragen oder die Alternative explizit
mit anbieten, statt sich auf eine Interpretation festzulegen.

## Kontakt-Button-Cluster: dritte Iteration bis zum passenden Layout (2026-08-25)

Nach dem Speed-Dial (verworfen) und der vertikalen Social-Stack-Variante
("fast richtig") kam eine dritte, präzisere Korrektur: Chat-Button auf
Höhe des WhatsApp-Buttons statt auf Höhe des untersten Social-Buttons,
und alle Buttons einheitlich groß. Ergebnis: WhatsApp ist jetzt kein
eigenständiger fixierter Button mehr, sondern Teil desselben
`.fab-cluster` wie der Chat-Button (gleiche Zeile), während der
Social-Media-Stapel weiterhin vertikal daneben steht — durch
`align-items:flex-end` liegt dessen unterster Eintrag (TikTok)
automatisch auf derselben Höhe wie WhatsApp/Chat, ohne dass die Höhe
irgendwo doppelt gepflegt werden muss. Alle 5 Buttons (WhatsApp, Chat,
Instagram, Facebook, TikTok) sind jetzt einheitlich 3.2rem groß.

Zusätzlich das Chat-Fenster von einem abrupten `hidden`-Attribut-Toggle
auf eine echte Opacity-/Scale-Transition umgestellt ("dass auch das
Fenster auf und zu geht") — technisch war die Toggle-*Logik* vorher
schon korrekt, aber ohne sichtbare Animation wirkte es nicht wie ein
bewusstes Auf-/Zuklappen, sondern wie ein Ein-/Ausblenden ohne
Übergang. `aria-hidden` übernimmt jetzt die Screenreader-Zugänglichkeit,
die vorher das `hidden`-Attribut erledigt hat.

→ Möglicher Schluss: Bei reinen Layout-/Positionierungs-Wünschen lohnt
es sich, nach der ersten Umsetzung explizit zu fragen "so wie gemeint?"
statt die Bestätigung erst beim nächsten Nutzer-Feedback zu bekommen —
hier brauchte es drei Runden für ein eigentlich einfaches Anliegen
(Button-Anordnung unten rechts). Ein kurzer ASCII-artiger
Positions-Hinweis oder eine Nachfrage vor der Umsetzung hätte
mindestens eine Runde gespart. Zusätzlich: "öffnet/schließt" bei einem
UI-Element sollte ich standardmäßig als "mit sichtbarer Übergangs-
Animation" verstehen, nicht nur als "Sichtbarkeits-Zustand wechselt" —
letzteres ist zwar technisch auch ein Toggle, wirkt für den Nutzer aber
nicht wie ein bewusstes Öffnen/Schließen.

## Kontakt-Cluster final: WhatsApp in den Stapel, plus Freitext-Chat (2026-08-25)

Letzte Korrektur am Button-Cluster: WhatsApp wandert vom "gleiche Höhe
wie Chat"-Platz in den vertikalen Social-Stapel selbst, als obersten
Eintrag über Instagram. Der Chat-Button bleibt links vom Stapel, weiter
auf Höhe des jeweils untersten Eintrags (jetzt weiterhin TikTok) — die
`align-items:flex-end`-Regel musste dafür gar nicht angefasst werden,
nur welches Element im Stapel liegt. Vierte Iteration insgesamt für ein
eigentlich simples Anordnungsanliegen (siehe vorherige Erkenntnis).

**Freitext-Chat ergänzt:** Zusätzlich zu den Quick-Reply-Buttons kann
jetzt frei getippt werden. Umgesetzt als einfaches Keyword-Matching
(String enthält z. B. "preis"/"price") gegen dieselben sechs Themen wie
die Buttons, mit Fallback-Antwort bei keinem Treffer, die auf die
Buttons/WhatsApp verweist. Bewusst *kein* echtes NLU/KI-Sprachmodell —
das wäre Option B/C aus der ursprünglichen Chatbot-Ausbau-Liste
(Backend, laufende Kosten, EU-AI-Act-Transparenzpflicht) und für den
Prototyp nicht verhältnismäßig, siehe "Chatbot-Ausbau" oben. Nutzereingabe
wird über `textContent` statt `innerHTML` eingefügt, um XSS über die
Chat-Bubble auszuschließen (einzige Stelle im Prototyp, an der
ungefilterter Freitext von einem Besucher direkt ins DOM geschrieben
wird).

→ Möglicher Schluss: Ein Freitextfeld mit Keyword-Matching ist ein
guter Mittelweg zwischen reinen Klick-Buttons und einem echten KI-Bot —
bringt einen Großteil des "lebendiger wirkenden" Eindrucks, ohne neue
Kosten, Abhängigkeiten oder Rechtsfragen einzuführen. Für die Planung
als eigene Ausbaustufe zwischen den Betriebsmodellen 1 (rein manuell)
und den echten API-/KI-Anbindungen dokumentieren.

## Echter KI-Chatbot geprüft und bewusst verworfen — organisches Lernen statt LLM (2026-08-25)

Nutzerfrage: Lohnt sich ein echter KI-Chatbot (Sprachmodell statt
Keyword-Matching) für einen Friseursalon? Kostenrecherche durchgeführt
(Claude Haiku 4.5: $1/Mio. Input-Token, $5/Mio. Output-Token — für
diesen Anwendungsfall das richtige Preis-Leistungs-Modell, nicht die
teureren Sonnet-/Opus-Modelle). Ergebnis der Rechnung: Bei realistischer
Nutzung (schätzungsweise 5–30 Unterhaltungen/Tag, ~7 Nachrichten je
Unterhaltung) liegen die API-Kosten bei ca. 2–10 € im Monat — de facto
vernachlässigbar gegenüber Fresha (~27 €/Monat).

**Trotzdem gegen einen echten KI-Chatbot entschieden.** Nicht wegen der
Kosten, sondern:
1. Das reale Fragevolumen eines einzelnen Salons ist klein und
   vorhersehbar — Öffnungszeiten/Preise/Parken/Stornieren decken
   vermutlich den Großteil ab, das deckt das bestehende Keyword-System
   bereits kostenlos und *garantiert korrekt* ab (feste Antworten,
   keine Interpretation).
2. Ein echtes Sprachmodell bringt ein neues Risiko mit, das das
   jetzige System strukturell nicht hat: Halluzination (erfundene
   Preise/Verfügbarkeiten), das ohne sorgfältiges Prompt-Engineering
   auftreten kann.
3. EU-AI-Act-Transparenzpflicht (Nutzer muss erkennen, dass er mit
   einer KI statt einem Menschen spricht) kommt als zusätzliche
   Pflicht hinzu.

**Stattdessen umgesetzt:** organisches Lernen ohne LLM. Findet das
Freitext-Keyword-Matching kein passendes Thema, erscheint neben der
Fallback-Antwort ein "Frage an den Salon senden"-Button, der die Frage
per `mailto:` direkt an die Salon-E-Mail schickt (gleiches Muster wie
Gutschein-Anfrage/Initiativbewerbung — kein Backend nötig, da die Seite
statisch auf GitHub Pages läuft und "serverseitiges Cachen" von Fragen
technisch gar nicht möglich wäre). Der Betreiber sieht so echte,
tatsächlich gestellte Fragen und kann wiederkehrende Themen manuell als
neuen Eintrag in `CHAT_KEYWORDS`/`CHAT_REPLIES` nachpflegen — der Bot
wird über die Zeit besser, ohne API-Kosten, Wartungsaufwand für
Token-Handling oder Halluzinationsrisiko.

→ Möglicher Schluss: "Kann sich das Modul kostenmäßig lohnen" und "ist
das Modul für diesen Kundentyp die richtige Lösung" sind zwei getrennte
Fragen — hier war die Antwort auf die erste Ja, auf die zweite Nein.
Ein einfacher, deterministischer Mechanismus (Keyword-Matching + manuell
kuratiertes Feedback-Loop) kann für einen Kleinbetrieb der bessere
Kompromiss sein als die technisch fortschrittlichere Lösung — das
passt zum bereits mehrfach in diesem Dokument aufgetauchten Muster
("Betriebsmodell 1: manuell" ist oft nicht die Notlösung, sondern die
bewusst richtige Wahl für kleine Kunden).

## Style-Finder-Quiz als neues Modul (2026-08-25)

Auf die wiederkehrende Frage "welche Module wären noch relevant"
diesmal bewusst eine interaktive statt eine rein informative Ergänzung
vorgeschlagen (neben Barrierefreiheit/PWA/Blog, die aber nicht gewählt
wurden). Umgesetzt: ein 3-Fragen-Quiz ("Was bringt dich zu uns?" /
Zeitaufwand / gewünschtes Kompliment), das über ein simples Punktesystem
auf eine von vier Kategorien (Schnitt/Farbe/Styling/Pflege) mappt und am
Ende zwei echte Leistungen mit echten Preisen aus dem bestehenden
Katalog empfiehlt, plus CTA zu Buchung und Leistungsübersicht.

Bewusste Entscheidungen dabei:
- **Kein Drittanbieter, keine KI** — reine Punktevergabe in JS, genau
  im selben "deterministisch statt Sprachmodell"-Geist wie die
  Chatbot-Entscheidung oben. Für ein Marketing-Gimmick wie dieses wäre
  eine KI-Anbindung erst recht unverhältnismäßig.
- **Ergebnisse verlinken auf echte Katalog-Preise**, nicht auf erfundene
  Empfehlungen — das Quiz bewirbt am Ende tatsächlich buchbare
  Leistungen, keine Fantasie-Pakete.
- **Icon-Wiederverwendung**: Die Ergebnis-Icons sind exakt dieselben
  SVG-Pfade wie die Kategorie-Icons im Leistungen-Abschnitt (Schere,
  Tropfen, Stern, Blatt) — konsistente Bildsprache statt neuer Icons
  nur für dieses eine Feature.
- **Nicht in die Hauptnavigation aufgenommen**, analog zu Testimonials
  und Vorher/Nachher — die Seite hat bereits genug Nav-Punkte, das Quiz
  ist über den normalen Scroll-Fluss zwischen Leistungen und Buchen
  gut auffindbar.

→ Möglicher Schluss: Ein interaktives "Gimmick"-Modul (Quiz/Konfigurator)
ist ein eigener, bisher nicht katalogisierter Modul-Typ neben Content-,
Social-Proof- und Conversion-Modulen — es dient primär der
Vorführwirkung/Differenzierung, nicht der reinen Informationsvermittlung.
Sollte als eigene Kategorie in den Modul-Katalog aufgenommen werden,
sobald ein zweiter Branchen-Prototyp zeigt, ob sich das Muster
verallgemeinern lässt (z. B. "Welcher Beratungstyp bist du" für andere
Dienstleister).

## Quiz-Erweiterung, Magnet-Dosierung und Bild-Wiederverwendung als übersehener Qualitätspunkt (2026-08-26)

Drei kleinere, aber lehrreiche Korrekturen in einer Runde:

1. **Quiz auf alle 5 Leistungskategorien erweitert**: Das Style-Finder-
   Quiz deckte bisher nur 4 von 5 Kategorien ab (Bart & Herrenpflege
   fehlte) — direkte Folge davon, dass das Quiz vor der Bart-Kategorie
   entstanden ist und beim Hinzufügen neuer Leistungskategorien nicht
   automatisch mitgedacht wurde. Fünfte Antwortoption je Frage ergänzt.
   → Möglicher Schluss: Wenn ein Modul (hier: Quiz) inhaltlich von einem
   anderen Modul (hier: Leistungskatalog) abhängt, sollte eine spätere
   Erweiterung des einen Moduls zum Anlass werden, alle abhängigen
   Module auf Vollständigkeit zu prüfen — nicht nur beim ursprünglichen
   Bauen einmalig verknüpfen und danach getrennt weiterpflegen.

2. **Magnetic-Hover-Stärke war zu intensiv** (0.35) — auf 0.16 reduziert.
   Reiner Geschmackswert ohne tieferen Erkenntnisgehalt, aber zeigt:
   Bei rein "gefühlten" Interaktions-Parametern (Stärke/Geschwindigkeit/
   Dauer eines Effekts) lohnt sich ein niedrigerer Startwert als der
   erste Instinkt vermuten lässt — leicht nachträglich verstärken ist
   unauffälliger als zu stark starten und dann zurückrudern.

3. **Bild-Wiederverwendung als eigener, bisher nicht geprüfter
   Qualitätspunkt**: Hero und Instagram-Raster nutzten bis zu diesem
   Zeitpunkt exakt dieselben 6 Fotos wie die Galerie-Sektion (die
   Instagram-Sektion war sogar bewusst so dokumentiert: "nutzt
   dieselben Fotos wie die Galerie"). Das wirkte für mich naheliegend
   (weniger Fotos beschaffen/pflegen), für den Nutzer aber wie ein
   Fehler ("manche Bilder werden doppelt verwendet, das möchte ich
   nicht"). Sieben neue Pexels-Fotos ergänzt, damit jedes Bild nur noch
   an einer Stelle vorkommt — mit einer bewussten, dokumentierten
   Ausnahme: der Vorher/Nachher-Regler zeigt weiterhin dieselbe Aufnahme
   zweimal, weil das die einzig ehrliche Umsetzung ohne echte gepaarte
   Vorher/Nachher-Fotos ist.
   → Möglicher Schluss: "Ressourcen sparen durch Wiederverwendung" ist
   in der Softwareentwicklung meist positiv besetzt (DRY-Prinzip),
   gilt aber nicht 1:1 für Bildmaterial auf einer öffentlichen Website —
   dort wirkt Wiederholung schnell wie mangelnde Sorgfalt oder ein zu
   kleiner Fundus an echtem Material. Bildvielfalt sollte als eigener
   Checklisten-Punkt geführt werden, unabhängig von technischer
   Effizienz.

## Strategie-Entscheidung: Branchenfokus statt Farbvarianten, und vier weitere Module (2026-08-26)

**Strategische Weichenstellung:** Auf die Frage, ob mehrere Prototyp-
Websites (z. B. 5 Stück in verschiedenen Farbvarianten) sinnvoll wären,
um potenziellen Kunden die Möglichkeiten zu zeigen, wurde empfohlen,
stattdessen auf echte Branchenvielfalt statt Farbvarianten zu setzen —
Design/Farbe lässt sich in einem Verkaufsgespräch leicht erklären,
überzeugender ist zu zeigen, dass sich das System an unterschiedliche
Branchen anpasst. Der Nutzer hat sich daraufhin bewusst **gegen**
weitere Branchen-Prototypen entschieden: Er möchte sich zunächst
ausschließlich auf die Friseur-Branche spezialisieren und dort echte,
wiederkehrend zahlende Kunden gewinnen. Das ist eine sinnvolle
Fokus-Entscheidung für ein frühphasiges Ein-Personen-Vorhaben — wurde
entsprechend akzeptiert, nicht in Frage gestellt.

Gleichzeitig empfohlen: Der Prototyp selbst ist inzwischen sehr
feature-reich; der eigentliche Engpass für "echte zahlende Kunden
finden" liegt eher bei fehlender Verkaufsinfrastruktur (eigene Domain,
Preis-/Paketstruktur, Verkaufs-Ein-Pager, Gewerbe-/Vertragsgrundlagen,
aktive Akquise) als bei weiteren Website-Features. Der Nutzer hat sich
trotzdem für "Prototyp weiter ausbauen" entschieden — auch das wurde
akzeptiert, nicht gegen seinen Willen umgelenkt.

**Vier weitere Module in einer Runde ergänzt** (aus einer zuvor nicht
gewählten Ideenliste, diesmal alle vier auf einmal ausgewählt):

1. **Barrierefreiheit (BFSG)**: neue Rechtsseite `barrierefreiheit.html`
   nach dem Vorbild von Impressum/Datenschutz, plus eine echte kleine
   Werkzeugleiste im Header (Schriftgröße stufenweise 90–130 %,
   Hoher-Kontrast-Umschalter über CSS-Variablen-Override auf
   `html.high-contrast`). Einstellungen werden per localStorage
   gemerkt. Bewusst *keine* vollständige WCAG-AAA-Prüfung behauptet,
   sondern als Selbsteinschätzung gekennzeichnet — passt zum
   etablierten Ehrlichkeitsprinzip des Prototyps.
2. **PWA-Grundausstattung**: `manifest.json` + minimaler Service
   Worker (`sw.js`, cached nur die Startseite als Offline-Basisseite).
   **Wichtige Einschränkung:** In dieser Umgebung stand kein
   Bild-Konvertierungstool zur Verfügung (kein ImageMagick/rsvg-
   convert/Pillow/sharp) — das PWA-Icon existiert daher nur als SVG
   (`assets/img/icon.svg`), nicht als PNG. Funktioniert für Chrome/
   Android "Zur Startseite hinzufügen", aber `apple-touch-icon`
   erwartet offiziell PNG; auf iOS könnte das auf ein automatisches
   Screenshot-Icon zurückfallen statt das echte Logo zu zeigen. Für
   einen echten Kunden bräuchte es einen echten Icon-Export (z. B. vom
   Grafikdesigner mitgeliefert), keine KI-generierte Rastergrafik ohne
   passendes Tool.
3. **Ratgeber-Bereich**: drei vollständige, für Suchmaschinen
   indexierbare Artikelseiten (bewusst *ohne* `robots noindex`, im
   Unterschied zu Impressum/Datenschutz/Barrierefreiheit — der ganze
   Sinn eines Ratgeber-Moduls ist Auffindbarkeit) mit echten internen
   Verlinkungen zu Buchung, Leistungen und dem Style-Finder-Quiz. Drei
   weitere, bislang unbenutzte Fotos ergänzt, um die gerade erst
   etablierte "keine Bild-Duplikate"-Regel nicht sofort wieder zu
   brechen.
4. **Presse-/Auszeichnungs-Leiste**: reine Wiederverwendung der
   bestehenden `.brand-strip`/`.brand-row`-Klassen mit anderem Inhalt
   (Social Proof statt Partner-Marken) — kein neues CSS nötig, zeigt,
   wie gut das bestehende Komponentensystem für neue, ähnlich
   strukturierte Inhalte wiederverwendbar ist.

→ Möglicher Schluss: `robots.txt` und `sitemap.xml` fehlen im Prototyp
trotzdem noch (Kategorie A im Modul-Katalog nennt sie als Pflicht-
Checkliste, umgesetzt sind bisher nur schema.org-Daten und Meta-/
OG-Tags) — mit dem neuen Ratgeber-Modul, das von echter Auffindbarkeit
lebt, wird diese Lücke relevanter als vorher und sollte als Nächstes
geschlossen werden, sobald es wieder um Prototyp-Ausbau statt
Business-Infrastruktur geht.

## PWA-Icon-Lücke doch noch geschlossen: npm als übersehene Werkzeug-Quelle (2026-08-26)

Die zuvor dokumentierte Einschränkung ("kein Bild-Konvertierungstool
verfügbar, PWA-Icon nur als SVG") stellte sich als vorschnell heraus.
`npm` war die ganze Zeit verfügbar — nur klassische Bildwerkzeuge
(ImageMagick, rsvg-convert, Python+Pillow/cairosvg, node-sharp
vorinstalliert) fehlten. Mit `npm install sharp --no-save` in einem
Scratch-Verzeichnis (nicht im Projekt, nichts committet) ließ sich das
SVG-Logo doch sauber in echte PNGs (180/192/512px) rendern. Danach
`apple-touch-icon` auf das 180px-PNG umgestellt und beide weiteren
Größen in `manifest.json` ergänzt — die iOS-Einschränkung ist damit
behoben, nicht mehr nur dokumentiert.

→ Möglicher Schluss: "Kein X verfügbar" sollte heißen "die X, die ich
zuerst geprüft habe, fehlen" — bevor eine Einschränkung als endgültig
dokumentiert wird, lohnt sich ein Blick auf allgemeinere
Werkzeug-Ökosysteme (hier: npm als Bezugsquelle für ein Konvertierungs-
Paket), nicht nur auf die naheliegendsten, dedizierten CLI-Tools. Für
einen echten Kunden bleibt trotzdem richtig: Ein echtes Logo würde
ohnehin vom Grafikdesigner in allen benötigten Formaten geliefert,
dieser Workaround war nur für den Prototyp nötig.

## Mobil-Tauglichkeit: schon mitgebaut, aber gezielte Prüfung nach Feature-Serie lohnt sich (2026-08-26)

Nutzerfrage: Sollte die Seite jetzt schon für Handy/Tablet optimiert
werden, oder ist das verfrüht? Antwort: Mobil-Tauglichkeit war die
ganze Zeit Teil des Fundaments (mobiles Menü, responsive Grids,
`clamp()`-Typografie, `@media`-Anpassungen praktisch überall) — keine
separate, nachzuholende Grundlage. Trotzdem lohnte sich jetzt ein
gezielter Code-Audit der zuletzt schnell hinzugefügten Elemente (Fab-
Cluster, Chat-Fenster, Quiz, A11y-Menü, Ratgeber-Kacheln), weil diese
noch nicht einzeln auf schmalen Bildschirmen geprüft wurden. Dabei zwei
echte Bugs gefunden (kein echtes Gerät verfügbar — reiner Code-Audit,
keine visuelle Verifikation):

1. Die Ratgeber-Kacheln nutzten `.gallery-tile` mit — dadurch hätten
   sie die festen `nth-child`-Bento-Grid-Positionen der 6-Bilder-
   Fotogalerie geerbt (verzerrte Positionierung). Behoben mit eigenen
   `.ratgeber-grid`/`.ratgeber-tile`-Klassen. Dabei zusätzlich bemerkt:
   Die Bildunterschrift der Galerie-Kacheln ist nur bei `:hover`
   sichtbar — für die Fotogalerie okay (Bilder sprechen für sich), für
   Blog-Teaser aber ein echtes Problem, weil Touch-Geräte kein Hover
   kennen und der Artikeltitel auf dem Handy dadurch nie sichtbar
   gewesen wäre. Deshalb bei den Ratgeber-Kacheln die Unterschrift
   dauerhaft sichtbar gemacht statt hover-abhängig.
2. Das Chat-Fenster war rechtsbündig zum Chat-*Button* positioniert,
   der aber links neben der Social-Media-Spalte sitzt, nicht am
   Bildschirmrand. Auf schmalen Handys hätte das Fenster links über
   den Bildschirmrand hinausgeragt. Mit einem Ausgleichs-Offset
   (`right:-3.8rem`, exakt Breite+Abstand der Social-Spalte) behoben.

**Noch offen, nicht behoben (kein echtes Gerät zur Verifikation):** Der
Kontakt-Button-Cluster stapelt inzwischen 5 Buttons (Chat + WhatsApp +
3 Social-Media) vertikal — auf kurzen Bildschirmen (z. B. Handy im
Querformat) könnte dieser Stapel einen großen Teil der Bildschirmhöhe
einnehmen und Inhalte verdecken. Ohne echten Gerätetest lässt sich
nicht sicher sagen, ob das ein reales Problem ist oder nur eine
theoretische Sorge — sollte bei Gelegenheit auf einem echten Smartphone
gegengeprüft werden.

→ Möglicher Schluss: Das generelle Muster "Klasse aus einer bestehenden
Komponente mitbenutzen, um Styling zu sparen" (hier: `.gallery-tile`
für die Ratgeber-Kacheln) ist riskant, sobald die Ursprungs-Komponente
zusätzliche, kontextspezifische Regeln hat (`nth-child`-Positionierung,
hover-only-Sichtbarkeit) — diese Regeln gelten dann unbeabsichtigt auch
im neuen Kontext mit. Bei visueller Wiederverwendung lieber gezielt nur
die *Optik* kopieren (Farben, Radius, Schatten) und dafür eine neue,
unabhängige Klasse anlegen, statt die alte Klasse direkt zu erben.

## Button-Cluster fünfte Iteration: Hover-Einklappen plus Glow (2026-08-26)

Nochmal Anordnung des Kontakt-Button-Clusters geändert: Social-Media-
Kanäle (WhatsApp, Instagram, Facebook, TikTok) sind jetzt wieder hinter
einem einzelnen Button verborgen, öffnen sich aber diesmal per **Hover**
statt Klick (mit Klick- und `:focus-within`-Fallback für Touch/
Tastatur) — im Kern eine Rückkehr zum Speed-Dial-Muster von vorhin,
nur mit anderem Trigger. Dazu ein dezenter, pulsierender Glow-Halo
(`.glow-fab`) für Chat- und Social-Media-Button ergänzt, um beide als
zusammengehöriges Paar erkennbar zu machen.

→ Möglicher Schluss: Bei diesem Cluster hat sich über fünf Runden
gezeigt, dass "Layout in Worten beschreiben" bei komplexeren
Interaktionsmustern (mehrere Buttons, ein/ausklappen, Hover vs. Klick)
fehleranfälliger ist als bei einfachen Element-Anordnungen — hier hätte
sich ein Zwischenschritt gelohnt (kurze Skizze/Beschreibung der
Ziel-Interaktion bestätigen lassen, bevor implementiert wird), ähnlich
wie es bei den vorherigen Iterationen dieses Clusters schon vermutet
wurde.

## "Bewerte uns"-CTA und Treuekarte: Kundenbindungs-Module (2026-08-26)

Aus einer erneuten Ideenrunde ("was noch ändern, um attraktiver für
Kunden zu wirken") zwei Module ausgewählt, die beide auf
Kundenbindung/Reputationsmanagement zielen statt auf reine
Erstansprache:

- **"Bewerte uns"-CTA**: schließt eine Lücke, die beim Bau der
  Mock-Bewertungen entstanden ist — es gab Bewertungen *anzeigen*,
  aber keinen Aufruf, welche zu *hinterlassen*. Rein informativ
  gelöst (Platzhalter-Link href="#"), da kein echtes Google-
  Unternehmensprofil existiert.
- **Treuekarte**: rein illustrativ (6 von 10 Stempeln als Beispiel),
  bewusst *kein* Versuch, echtes Tracking vorzutäuschen — passt zum
  wiederkehrenden Prinzip dieses Prototyps, Funktionen ohne echtes
  Backend ehrlich als Demo/Beispiel zu kennzeichnen statt eine
  Nutzerkonto-Illusion zu erzeugen.

→ Möglicher Schluss: Beide Module sind Beispiele für eine Modul-
Kategorie, die im Katalog bisher unterrepräsentiert ist —
Kundenbindung/Retention für *bestehende* Kunden, nicht nur
Neukundengewinnung. Lohnt sich als eigene Kategorie im Modul-Katalog
zu ergänzen, sobald der nächste Branchen-Prototyp zeigt, ob das
branchenübergreifend gilt oder friseurspezifisch ist (Treuekarten sind
im Beauty-Bereich sehr verbreitet, in anderen Branchen evtl. weniger).

## Offene Fragen, noch nicht entschieden

- Welche der obigen Punkte gelten branchenübergreifend (vermutlich:
  Rechtstext-Seiten, Honeypot, robots.txt/sitemap.xml) und welche waren
  friseurspezifisch (z. B. genaue Service-Kategorien)? Erst nach 1–2
  weiteren Branchen-Prototypen zu beantworten.
- Ob echte Domain/DNS-Erkenntnisse (Ziel-Stack) grundsätzlich andere
  Learnings bringen als der GitHub-Pages-Testlauf.

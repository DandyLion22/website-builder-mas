# To-Do-Liste: Website-Builder-Startup starten

Diese Liste ist bewusst einfach gehalten. Du musst die Fachbegriffe aus der
Planungsdatei nicht verstehen — hier steht nur, was zu tun ist und warum.

---

## Phase 1 — Grundlagen klären

- [ ] Entscheiden: mit welchen 2–3 Branchen willst du zuerst starten?
      *(am besten dort, wo du selbst Kontakte hast — z. B. Handwerk,
      Gastronomie, Beratung)*
- [ ] Konto bei einem Hosting-Anbieter anlegen
      *(Empfehlung: Hetzner — deutsches Unternehmen)*
- [ ] Konto bei einem Domain-Anbieter anlegen
      *(Empfehlung: INWX)*
- [ ] Konto bei Cloudflare anlegen
      *(kümmert sich um Sicherheit/SSL für die Kunden-Websites)*
- [ ] Konto für eine Datenbank anlegen
      *(Empfehlung: Supabase — dort landen später alle Kundendaten)*

---

## Phase 2 — Rechtliches einmalig absichern

- [ ] Vorlage für ein Impressum besorgen
- [ ] Vorlage für eine Datenschutzerklärung besorgen
- [ ] Diese Vorlagen einmal von einer Anwältin/einem Anwalt kurz gegenchecken
      lassen *(einmalige Ausgabe, erspart dir später Ärger)*
- [ ] Für deine eigene Firma ebenfalls ein Impressum und eine
      Datenschutzerklärung erstellen
- [ ] Bei jedem Anbieter (Hosting, Datenbank, Analyse-Tool) prüfen, ob es ein
      Formular für einen "Auftragsverarbeitungsvertrag" gibt — meist im
      Kundenkonto zu finden, einmal ausfüllen und abschicken

---

## Phase 3 — Erste Website-Vorlagen bauen

- [ ] Für jede deiner Start-Branchen eine Beispiel-Website von Hand
      gestalten (Aufbau, Farben, Standard-Texte)
- [ ] Prüfen: sieht die Vorlage auf dem Handy auch gut aus?
- [ ] Prüfen: sind Texte gut lesbar (genug Kontrast zum Hintergrund)?
- [ ] Schriftarten nicht direkt von Google laden lassen, sondern selbst
      speichern *(wichtig für den Datenschutz)*

---

## Phase 3.1 — Erkenntnisse aus dem ersten kompletten Probelauf

Die Friseur-Vorlage wurde einmal komplett mit erfundenen, aber realistischen
Angaben durchgebaut und kostenlos veröffentlicht (Test-Adresse:
`https://dandylion22.github.io/website-builder-mas/`). Dabei ist aufgefallen,
was du bei den nächsten Vorlagen mitdenken solltest:

- [ ] Impressum und Datenschutz brauchen eigene Unterseiten, nicht nur einen
      Link ins Leere — das gehört ab jetzt zu jeder Vorlage dazu
- [ ] Beim Kunden-Erstgespräch künftig auch die **Rechtsform** erfragen
      (Einzelunternehmen, GmbH, …) — das Impressum sieht je nachdem anders
      aus
- [ ] Kontaktformulare bekommen serienmäßig einen einfachen Spam-Schutz
      (Honeypot) — nicht erst nachträglich pro Kunde einbauen
- [ ] Jede veröffentlichte Website braucht zusätzlich zwei technische
      Dateien (`robots.txt`, `sitemap.xml`) — fällt nur auf, wenn man wirklich
      einmal komplett veröffentlicht, nicht beim bloßen Anschauen der Seite
- [ ] Kostenlose Test-Veröffentlichung (GitHub Pages) hat gezeigt: SSL
      funktioniert automatisch und es geht schnell — der später geplante
      Hetzner/INWX/Cloudflare-Weg (siehe Phase 1) muss aber trotzdem einmal
      separat ausprobiert werden, sobald die Konten dafür stehen

---

## Phase 4 — Mit Claude Code das System bauen

- [ ] Die Planungsdatei an Claude Code übergeben
- [ ] Grundgerüst bauen lassen: den "Verwalter" (Orchestrator) und
      Platzhalter für alle anderen Helfer (Agenten)
- [ ] Zuerst nur den Teil fertigstellen, der das Kundengespräch am Anfang
      führt
- [ ] Danach den Teil ergänzen, der Texte schreibt und die Website
      zusammenbaut
- [ ] Erst wenn das läuft: Prüfung, Veröffentlichung und Rechnungsstellung
      ergänzen

---

## Phase 5 — Bereit für den ersten Kunden

- [ ] Angebots-/Vertragsvorlage erstellen
      *(darin auch klären: wem gehört die Website später?)*
- [ ] Festlegen, wie schnell du auf Änderungswünsche reagierst
      *(z. B. „innerhalb von 2 Werktagen")*
- [ ] Preise festlegen: einmalig für die Erstellung, laufend für Betreuung
- [ ] Einen Testkunden suchen (z. B. aus deinem Bekanntenkreis) und den
      gesamten Ablauf einmal komplett durchspielen

---

## Phase 6 — Laufender Betrieb

- [ ] Änderungswünsche der Kunden entgegennehmen, das System setzt sie um,
      du prüfst und gibst frei, bevor etwas live geht
- [ ] Regelmäßig checken, ob alle Kunden-Websites erreichbar sind
- [ ] Rechnungen verschicken
- [ ] Neue Branchen-Vorlagen ergänzen, sobald neue Kundentypen dazukommen

---

**Merkzettel für dich:** Du musst nicht alles auf einmal schaffen. Reihenfolge
der Phasen einhalten, jede Phase erst abschließen, bevor die nächste beginnt
— das verhindert, dass du dich verzettelst.

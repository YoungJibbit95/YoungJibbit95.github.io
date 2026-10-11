# Unabhängige G2-C-Browserevidenz

Alle 22 PNGs sind unveränderte Screenshots aus Chromium mit laufendem R3F-/Three-
Canvas. Aufnahme am 11.10.2026 im integrierten Arbeitsbaum, Basis `85a3204`, nach
den Pan-, Raycast-, Unicode- und Label-Reparaturen. Keine Mockups, Bildgenerierung
oder nachträgliche Pixelbearbeitung. Viewport-DPR des Desktop-Tests: 1.

| Dateien                                                                   | Zustand                                                     |
| ------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `g2c-overview-{390,768,1440,1920}.png`                                    | Übersicht, sieben sichtbare Systeme                         |
| `g2c-cluster-{390,768,1440,1920}.png`                                     | Physischer Fit auf Arbeit & Planung                         |
| `g2c-project-{390,768,1440,1920}.png`                                     | NovaCore-Projektfokus                                       |
| `g2c-portrait-{nexus,cerebri,novacore,nemisis,adventura,yjse,jarvis}.png` | Sieben unterschiedliche Architekturen, Desktop              |
| `g2c-micro-390.png`                                                       | Mobile Architekturdetails nach echtem Dolly-Zoom            |
| `g2c-dossier-390.png`                                                     | Offene, scrollbare DOM-Alternative                          |
| `g2c-empty-1440.png`                                                      | Leere Suche; Systeme tatsächlich ausgeblendet               |
| `observatory-axe.json`                                                    | Keine Axe-Verletzung im getesteten offenen mobilen Dossier  |
| `observatory-renderer-resources.json`                                     | Tatsächliche Renderer-Zähler, Weltwechsel und leerer Filter |
| `browser-tests.log`                                                       | Stabiler Testlauf, 16/16 ohne Retry                         |

Die Pixel-Assertions maskieren vorübergehend DOM-Overlays, um nur echte Canvas-
Pixel zu messen. Die hier gespeicherten PNGs zeigen dagegen die vollständige,
unmaskierte Benutzeransicht. Gemessene Kameraposen und Zustände werden in den
Playwright-Assertions geprüft; ein Screenshot allein beweist keine Funktion.

Zusätzlich belegt `focus-after.log` den 17. Test nach Reparatur verdeckten mobilen
Tastaturfokus: 1/1 ohne Retry, native Tab-Reihenfolge und Hit-Targets bei 390 und
768 px. Dieser gezielte Lauf folgt auf den vollständigen 16er-Lauf. Die Bilder
wurden vor dieser rein zugänglichkeitsbezogenen CSS-Korrektur erfasst.

Reproduktion nach Production Build über die bestehende Root-Konfiguration:

```powershell
npx playwright test tests/observatory.spec.ts tests/observatory.resources.spec.ts --workers=1
```

Root, G0, drei G1-Stressläufe, No-JavaScript-Prerender und finaler GitHub-HEAD sind
separate Integrationsgates. Siehe [QA-Bericht](../../../G2_C_QA.md).

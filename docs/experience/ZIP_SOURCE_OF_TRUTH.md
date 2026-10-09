# Original-Website als Source of Truth

Die 43 Dateien der vom Auftraggeber hochgeladenen `youngjibbit95.github.io.zip` wurden byteidentisch auf `feat/living-atlas-v3` überprüft. Der verifizierte Snapshot ist der GitHub-[Commit `93a581ee`](https://github.com/YoungJibbit95/YoungJibbit95.github.io/commit/93a581ee02e45545070063c8b139ed553cbfd959). Es gibt **keine weiteren ZIP-Restore-Arbeiten**.

## Integrität

- ZIP SHA-256: `b4aa73859c962ce907fa6eba4f71fca35acb40adb6d5c24677882c5800254f15`
- ZIP-Dateieinträge: **43** (ohne Verzeichnisse)
- Git-Blob-SHA-Abgleich (ZIP-Inhalte gegenüber Commit-Tree): **43/43 gleich**
- SHA-256 pro Datei: [ORIGINAL_ZIP_MANIFEST.sha256](./ORIGINAL_ZIP_MANIFEST.sha256)
- Zwei Nexus-Bilddateien und ihre `SOURCES.md` sind Bestandteil des identischen Snapshots.

Die Originalquelle ist bewusst im unveränderlichen Commit erhalten. Nachträgliche reine Formatierung darf Git-Blob-SHAs der Arbeitsbranch verändern; sie darf nicht als erneut fehlgeschlagener ZIP-Import missverstanden werden.

## Abgrenzung

`main` enthält weiterhin den eigenständigen veröffentlichten 0.3.0-Stand. Die im ZIP vorhandenen tieferen Weltkomponenten bleiben erhalten und werden gemäß Master Recode Plan **schrittweise** über eine neue, testbare Experience-Architektur weiterentwickelt. Die Dokumentation gehört ausschließlich ins Repository, nicht in die sichtbare Website.

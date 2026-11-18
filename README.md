# Music Assistant Filtercard

Lovelace-Karte für Home Assistant, die Music Assistant steuert. Sie funktioniert in **Abschnitten (Sections)**, im **Panel-Layout** und in klassischen Masonry-Ansichten.

- **Sidebar** mit Hauptplayer: Cover, Titel, Fortschritt (antippen zum Springen), Zurück/Play/Weiter, Shuffle, Wiederholen, Lautstärke, Stumm. Den Hauptplayer wechselst du über die Auswahl oben in der Sidebar.
- Die Sidebar lässt sich **einklappen** (Pfeil) und **fixieren** (Pin). Aufgeklappt schiebt sie den Inhalt immer zur Seite. Ist sie gelöst, klappt sie beim Tippen in den Hauptbereich wieder ein.
- **Automatische Ausrichtung**: Im Querformat (Desktop, iPad quer) steht die Sidebar links oder rechts, im Hochformat (iPhone, iPad hoch) oben oder unten. Auf schmalen Geräten wird sie kompakt.
- Die **Gruppier-Leiste** über dem Hauptbereich zeigt alle weiteren Player:
  - Antippen gruppiert den Player mit dem Hauptplayer, erneutes Antippen löst ihn wieder.
  - Spielt ein Player gerade etwas, zeigt die Leiste das mit Equalizer-Animation und Titel. Beim Gruppieren fragt die Karte nach, ob diese Wiedergabe ersetzt werden soll.
  - Langes Drücken oder Rechtsklick öffnet: Gruppieren/Lösen und „Als Hauptplayer verwenden“.
- **Tabs** mit frei definierbaren Filtern. In jedem Tab gibt es einen **Favoriten-Schalter** und eine Suche.
- **Kacheln** mit Cover, Größe passend zum Gerät. Bei Touch werden sie größer, Schrift ab 14,5 px.
  - **Antippen** spielt genau dieses Element ab. Läuft schon etwas, fragt die Karte: Ersetzen, Als nächstes oder Hinzufügen.
  - **Langes Drücken oder Rechtsklick**: Direkt abspielen, Zur Warteschlange hinzufügen, Als nächstes abspielen, Radiosender daraus erstellen. Bei Album, Playlist und Interpret außerdem „Öffnen“, das die enthaltenen Titel zeigt.
  - Die Liste lädt beim Scrollen automatisch nach.
- Im **Warteschlangen-Tab** kannst du Titel abspielen, nach oben oder unten schieben, als nächstes einreihen und entfernen. Außerdem lässt sich die ganze Warteschlange leeren.
- Die Karte übernimmt das **HA-Theme** (`--primary-color`, `--card-background-color`, `--primary-text-color` …). Die Tabs sind gestaltet wie die Einträge der HA-Seitenleiste (`--sidebar-text-color`, `--sidebar-selected-icon-color` …).

## Voraussetzungen

| Komponente | Wofür |
|---|---|
| Music-Assistant-Integration (Core) | Abspielen, Bibliothek |
| [mass_queue](https://github.com/droans/mass_queue) (HACS) | **Empfohlen.** Liefert die vollständigen Bibliotheksobjekte (Genre, Jahr) und wird für den Warteschlangen-Editor und die Titel von Playlisten/Alben gebraucht |

Ohne `mass_queue` laufen die Tabs über `music_assistant.get_library`. Dann stehen nur Name, Interpret, Album und Favorit zum Filtern zur Verfügung, und die Warteschlange ist nicht bearbeitbar.

## Installation

### Über HACS (empfohlen)

1. Öffne *HACS → ⋮ → Benutzerdefinierte Repositories*.
2. Trage `https://github.com/fugazzy/ma-filter-card` ein und wähle den Typ **Dashboard**.
3. Suche „Music Assistant Filtercard“ und lade sie herunter. HACS registriert die Ressource selbst.
4. Lade den Browser neu und füge die Karte hinzu (`custom:ma-filter-card`).

Updates zeigt HACS dir dann wie bei anderen Karten an.

### Manuell

1. Kopiere `ma-filter-card.js` nach `/config/www/ma-filter-card/ma-filter-card.js`.
2. Lege unter *Einstellungen → Dashboards → ⋮ → Ressourcen* eine neue Ressource an: URL `/local/ma-filter-card/ma-filter-card.js?v=0.4.0`, Typ **JavaScript-Modul**.
3. Lade den Browser neu und füge die Karte hinzu.

Nach einem Update erhöhst du `?v=` in der Ressourcen-URL, damit Browser und Companion-App die neue Version laden.

## Beispiel

```yaml
type: custom:ma-filter-card
entity: media_player.esszimmer_3_music_assistant   # Start-Hauptplayer (optional)
players:                                           # optional – sonst alle MA-Player
  - media_player.esszimmer_3_music_assistant
  - media_player.badezimmer_4_music_assistant
  - media_player.schlafzimmer_4_music_assistant
  - entity: media_player.hobbyraum_music_assistant
    name: Hobbykeller
  - media_player.soundbar_music_assistant
sidebar:
  position: auto            # auto | left | right | top | bottom
  position_landscape: left  # bei auto im Querformat
  position_portrait: top    # bei auto im Hochformat
  pinned: true
tabs:
  - type: playlists
  - type: albums
    name: Rock
    icon: mdi:guitar-electric
    filter: 'genre:*rock* and not artist:"Pink Floyd"'
  - type: tracks
    name: Lieblingstitel
    favorites: true          # Favoriten-Schalter beim Öffnen an
  - type: playlist
    name: 70er
    playlist: 70ties         # oder uri: library://playlist/277
  - type: recent
    media_type: album
    limit: 60
  - type: radio
  - type: queue
```

## Visueller Editor

Ab Version 0.2.0 lässt sich die Karte komplett über *Karte bearbeiten* einrichten, ganz ohne YAML:

- **Allgemein:** Hauptplayer beim Start, Verhalten, wenn schon etwas läuft, Sidebar-Position (Quer-/Hochformat), fixiert/eingeklappt, Kachelgröße, Gruppier-Leiste.
- **Mediaplayer:** alle Music-Assistant-Player mit Häkchen zum Ein- und Ausblenden und Pfeilen für die Reihenfolge.
- **Tabs:** Tabs hinzufügen (Inhaltstyp wählen), löschen (mit Rückfrage), nach oben oder unten verschieben. Jeder Tab hat Name, Symbol, Inhalt, Sortierung, Maximalanzahl, Playlist bzw. Medientyp und die Optionen für den Favoriten-Schalter.
- **Filter-Baukasten** pro Tab:
  - **+ Bedingung** fügt eine Zeile aus Feld, Operator und Wert hinzu, zum Beispiel *Genre · enthält / Muster · Rock\**.
  - **+ Gruppe** fügt eine verschachtelte Gruppe hinzu, beliebig tief.
  - Jede Gruppe verknüpft ihre Einträge mit **UND** oder **ODER**.
  - **NICHT** verneint eine einzelne Bedingung oder eine ganze Gruppe.
  - **×** entfernt die Bedingung oder Gruppe.
  - Darunter steht der erzeugte **Ausdruck**. Er lässt sich auch direkt bearbeiten, und der Baukasten übernimmt die Änderung. Ist ein Ausdruck fehlerhaft, zeigt der Editor die Fehlermeldung an.
- **Erweitert:** Eintrags-IDs, MA-Server-URL, Karten-ID, Höhe, maximale Anzahl durchsuchter Einträge.

Der Editor speichert Filter als Ausdruck (`filter: 'genre:*rock* and not artist:"Pink Floyd"'`). Vorhandene YAML-Filter liest er ebenfalls ein.


**Vorschläge beim Tippen:** Im Feld *Symbol* erscheinen passende Icons, auch über deutsche Begriffe wie „gitarre“ oder „party“. Läuft im HA-Dialog die eingebaute Symbolauswahl, wird diese verwendet. In den Feldern *Playlist* sowie *Interpret*, *Album* und *Name* einer Filterbedingung wird die Bibliothek durchsucht. Ein Treffer lässt sich per Klick, Tipp oder mit Pfeiltasten und Enter übernehmen. Bei einer Playlist wird dabei auch die URI eingetragen.

## Karten-Optionen

| Option | Standard | Beschreibung |
|---|---|---|
| `entity` | erster spielender Player | Hauptplayer beim ersten Öffnen. Danach merkt sich die Karte die letzte Wahl pro Gerät. |
| `players` | alle MA-Player | Liste von Entitäten oder `{entity, name, icon}` |
| `exclude_players` | – | Player, die ausgeblendet werden |
| `tabs` | Playlisten, Alben, Titel, Neu, Radio, Warteschlange | siehe unten |
| `sidebar.position` | `auto` | `auto`, `left`, `right`, `top`, `bottom` |
| `sidebar.position_landscape` / `position_portrait` | `left` / `top` | Position bei `auto` |
| `sidebar.width` | `auto` | Breite in px bei seitlicher Sidebar |
| `sidebar.pinned` / `collapsed` | `true` / `false` | Startzustand. Danach wird der Zustand pro Gerät gespeichert. Die aufgeklappte Sidebar verdeckt nie den Hauptbereich. Ist sie nicht fixiert, klappt sie bei einem Tipp in den Hauptbereich wieder ein. |
| `sidebar.collapsible` | `true` | `false` blendet die Pin- und Einklapp-Knöpfe aus |
| `when_playing` | `ask` | Verhalten beim Antippen, wenn schon etwas läuft: `ask`, `replace`, `next`, `add`, `play` |
| `tile_size` | `auto` | `auto` (wächst mit dem Platz bis 260 px), `small`, `medium`, `large`, `xlarge` oder eine Zahl in px |
| `volume_step` | `5` | Schrittweite der Tasten Lauter/Leiser in Prozent |
| `height` | automatisch | z. B. `700` oder `"80vh"`. Im Panel füllt die Karte den Bildschirm, in Abschnitten die eingestellten Zeilen. |
| `show_group_bar` | `true` | Gruppier-Leiste ein/aus |
| `page_size` | `100` | Einträge pro Nachlade-Schritt |
| `max_scan` | `3000` | Höchstzahl an Einträgen, die für einen Filter durchsucht werden |
| `queue_limit` / `queue_before` | `200` / `5` | Warteschlange: Titel nach bzw. vor dem aktuellen |
| `config_entry_id` | automatisch | Music-Assistant-Instanz. Nur nötig für Nicht-Admin-Benutzer (siehe unten). |
| `mass_queue_entry_id` | automatisch | mass_queue-Instanz, dito |
| `use_mass_queue` | `true` | `false` erzwingt `get_library` |
| `ma_url` | automatisch | Basis-URL des MA-Servers für Cover über `/imageproxy`, z. B. `http://192.168.10.2:8095` |
| `id` | `default` | Mehrere Karten mit eigener Speicherung (Player, Tab, Sidebar) |
| `language` | HA-Sprache | `de` oder `en` |

## Tabs

| `type` | Inhalt | Extra-Optionen |
|---|---|---|
| `playlists` | Playlisten | |
| `albums` | Alben | `album_type: [album, single, compilation, ep]` |
| `tracks` | Titel | |
| `artists` | Interpreten | |
| `playlist` | Titel **genau einer** Playlist | `uri: library://playlist/…` oder `playlist: <Name>` |
| `recent` | Neu hinzugefügt | `media_type: album \| track \| playlist \| artist \| radio` |
| `radio` | Radiosender | |
| `queue` | Warteschlange bearbeiten | |

Gemeinsame Optionen: `name`, `icon`, `filter`, `favorites` (Startzustand des Favoriten-Schalters), `show_favorites_toggle` (Standard `true`), `order_by` (z. B. `name`, `name_desc`, `timestamp_added_desc`, `last_played_desc`, `play_count_desc`, `year_desc`, `random`), `limit`, `max_scan`.

## Filter

Filter funktionieren in allen Tab-Typen außer `queue`. Du kannst sie als **Ausdruck** oder als **YAML-Struktur** schreiben.

### Ausdruck

```yaml
filter: 'genre:*rock* and (year>=1990 or like:true) and not artist:"Pink Floyd"'
```

| Element | Bedeutung |
|---|---|
| `feld:wert` | enthält (ohne Platzhalter) bzw. passt auf Muster (mit Platzhaltern) |
| `feld=wert` | exakt (Groß-/Kleinschreibung und Akzente egal) |
| `feld!=wert` | passt nicht |
| `*` / `?` | beliebig viele Zeichen / genau ein Zeichen, z. B. `name:B?hemian*` |
| `/regex/` | regulärer Ausdruck, z. B. `album:/live|unplugged/` |
| `year>=1990`, `year<1980`, `year:1970-1979` | Zahlenvergleich bzw. Bereich |
| `like:true`, `favorit:nein` | Likes/Favoriten aus Music Assistant |
| `and` / `und`, `or` / `oder`, `not` / `nicht`, `( … )` | Verknüpfungen. Leerzeichen zwischen Bedingungen bedeutet `and`. |
| Wort ohne Feld | sucht im Namen |

Felder: `name` (`titel`), `album`, `artist` (`interpret`), `genre`, `favorite` (`favorit`, `like`), `year` (`jahr`), `type` (Albumtyp), `owner`, `provider`.

### YAML

```yaml
filter:
  and:
    - genre: ["*rock*", "*metal*"]     # Liste = oder
    - not:
        artist: "Pink Floyd"
    - or:
        - year: ">=1990"
        - favorite: true
```

### Hinweise zu den Daten

- **Genre** kommt aus den Music-Assistant-Metadaten. Das Feld ist nur gefüllt, wenn der Anbieter oder der Metadaten-Scan Genres liefert. Bei Titeln wird auch das Genre des Albums berücksichtigt.
- **Bewertung**: Die Karte nutzt nur die Likes (Favoriten) aus Music Assistant. Eine Sternebewertung liefert MA nicht, deshalb gibt es kein Sterne-Feld.
- Die Karte filtert **Favoriten** und die Suche direkt auf dem Server. Alle anderen Felder filtert sie im Browser: Sie lädt die Bibliothek seitenweise, bis genug Treffer da sind (höchstens `max_scan` Einträge).

## Hinweise

- **Nicht-Admin-Benutzer** (z. B. Wandtablets) dürfen die Integrationsliste nicht lesen. Trage für sie `config_entry_id` und `mass_queue_entry_id` direkt ein (*Einstellungen → Geräte & Dienste → Integration → ⋮ → Eintrags-ID kopieren*).
- **Cover**: Einige Bilder (z. B. Playlist-Collagen, lokale Dateien) liefert Music Assistant nur über seinen eigenen `/imageproxy` aus. Läuft HA über **HTTPS** und MA über **HTTP**, blockiert der Browser diese Bilder (Mixed Content). Dann erscheint ein Platzhalter-Symbol, oder du setzt `ma_url` auf eine HTTPS-Adresse.
- **Gruppieren** nutzt `media_player.join` und `media_player.unjoin`. Ob das klappt, hängt vom Player-Typ ab (AirPlay, Chromecast und Sendspin gruppieren in MA problemlos; ein MA-Gruppenplayer als Hauptplayer kann keine weiteren Mitglieder aufnehmen).

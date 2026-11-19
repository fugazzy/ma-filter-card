/* Music Assistant Filtercard – Lovelace-Karte für Home Assistant + Music Assistant. Doku: README.md */

const MAFC_VERSION = "0.7.0";

/* ------------------------------------------------------------------ i18n */

const STRINGS = {
  de: {
    playlists: "Playlisten", albums: "Alben", tracks: "Titel", artists: "Interpreten",
    recent: "Neu hinzugefügt", radio: "Radiosender", queue: "Warteschlange", playlist: "Playlist",
    nothing_playing: "Keine Wiedergabe", idle: "Bereit", favorites: "Favoriten",
    search: "Suchen …", loading: "Lade …", no_items: "Keine Einträge gefunden",
    scanned: "durchsucht", play_now: "Direkt abspielen", play_next: "Als nächstes abspielen",
    add_queue: "Zur Warteschlange hinzufügen", replace: "Wiedergabe ersetzen", play_replace: "Abspielen (Warteschlange ersetzen)", play_all: "Alle abspielen", start_radio: "Radiosender daraus erstellen",
    open: "Öffnen", cancel: "Abbrechen", already_playing: "Es läuft bereits etwas",
    what_to_do: "Was soll mit der aktuellen Wiedergabe passieren?",
    group_replace_title: "spielt gerade", group_replace_text: "Die Wiedergabe dort wird durch die Gruppierung ersetzt.",
    group_join: "Gruppieren", group_leave: "Aus Gruppe lösen", make_main: "Als Hauptplayer verwenden",
    all_players: "Alle Player", set_main: "Als Hauptplayer", join: "Gruppieren", leave: "Lösen", close: "Schließen",
    ungroup_all: "Alle lösen", group_all: "Alle gruppieren", main_player: "Hauptplayer", back: "Zurück",
    played: "Zuletzt gespielt", like: "Gefällt mir", unlike: "Gefällt mir entfernen", liked: "Gefällt mir", unliked: "Gefällt mir entfernt",
    song_info: "Songinfo", f_title: "Titel", f_artist: "Interpret", f_album: "Album", f_year: "Jahr", f_duration: "Dauer", f_genre: "Genre", f_source: "Quelle", f_player: "Player",
    queue_upcoming: "Titel in der Warteschlange", group_all_q: "Andere Player spielen gerade. Ihre Wiedergabe wird ersetzt.",
    collapse: "Einklappen", expand: "Ausklappen", pin: "Fixieren", unpin: "Lösen (klappt automatisch ein)", mute: "Stumm", vol_down: "Leiser", vol_up: "Lauter",
    queue_needs_mq: "Für die Warteschlange wird die Integration „mass_queue“ benötigt.",
    queue_empty: "Die Warteschlange ist leer.", clear_queue: "Warteschlange leeren",
    move_up: "Nach oben", move_down: "Nach unten", move_next: "Als nächstes", remove: "Entfernen",
    refresh: "Aktualisieren", error: "Fehler", no_player: "Kein Music-Assistant-Player gefunden",
    no_entry: "Music-Assistant-Instanz nicht gefunden. Bitte config_entry_id in der Karte setzen.",
    grouped_with: "gruppiert mit", not_groupable: "Dieser Player kann nicht gruppiert werden",
    filter_error: "Filterfehler",
  },
  en: {
    playlists: "Playlists", albums: "Albums", tracks: "Tracks", artists: "Artists",
    recent: "Recently added", radio: "Radio", queue: "Queue", playlist: "Playlist",
    nothing_playing: "Nothing playing", idle: "Idle", favorites: "Favorites",
    search: "Search …", loading: "Loading …", no_items: "No items found",
    scanned: "scanned", play_now: "Play now", play_next: "Play next",
    add_queue: "Add to queue", replace: "Replace playback", play_replace: "Play (replace queue)", play_all: "Play all", start_radio: "Start radio from this",
    open: "Open", cancel: "Cancel", already_playing: "Something is already playing",
    what_to_do: "What should happen to the current playback?",
    group_replace_title: "is playing", group_replace_text: "Its playback will be replaced by the group.",
    group_join: "Group", group_leave: "Remove from group", make_main: "Use as main player",
    all_players: "All players", set_main: "Make main player", join: "Group", leave: "Ungroup", close: "Close",
    ungroup_all: "Ungroup all", group_all: "Group all", main_player: "Main player", back: "Back",
    played: "Recently played", like: "Like", unlike: "Remove like", liked: "Liked", unliked: "Like removed",
    song_info: "Song info", f_title: "Title", f_artist: "Artist", f_album: "Album", f_year: "Year", f_duration: "Duration", f_genre: "Genre", f_source: "Source", f_player: "Player",
    queue_upcoming: "tracks in queue", group_all_q: "Other players are playing. Their playback will be replaced.",
    collapse: "Collapse", expand: "Expand", pin: "Pin", unpin: "Unpin (auto-collapse)", mute: "Mute", vol_down: "Volume down", vol_up: "Volume up",
    queue_needs_mq: "The queue editor requires the “mass_queue” integration.",
    queue_empty: "The queue is empty.", clear_queue: "Clear queue",
    move_up: "Move up", move_down: "Move down", move_next: "Play next", remove: "Remove",
    refresh: "Refresh", error: "Error", no_player: "No Music Assistant player found",
    no_entry: "Music Assistant instance not found. Please set config_entry_id on the card.",
    grouped_with: "grouped with", not_groupable: "This player cannot be grouped",
    filter_error: "Filter error",
  },
};

/* ------------------------------------------------------------ constants */

const TAB_TYPES = {
  playlists: { media_type: "playlist", icon: "mdi:playlist-music", order_by: "name" },
  albums: { media_type: "album", icon: "mdi:album", order_by: "name" },
  tracks: { media_type: "track", icon: "mdi:music-note", order_by: "name" },
  artists: { media_type: "artist", icon: "mdi:account-music", order_by: "name" },
  recent: { media_type: "album", icon: "mdi:new-box", order_by: "timestamp_added_desc" },
  radio: { media_type: "radio", icon: "mdi:radio", order_by: "name" },
  playlist: { media_type: "track", icon: "mdi:playlist-play" },
  played: { media_type: "track", icon: "mdi:history" },
  queue: { icon: "mdi:playlist-edit" },
};
const PLURAL = { album: "albums", track: "tracks", playlist: "playlists", radio: "radios", artist: "artists" };
const TYPE_ICON = { album: "mdi:album", track: "mdi:music-note", playlist: "mdi:playlist-music", radio: "mdi:radio", artist: "mdi:account-music" };
const FEATURE_GROUPING = 524288;
const MINI = 72; // Größe der eingeklappten Sidebar (px)

const DEFAULT_TABS = [
  { type: "playlists" }, { type: "albums" }, { type: "tracks" },
  { type: "recent" }, { type: "radio" }, { type: "queue" },
];

/* --------------------------------------------------------------- helpers */

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fold = (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const fmtTime = (s) => {
  if (s == null || isNaN(s) || s < 0) return "";
  s = Math.floor(s);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(sec).padStart(2, "0");
};
const icon = (name, cls = "") => `<ha-icon class="${cls}" icon="${esc(name)}"></ha-icon>`;

/* ======================================================== filter engine
 *
 * Zwei gleichwertige Schreibweisen:
 *
 * 1) Ausdruck (String):
 *      genre:Rock* and not artist:"Pink Floyd" or (year>=1990 and favorite:true)
 *    Operatoren: and/und/&&, or/oder/||, not/nicht/!, Klammern. Nebeneinander = and.
 *    Feld-Operatoren:  :  (enthält / Platzhalter)   =  (exakt)   !=  (nicht)
 *                      >= <= > <  (Zahlen: year)     year:1970-1979 (Bereich)
 *    Werte: * = beliebig viele Zeichen, ? = genau ein Zeichen, /regex/ = regulärer Ausdruck
 *    Ein Wort ohne Feld sucht im Namen.
 *
 * 2) YAML-Objekt:
 *      and:
 *        - genre: "Rock*"
 *        - not: { artist: "Pink Floyd" }
 *        - or:
 *            - year: ">=1990"
 *            - favorite: true
 */

const FIELD_ALIASES = {
  name: "name", title: "name", titel: "name",
  album: "album",
  artist: "artist", interpret: "artist", kuenstler: "artist", künstler: "artist",
  genre: "genre", genres: "genre",
  favorite: "favorite", favourite: "favorite", favorit: "favorite", fav: "favorite", like: "favorite", likes: "favorite",
  year: "year", jahr: "year",
  type: "type", typ: "type", album_type: "type",
  owner: "owner", provider: "provider",
};
const NUMERIC = new Set(["year"]);

function tokenizeFilter(str) {
  const out = [];
  const re = /\s*(\(|\)|&&|\|\||"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[^\s()"']+(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|[^\s()]+)/y;
  let m;
  while ((m = re.exec(str)) !== null) {
    if (!m[1]) break;
    out.push(m[1]);
    if (re.lastIndex >= str.length) break;
  }
  return out;
}
const unquote = (t) => (/^(["']).*\1$/.test(t) ? t.slice(1, -1).replace(/\\(.)/g, "$1") : t);

function parseFilterString(str) {
  const toks = tokenizeFilter(str);
  let i = 0;
  const peek = () => toks[i];
  const isKw = (t, kws) => t != null && kws.includes(t.toLowerCase());
  const OR = ["or", "oder", "||"], AND = ["and", "und", "&&"], NOT = ["not", "nicht", "!"];

  function parseOr() {
    const parts = [parseAnd()];
    while (isKw(peek(), OR)) { i++; parts.push(parseAnd()); }
    return parts.length === 1 ? parts[0] : { or: parts };
  }
  function parseAnd() {
    const parts = [parseNot()];
    for (;;) {
      const t = peek();
      if (t == null || t === ")" || isKw(t, OR)) break;
      if (isKw(t, AND)) i++;
      parts.push(parseNot());
    }
    return parts.length === 1 ? parts[0] : { and: parts };
  }
  function parseNot() {
    if (isKw(peek(), NOT)) { i++; return { not: parseNot() }; }
    return parsePrimary();
  }
  function parsePrimary() {
    const t = toks[i++];
    if (t == null) throw new Error("Ausdruck endet unerwartet");
    if (t === "(") {
      const e = parseOr();
      if (toks[i++] !== ")") throw new Error("„)“ fehlt");
      return e;
    }
    if (t === ")") throw new Error("Unerwartete „)“");
    if (/^["']/.test(t)) return { field: "name", op: ":", value: unquote(t) };
    const m = /^([A-Za-zÄÖÜäöüß_]+)(>=|<=|!=|=|>|<|:)(.*)$/.exec(t);
    if (!m) return { field: "name", op: ":", value: t };
    const field = FIELD_ALIASES[m[1].toLowerCase()];
    if (!field) throw new Error(`Unbekanntes Feld „${m[1]}“`);
    let op = m[2], value = m[3];
    if (value === "" && toks[i] != null && /^["']/.test(toks[i])) value = toks[i++];
    value = unquote(value);
    return makeCond(field, op, value);
  }
  const ast = toks.length ? parseOr() : null;
  if (i < toks.length) throw new Error(`Unerwartet: „${toks[i]}“`);
  return ast;
}

function makeCond(field, op, value) {
  if (op === ":" && typeof value === "string") {
    const m = /^\s*(>=|<=|!=|=|>|<)\s*(.*)$/.exec(value);
    if (m) { op = m[1]; value = m[2]; }
  }
  return { field, op, value };
}

function toAst(f) {
  if (f == null || f === "") return null;
  if (typeof f === "string") return parseFilterString(f);
  if (Array.isArray(f)) return { and: f.map(toAst).filter(Boolean) };
  if (typeof f !== "object") throw new Error("Ungültiger Filter");
  const parts = [];
  for (const [k, v] of Object.entries(f)) {
    const key = k.toLowerCase();
    if (key === "and" || key === "und") parts.push({ and: [].concat(v).map(toAst).filter(Boolean) });
    else if (key === "or" || key === "oder") parts.push({ or: [].concat(v).map(toAst).filter(Boolean) });
    else if (key === "not" || key === "nicht") parts.push({ not: toAst(v) });
    else if (key === "expr" || key === "expression" || key === "ausdruck") parts.push(parseFilterString(String(v)));
    else {
      const field = FIELD_ALIASES[key];
      if (!field) throw new Error(`Unbekanntes Feld „${k}“`);
      if (Array.isArray(v)) parts.push({ or: v.map((x) => makeCond(field, ":", x)) });
      else parts.push(makeCond(field, ":", v));
    }
  }
  return parts.length === 1 ? parts[0] : { and: parts };
}

const patternCache = new Map();
function compilePattern(op, value) {
  const key = op + "\u0000" + value;
  if (patternCache.has(key)) return patternCache.get(key);
  let fn;
  const v = String(value);
  const rx = /^\/(.*)\/([a-z]*)$/.exec(v);
  if (rx) {
    const r = new RegExp(rx[1], rx[2].includes("i") ? rx[2] : rx[2] + "i");
    fn = (s) => r.test(String(s ?? ""));
  } else {
    const fv = fold(v);
    if (/[*?]/.test(fv)) {
      const r = new RegExp("^" + fv.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$", "s");
      fn = (s) => r.test(fold(s));
    } else if (op === "=" || op === "!=") {
      fn = (s) => fold(s) === fv;
    } else {
      fn = (s) => fold(s).includes(fv);
    }
  }
  patternCache.set(key, fn);
  return fn;
}

function fieldValues(item, field) {
  switch (field) {
    case "name": return [item.name, item.version ? `${item.name} (${item.version})` : null].filter(Boolean);
    case "album": return item.album ? [item.album] : [];
    case "artist": return item.artists || [];
    case "genre": return item.genres || [];
    case "type": return [item.album_type, item.media_type].filter(Boolean);
    case "owner": return item.owner ? [item.owner] : [];
    case "provider": return item.providers || [];
    default: return [];
  }
}

function evalFilter(ast, item) {
  if (!ast) return true;
  if (ast.and) return ast.and.every((a) => evalFilter(a, item));
  if (ast.or) return ast.or.some((a) => evalFilter(a, item));
  if (ast.not) return !evalFilter(ast.not, item);
  const { field, op, value } = ast;
  if (field === "favorite") {
    const want = !/^(false|nein|no|0|off|aus)$/i.test(String(value).trim());
    const res = !!item.favorite === want;
    return op === "!=" ? !res : res;
  }
  if (NUMERIC.has(field)) {
    const n = item.year;
    if (n == null) return false;
    const vs = String(value).trim();
    const range = /^(\d+(?:[.,]\d+)?)\s*-\s*(\d+(?:[.,]\d+)?)$/.exec(vs);
    if (range) return n >= parseFloat(range[1].replace(",", ".")) && n <= parseFloat(range[2].replace(",", "."));
    const x = parseFloat(vs.replace(",", "."));
    if (isNaN(x)) return false;
    switch (op) {
      case ">=": return n >= x;
      case "<=": return n <= x;
      case ">": return n > x;
      case "<": return n < x;
      case "!=": return n !== x;
      case "=": return n === x;
      default: return n === x;
    }
  }
  const vals = fieldValues(item, field);
  const test = compilePattern(op, value);
  if (op === "!=") return !vals.some(test);
  return vals.some(test);
}

/* ================================================================ card */

class MusicAssistantFilterCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._tabState = [];
    this._activeTab = 0;
    this._ui = { collapsed: false, pinned: true };
    this._maBase = null;
    this._entries = null;
    this._lastSig = "";
    this._size = { w: 0, h: 0 };
  }

  /* ---------------- HA card API ---------------- */

  static getConfigElement() { return document.createElement("ma-filter-card-editor"); }

  static getStubConfig() {
    return {
      tabs: [
        { type: "playlists" },
        { type: "albums", name: "Rock", filter: "genre:*rock*" },
        { type: "tracks", name: "Lieblingstitel", favorites: true },
        { type: "recent" },
        { type: "radio" },
        { type: "queue" },
      ],
    };
  }

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Ungültige Konfiguration");
    const tabs = (config.tabs && config.tabs.length ? config.tabs : DEFAULT_TABS).map((t, i) => {
      const type = t.type || "albums";
      if (!TAB_TYPES[type]) throw new Error(`Tab ${i + 1}: unbekannter Typ „${type}“`);
      if (type === "playlist" && !t.uri && !t.playlist) throw new Error(`Tab ${i + 1}: „uri“ oder „playlist“ fehlt`);
      let ast = null;
      try { ast = toAst(t.filter); } catch (e) { throw new Error(`Tab ${i + 1}: Filter – ${e.message}`); }
      return { ...t, type, _ast: ast };
    });
    const sb = config.sidebar || {};
    this._config = {
      ...config,
      tabs,
      sidebar: {
        position: sb.position || "auto",
        position_landscape: sb.position_landscape || "left",
        position_portrait: sb.position_portrait || "top",
        width: sb.width || "auto",
        collapsed: !!sb.collapsed,
        pinned: sb.pinned !== false,
        collapsible: sb.collapsible !== false,
      },
      track_tap: config.track_tap || "menu", // menu | play  (Titel, Radiosender)
      card_background: !!config.card_background,
      collection_tap: config.collection_tap || "ask", // ask | open | play  (Alben, Playlisten, Interpreten)
      when_playing: config.when_playing || "ask", // ask | replace | next | add | play
      tile_size: config.tile_size || "auto",
      page_size: config.page_size || 100,
      max_scan: config.max_scan || 3000,
      queue_limit: config.queue_limit || 200,
      show_group_bar: config.show_group_bar !== false,
    };
    this._storeKey = "mafc:" + (config.id || "default");
    const saved = this._load();
    this._ui.collapsed = saved.collapsed ?? this._config.sidebar.collapsed;
    this._ui.pinned = saved.pinned ?? this._config.sidebar.pinned;
    this._activeTab = Math.min(saved.tab ?? 0, tabs.length - 1);
    this._mainEntity = saved.main || null;
    this._tabState = tabs.map(() => null);
    if (this._built) this._build();
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (!this._config) return;
    if (first || !this._built) this._build();
    this._onHass();
  }
  get hass() { return this._hass; }

  getCardSize() { return 12; }
  getGridOptions() { return { columns: "full", rows: 10, min_rows: 6, min_columns: 6 }; }
  getLayoutOptions() { return { grid_columns: "full", grid_rows: 10, grid_min_rows: 6 }; }

  connectedCallback() {
    if (this._config && this._hass && !this._built) this._build();
    this._startTimers();
  }
  disconnectedCallback() {
    clearInterval(this._tick);
    this._tick = null;
    this._ro?.disconnect();
    this._io?.disconnect();
    this._built = false;
  }

  /* ---------------- persistence ---------------- */

  _load() { try { return JSON.parse(localStorage.getItem(this._storeKey) || "{}"); } catch (e) { return {}; } }
  _save() {
    try {
      localStorage.setItem(this._storeKey, JSON.stringify({
        collapsed: this._ui.collapsed, pinned: this._ui.pinned, tab: this._activeTab, main: this._mainEntity,
      }));
    } catch (e) { /* ignore */ }
  }

  _t(k) {
    const lang = (this._config?.language || this._hass?.locale?.language || this._hass?.language || "de").slice(0, 2);
    return (STRINGS[lang] || STRINGS.en)[k] ?? STRINGS.de[k] ?? k;
  }

  /* ---------------- players ---------------- */

  _isMaPlayer(st) {
    if (!st || !st.entity_id.startsWith("media_player.")) return false;
    const a = st.attributes || {};
    return a.app_id === "music_assistant" || a.mass_player_type != null || a.mass_player_id != null;
  }

  _players() {
    const states = this._hass.states;
    let list;
    if (Array.isArray(this._config.players) && this._config.players.length) {
      list = this._config.players.map((p) => (typeof p === "string" ? { entity: p } : p)).filter((p) => states[p.entity]);
    } else {
      list = Object.values(states).filter((s) => this._isMaPlayer(s)).map((s) => ({ entity: s.entity_id }))
        .sort((a, b) => this._pname(a.entity).localeCompare(this._pname(b.entity)));
    }
    const excl = new Set(this._config.exclude_players || []);
    return list.filter((p) => !excl.has(p.entity) && states[p.entity].state !== "unavailable");
  }

  _pname(entity) {
    const cfg = (this._config.players || []).find((p) => typeof p === "object" && p.entity === entity);
    return cfg?.name || this._hass.states[entity]?.attributes.friendly_name || entity;
  }

  _main() {
    const players = this._players();
    if (this._mainEntity && players.some((p) => p.entity === this._mainEntity)) return this._mainEntity;
    const cfg = this._config.entity || this._config.main_player;
    if (cfg && this._hass.states[cfg]) return cfg;
    const playing = players.find((p) => this._hass.states[p.entity].state === "playing");
    return (playing || players[0])?.entity || null;
  }

  _setMain(entity) {
    this._mainEntity = entity;
    this._save();
    this._lastSig = "";
    this._onHass();
    if (this._config.tabs[this._activeTab]?.type === "queue") this._loadQueue(true);
  }

  /* ---------------- service plumbing ---------------- */

  async _svc(domain, service, data = {}, target, response = false) {
    const msg = { type: "call_service", domain, service, service_data: data };
    if (target) msg.target = target;
    if (response) msg.return_response = true;
    const r = await this._hass.callWS(msg);
    return response ? r?.response : r;
  }

  async _resolveEntries() {
    if (this._entries) return this._entries;
    if (this._entriesPromise) return this._entriesPromise;
    this._entriesPromise = (async () => {
      const e = { ma: this._config.config_entry_id || null, mq: this._config.mass_queue_entry_id || null };
      const find = async (domain) => {
        try {
          const r = await this._hass.callWS({ type: "config_entries/get", domain });
          return (r || []).find((x) => x.state === "loaded")?.entry_id || null;
        } catch (err) { return null; }
      };
      if (!e.ma) e.ma = await find("music_assistant");
      if (!e.mq && this._config.use_mass_queue !== false) e.mq = await find("mass_queue");
      if (this._config.use_mass_queue === false) e.mq = null;
      this._entries = e;
      if (this._config.ma_url) this._maBase = String(this._config.ma_url).replace(/\/+$/, "");
      else if (e.ma) this._learnMaBase(e.ma);
      return e;
    })();
    return this._entriesPromise;
  }

  async _learnMaBase(ma) {
    for (const media_type of ["playlist", "album", "radio"]) {
      try {
        const r = await this._svc("music_assistant", "get_library", { config_entry_id: ma, media_type, limit: 5 }, null, true);
        for (const it of r?.items || []) {
          const m = /^(https?:\/\/[^/]+)\/imageproxy/.exec(it.image || "");
          if (m) { this._maBase = m[1]; this._refreshImages(); return; }
        }
      } catch (e) { /* ignore */ }
    }
  }

  _imgUrl(img) {
    if (!img) return null;
    if (typeof img === "string") return img.replace(/([?&]size=)0\b/, "$1300");
    const path = img.path;
    if (!path) return null;
    if (img.remotely_accessible || /^data:/.test(path)) return path;
    if (!this._maBase) return null;
    if (img.proxy_id) return `${this._maBase}/imageproxy/${img.proxy_id}?size=300`;
    return `${this._maBase}/imageproxy?path=${encodeURIComponent(path)}&provider=${encodeURIComponent(img.provider || "")}&size=300`;
  }

  _normalize(raw) {
    if (raw.media_title !== undefined) { // mass_queue-Format (Playlist-/Album-Titel, Queue)
      return {
        uri: raw.media_content_id, media_type: "track", name: raw.media_title,
        artists: raw.media_artist ? [raw.media_artist] : [], album: raw.media_album_name || "",
        image: raw.local_image_encoded || raw.media_image || null, favorite: !!raw.favorite,
        duration: raw.duration, genres: [], year: null, position: raw.position,
        queue_item_id: raw.queue_item_id,
      };
    }
    const md = raw.metadata || {};
    let image = null;
    if (typeof raw.image === "string") image = raw.image;
    else if (raw.image) image = raw.image;
    else if (md.images?.length) image = md.images.find((i) => i.type === "thumb") || md.images[0];
    else if (raw.album?.image) image = raw.album.image;
    else if (raw.album?.metadata?.images?.length) image = raw.album.metadata.images[0];
    const genres = [...(md.genres || []), ...(raw.album?.metadata?.genres || [])];
    return {
      uri: raw.uri, media_type: raw.media_type, name: raw.name, version: raw.version || "",
      artists: (raw.artists || []).map((a) => a.name), album: raw.album?.name || "",
      _img: image, image: null, favorite: !!raw.favorite, genres: [...new Set(genres)],
      year: raw.year ?? raw.album?.year ?? null, album_type: raw.album_type, owner: raw.owner,
      providers: (raw.provider_mappings || []).map((p) => p.provider_domain),
      mapUris: (raw.provider_mappings || []).flatMap((p) => [`${p.provider_domain}://${raw.media_type}/${p.item_id}`, `${p.provider_instance}://${raw.media_type}/${p.item_id}`]),
      duration: raw.duration,
    };
  }

  _image(item) {
    if (item.image) return item.image;
    if (item._img) item.image = this._imgUrl(item._img);
    return item.image;
  }

  async _fetchLibrary(media_type, { offset, limit, favorite, search, order_by, album_type }) {
    const e = await this._resolveEntries();
    if (e.mq) {
      const data = { limit, offset };
      if (order_by) data.order_by = order_by;
      if (favorite) data.favorite = true;
      if (search) data.search = search;
      if (album_type) data.album_type = [].concat(album_type);
      const r = await this._svc("mass_queue", "send_command", { config_entry_id: e.mq, command: `music/${PLURAL[media_type]}/library_items`, data }, null, true);
      const items = Array.isArray(r?.response) ? r.response : (r?.response?.items || []);
      return items.map((x) => this._normalize(x));
    }
    if (!e.ma) throw new Error(this._t("no_entry"));
    const data = { config_entry_id: e.ma, media_type, limit: Math.min(limit, 500), offset };
    if (order_by) data.order_by = order_by;
    if (favorite) data.favorite = true;
    if (search) data.search = search;
    if (album_type) data.album_type = [].concat(album_type);
    const r = await this._svc("music_assistant", "get_library", data, null, true);
    return (r?.items || []).map((x) => this._normalize(x));
  }

  async _fetchChildren(kind, uri) {
    const e = await this._resolveEntries();
    if (e.mq) {
      const svc = { playlist: "get_playlist_tracks", album: "get_album_tracks", artist: "get_artist_tracks" }[kind];
      const r = await this._svc("mass_queue", svc, { config_entry_id: e.mq, uri }, null, true);
      return (r?.tracks || []).map((x) => this._normalize(x));
    }
    const main = this._main();
    const r = await this._hass.callWS({ type: "media_player/browse_media", entity_id: main, media_content_id: uri, media_content_type: kind });
    return (r?.children || []).map((c) => ({
      uri: c.media_content_id, media_type: c.media_content_type === "track" ? "track" : c.media_content_type,
      name: c.title, artists: [], album: "", image: c.thumbnail, favorite: false, genres: [], year: null,
    }));
  }

  async _resolvePlaylistUri(tab) {
    if (tab.uri) return tab.uri;
    if (tab._uri) return tab._uri;
    const items = await this._fetchLibrary("playlist", { offset: 0, limit: 50, search: tab.playlist });
    const hit = items.find((x) => fold(x.name) === fold(tab.playlist)) || items[0];
    if (!hit) throw new Error(`Playlist „${tab.playlist}“ nicht gefunden`);
    tab._uri = hit.uri;
    return hit.uri;
  }

  /* ---------------- playback ---------------- */

  _busy(entity) {
    const s = this._hass.states[entity];
    return !!s && (s.state === "playing" || s.state === "paused") && !!(s.attributes.media_title || s.attributes.media_content_id);
  }

  async _play(item, enqueue = "replace", radio = false) {
    const main = this._main();
    if (!main) return;
    // Doppelte Auslösung (Ghost-Klick, Doppeltipp) innerhalb kurzer Zeit ignorieren
    const key = item.uri + "|" + enqueue + "|" + radio, now = Date.now();
    if (this._lastPlay && this._lastPlay.key === key && now - this._lastPlay.t < 1500) return;
    this._lastPlay = { key, t: now };
    const data = { media_id: item.uri, enqueue };
    if (item.media_type) data.media_type = item.media_type;
    if (radio) data.radio_mode = true;
    try {
      await this._svc("music_assistant", "play_media", data, { entity_id: main });
      const label = { replace: "▶", play: "▶", next: "⤵", add: "+", replace_next: "⤵" }[enqueue] || "▶";
      this._toast(`${label} ${item.name}`);
      if (this._config.tabs[this._activeTab]?.type === "queue") setTimeout(() => this._loadQueue(true), 800);
      setTimeout(() => this._updateQueueBadge(), 1200);
    } catch (e) { this._toast(`${this._t("error")}: ${e.message || e}`, true); }
  }

  _activateItem(item) {
    const main = this._main();
    if (!main) return;
    if (["album", "playlist", "artist"].includes(item.media_type)) {
      const mode = this._config.collection_tap;
      if (mode === "open") return this._drillIn(this._activeTab, item);
      if (mode !== "play") return this._itemMenu(item, this._activeTab);
    } else if (this._config.track_tap !== "play") return this._itemMenu(item, this._activeTab);
    if (item.media_type === "radio" || !this._busy(main)) return this._play(item, "replace");
    const mode = this._config.when_playing;
    if (mode !== "ask") return this._play(item, mode);
    this._dialog({
      title: this._t("already_playing"),
      text: this._t("what_to_do"),
      item,
      actions: [
        { label: this._t("replace"), icon: "mdi:play", primary: true, run: () => this._play(item, "replace") },
        { label: this._t("play_next"), icon: "mdi:playlist-play", run: () => this._play(item, "next") },
        { label: this._t("add_queue"), icon: "mdi:playlist-plus", run: () => this._play(item, "add") },
      ],
    });
  }

  async _playList(i, enqueue) {
    const tab = this._config.tabs[i], st = this._state(i);
    const drill = st.stack.length ? st.stack[st.stack.length - 1] : null;
    try {
      const item = drill ? { uri: drill.uri, media_type: drill.kind, name: drill.name }
        : { uri: await this._resolvePlaylistUri(tab), media_type: "playlist", name: this._tabName(tab) };
      this._play(item, enqueue);
    } catch (e) { this._toast(`${this._t("error")}: ${e.message || e}`, true); }
  }

  _itemMenu(item, tabIndex) {
    const coll = ["album", "playlist", "artist"].includes(item.media_type);
    const t = (k) => this._t(k);
    let actions;
    if (item.media_type === "radio") actions = [{ label: t("play_now"), icon: "mdi:play", primary: true, run: () => this._play(item, "play") }];
    else {
      actions = coll
        ? [{ label: t("open"), icon: "mdi:folder-open", primary: true, run: () => this._drillIn(tabIndex, item) },
          { label: t("play_replace"), icon: "mdi:play", run: () => this._play(item, "replace") }]
        : [{ label: t("play_now"), icon: "mdi:play", primary: true, run: () => this._play(item, "play") },
          { label: t("play_replace"), icon: "mdi:playlist-remove", run: () => this._play(item, "replace") }];
      actions.push(
        { label: t("play_next"), icon: "mdi:playlist-play", run: () => this._play(item, "next") },
        { label: t("add_queue"), icon: "mdi:playlist-plus", run: () => this._play(item, "add") },
        { label: t("start_radio"), icon: "mdi:radio-tower", run: () => this._play(item, "replace", true) },
      );
    }
    this._dialog({
      title: item.name, text: [(item.artists || []).join(", "), item.album, item.year].filter(Boolean).join(" · "), item, actions,
      like: this._canLike(item) ? { on: !!item.favorite, run: () => this._toggleFavorite(item) } : null,
    });
  }

  /* ---------------- favorites (Gefällt mir) ---------------- */

  _canLike(item) { return !!item?.uri && !!this._entries?.mq; }

  async _mqCmd(command, data = {}) {
    const e = await this._resolveEntries();
    if (!e.mq) throw new Error(this._t("queue_needs_mq"));
    const r = await this._svc("mass_queue", "send_command", { config_entry_id: e.mq, command, data }, null, true);
    return r?.response;
  }

  async _libRef(uri) {
    const m = /^library:\/\/([a-z]+)\/(.+)$/.exec(uri || "");
    if (m) return { media_type: m[1], id: m[2] };
    const it = await this._mqCmd("music/item_by_uri", { uri });
    if (it?.provider === "library") return { media_type: it.media_type, id: it.item_id, item: it };
    const lib = (it?.provider_mappings || []).length && it?.item_id && it?.provider === "library" ? it.item_id : null;
    return lib ? { media_type: it.media_type, id: lib, item: it } : { media_type: it?.media_type, id: null, item: it };
  }

  async _toggleFavorite(item) {
    try {
      if (item.favorite) {
        const ref = await this._libRef(item._lib || item.uri);
        if (!ref.id) throw new Error("not in library");
        await this._mqCmd("music/favorites/remove_item", { media_type: ref.media_type, library_item_id: ref.id });
      } else await this._mqCmd("music/favorites/add_item", { item: item.uri });
      item.favorite = !item.favorite;
      this._favCache = {};
      this._toast(`${item.favorite ? "♥" : "♡"} ${this._t(item.favorite ? "liked" : "unliked")}`);
      this._syncFavorite(item.uri, item.favorite, item);
    } catch (e) { this._toast(`${this._t("error")}: ${e.message || e}`, true); }
  }

  _syncFavorite(uri, fav, item) {
    const keys = new Set([uri, item?._lib, item && this._nameKey(item)].filter(Boolean));
    const hit = (x) => keys.has(x.uri) || keys.has(x._lib) || keys.has(this._nameKey(x));
    (this._queue?.items || []).forEach((x, k) => {
      if (!hit(x)) return;
      x.favorite = fav;
      const h = this.shadowRoot.querySelector(`.qrow[data-q="${k}"] .qfav`);
      if (h) h.hidden = !fav;
    });
    (this._tabState || []).forEach((st, i) => st?.items?.forEach((x, k) => {
      if (!hit(x)) return;
      x.favorite = fav;
      if (i !== this._activeTab) return;
      const art = this.shadowRoot.querySelector(`.tile[data-i="${k}"] .art`);
      if (!art) return;
      art.querySelector(".badge")?.remove();
      if (fav) art.insertAdjacentHTML("beforeend", `<span class="badge">${icon("mdi:heart")}</span>`);
    }));
    if (this._now && this._now !== item && hit(this._now)) { this._now.favorite = fav; this._renderLike(); }
    if (this._now === item) this._renderLike();
  }

  async _favSet(media_type) {
    this._favCache = this._favCache || {};
    const c = this._favCache[media_type];
    if (c && Date.now() - c.t < 120000) return c.p;
    const p = (async () => {
      const map = new Map(); // Schlüssel (Bibliotheks-URI, Anbieter-URI, Name|Interpret) → Bibliotheks-URI
      for (let off = 0; off < 10000; off += 500) {
        const items = await this._fetchLibrary(media_type, { offset: off, limit: 500, favorite: true });
        items.forEach((x) => [x.uri, ...(x.mapUris || []), this._nameKey(x)].forEach((k) => k && map.set(k, x.uri)));
        if (items.length < 500) break;
      }
      return map;
    })().catch(() => new Map());
    this._favCache[media_type] = { t: Date.now(), p };
    return p;
  }

  _nameKey(x) {
    const a = (x.artists || [])[0];
    return x.name && a ? "n:" + fold(x.name + "|" + String(a).split(/[,/&]| feat\.? /i)[0].trim()) : null;
  }

  // Favoritenstatus aus der Bibliothek übernehmen – auch für Anbieter-URIs (Playlisten, Warteschlange, laufender Titel)
  async _markFavorites(items) {
    if (!this._entries) await this._resolveEntries();
    if (!this._entries?.mq || !items.length) return items;
    const types = [...new Set(items.map((x) => x.media_type))].filter((t) => PLURAL[t]);
    for (const t of types) {
      const map = await this._favSet(t);
      items.forEach((x) => {
        if (x.media_type !== t) return;
        const lib = map.get(x.uri) || map.get(this._nameKey(x));
        if (lib) { x.favorite = true; x._lib = lib; }
      });
    }
    return items;
  }

  /* ---------------- genres (über die Genre-Zuordnung von MA) ---------------- */

  _genreConds(ast, out = []) {
    if (!ast) return out;
    if (ast.and || ast.or) (ast.and || ast.or).forEach((a) => this._genreConds(a, out));
    else if (ast.not) this._genreConds(ast.not, out);
    else if (ast.field === "genre") out.push(ast);
    return out;
  }

  async _genreList() {
    if (!this._genresP) {
      this._genresP = (async () => {
        const all = [];
        for (let off = 0; off < 5000; off += 500) {
          const r = await this._mqCmd("music/genres/library_items", { limit: 500, offset: off });
          all.push(...(r || []));
          if (!r || r.length < 500) break;
        }
        return all;
      })().catch((e) => { this._genresP = null; throw e; });
    }
    return this._genresP;
  }

  // Liefert Map uri → [Genre-Namen] für alle Genres, die eine Genre-Bedingung des Filters erfüllen
  async _genreMap(tab, media_type) {
    if (!["album", "track"].includes(media_type) || !this._entries?.mq) return null;
    const conds = this._genreConds(tab._ast);
    if (!conds.length) return null;
    const key = media_type + "|" + JSON.stringify(conds);
    this._genreMaps = this._genreMaps || {};
    if (this._genreMaps[key]) return this._genreMaps[key];
    const p = (async () => {
      const genres = await this._genreList();
      const ids = new Map();
      for (const c of conds) {
        const hit = genres.filter((g) => evalFilter({ field: "genre", op: c.op === "!=" ? "=" : c.op, value: c.value }, { genres: [g.name] }));
        if (hit.length) hit.forEach((g) => ids.set(g.item_id, g.name));
        else {
          const q = String(c.value).replace(/[*?\/]/g, " ").trim();
          if (q) (await this._mqCmd("music/genres/library_items", { limit: 50, offset: 0, search: q }) || []).forEach((g) => ids.set(g.item_id, g.name));
        }
      }
      const map = new Map();
      for (const [id, name] of ids) {
        for (let off = 0; off < 20000; off += 500) {
          const r = await this._mqCmd(`music/genres/${PLURAL[media_type]}`, { item_id: id, limit: 500, offset: off }) || [];
          r.forEach((x) => { const l = map.get(x.uri) || []; l.push(name); map.set(x.uri, l); });
          if (r.length < 500) break;
        }
      }
      return map;
    })();
    this._genreMaps[key] = p;
    p.catch(() => { delete this._genreMaps[key]; });
    return p;
  }

  _applyGenres(items, map) {
    if (map) items.forEach((x) => { const g = map.get(x.uri); if (g) x.genres = [...new Set([...(x.genres || []), ...g])]; });
    return items;
  }

  /* ---------------- Übersicht aller Player ---------------- */

  _picOf(entity) {
    const st = this._hass.states[entity];
    if (!st || !(st.state === "playing" || st.state === "paused")) return null;
    let p = st.attributes.entity_picture;
    if (!p) { const l = (st.attributes.group_members || [])[0]; if (l && l !== entity) p = this._hass.states[l]?.attributes.entity_picture; }
    return p ? (p.startsWith("/") ? this._hass.hassUrl?.(p) || p : p) : null;
  }

  _ovList() {
    const main = this._main();
    const list = this._players().map((p) => p.entity);
    if (main && !list.includes(main)) list.unshift(main);
    return list;
  }

  _openOverview() {
    const ov = this.$("overlay");
    this._ovOpen = true;
    ov.innerHTML = `<div class="sheet ovw" role="dialog" aria-modal="true">
      <div class="ovw-head"><div class="sheet-title">${esc(this._t("all_players"))}</div><span class="spacer"></span>
        <button class="ib" data-pc="close" title="${esc(this._t("close"))}">${icon("mdi:close")}</button></div>
      <div class="ovw-grid" id="ovwGrid"></div></div>`;
    ov.hidden = false;
    this._ovSig = null;
    this._renderOverview();
    const opened = Date.now();
    const close = () => { this._ovOpen = false; ov.hidden = true; ov.innerHTML = ""; document.removeEventListener("keydown", onKey); };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    ov.oncontextmenu = (e) => e.preventDefault();
    ov.onclick = (e) => {
      if (Date.now() - opened < 450) return;
      if (e.target === ov) return close();
      const b = e.target.closest("[data-pc]");
      if (!b) return;
      if (b.dataset.pc === "close") return close();
      const ent = b.closest("[data-e]")?.dataset.e;
      if (!ent) return;
      const st = this._hass.states[ent], tg = { entity_id: ent };
      const run = (d, sv, data = {}) => this._svc(d, sv, data, tg).catch((er) => this._toast(`${this._t("error")}: ${er.message || er}`, true));
      switch (b.dataset.pc) {
        case "pp": run("media_player", "media_play_pause"); break;
        case "prev": run("media_player", "media_previous_track"); break;
        case "next": run("media_player", "media_next_track"); break;
        case "mute": run("media_player", "volume_mute", { is_volume_muted: !st.attributes.is_volume_muted }); break;
        case "main": this._setMain(ent); this._ovSig = null; this._renderOverview(); break;
        case "group": this._toggleGroup(ent); break;
      }
    };
    ov.onchange = (e) => {
      const r = e.target.closest("input[data-vol]");
      if (!r) return;
      this._ovDrag = false;
      this._svc("media_player", "volume_set", { volume_level: +r.value / 100 }, { entity_id: r.dataset.vol }).catch(() => {});
    };
    ov.oninput = (e) => { const r = e.target.closest("input[data-vol]"); if (r) { this._ovDrag = true; r.style.setProperty("--v", r.value + "%"); } };
  }

  _renderOverview() {
    const grid = this.$("ovwGrid");
    if (!grid || this._ovDrag) return;
    const main = this._main(), members = this._members(main);
    const list = this._ovList();
    const sig = JSON.stringify([main, members, list.map((e) => { const a = this._hass.states[e]?.attributes || {};
      return [e, this._hass.states[e]?.state, a.media_title, a.media_artist, a.entity_picture, a.volume_level, a.is_volume_muted, a.group_members]; })]);
    if (sig === this._ovSig) return;
    this._ovSig = sig;
    const t = (k) => esc(this._t(k));
    grid.innerHTML = list.map((e) => {
      const st = this._hass.states[e];
      if (!st) return "";
      const a = st.attributes, active = st.state === "playing" || st.state === "paused";
      const pic = this._picOf(e), isMain = e === main, joined = members.includes(e);
      const vol = Math.round((a.volume_level ?? 0) * 100);
      const leaderOf = (a.group_members || []).length > 1 && a.group_members[0] === e;
      return `<div class="pcard${isMain ? " is-main" : ""}${st.state === "playing" ? " playing" : ""}" data-e="${esc(e)}">
        <div class="pc-art">${pic ? `<img src="${esc(pic)}" alt="" draggable="false" onerror="this.remove()">` : ""}${icon("mdi:music", "ph-ic")}</div>
        <div class="pc-body">
          <div class="pc-name">${st.state === "playing" ? `<span class="eq"><i></i><i></i><i></i></span>` : icon(leaderOf ? "mdi:speaker-multiple" : "mdi:speaker")}<span>${esc(this._pname(e))}</span>
            ${isMain ? `<span class="pc-tag">${t("main_player")}</span>` : joined ? `<span class="pc-tag">${icon("mdi:link-variant")}</span>` : ""}</div>
          <div class="pc-t">${esc(active ? a.media_title || "" : this._statusText(e))}</div>
          <div class="pc-a">${esc(active ? [a.media_artist, a.media_album_name].filter(Boolean).join(" · ") : "")}</div>
          <div class="pc-ctl">
            <button class="ib sm" data-pc="prev">${icon("mdi:skip-previous")}</button>
            <button class="ib pc-pp" data-pc="pp">${icon(st.state === "playing" ? "mdi:pause" : "mdi:play")}</button>
            <button class="ib sm" data-pc="next">${icon("mdi:skip-next")}</button>
            <span class="spacer"></span>
            ${isMain ? "" : `<button class="ib sm${joined ? " on" : ""}" data-pc="group" title="${t(joined ? "leave" : "join")}">${icon(joined ? "mdi:link-variant-off" : "mdi:link-variant-plus")}</button>
            <button class="ib sm" data-pc="main" title="${t("set_main")}">${icon("mdi:star-outline")}</button>`}
          </div>
          <div class="pc-vol volume">
            <button class="ib sm" data-pc="mute">${icon(a.is_volume_muted ? "mdi:volume-off" : vol < 35 ? "mdi:volume-low" : "mdi:volume-high")}</button>
            <input type="range" min="0" max="100" step="1" value="${vol}" data-vol="${esc(e)}" style="--v:${vol}%" aria-label="Volume">
            <span class="volv">${a.volume_level != null ? vol : ""}</span>
          </div>
        </div></div>`;
    }).join("");
  }

  /* ---------------- grouping ---------------- */

  _members(entity) {
    const m = this._hass.states[entity]?.attributes.group_members || [];
    return m.filter((x) => x !== entity);
  }

  async _toggleGroup(entity) {
    const main = this._main();
    if (!main || entity === main) return;
    const members = this._members(main);
    try {
      if (members.includes(entity)) {
        await this._svc("media_player", "unjoin", {}, { entity_id: entity });
        return;
      }
      const mainSt = this._hass.states[main];
      if (mainSt && !(mainSt.attributes.supported_features & FEATURE_GROUPING)) { this._toast(this._t("not_groupable"), true); return; }
      const st = this._hass.states[entity];
      const doJoin = () => this._svc("media_player", "join", { group_members: [entity] }, { entity_id: main })
        .catch((e) => this._toast(`${this._t("error")}: ${e.message || e}`, true));
      if (st && st.state === "playing" && !members.includes(entity)) {
        this._dialog({
          title: `${this._pname(entity)} ${this._t("group_replace_title")}`,
          text: `„${st.attributes.media_title || ""}“${st.attributes.media_artist ? " – " + st.attributes.media_artist : ""}. ${this._t("group_replace_text")}`,
          image: st.attributes.entity_picture,
          actions: [{ label: this._t("group_join"), icon: "mdi:speaker-multiple", primary: true, run: doJoin }],
        });
        return;
      }
      await doJoin();
    } catch (e) { this._toast(`${this._t("error")}: ${e.message || e}`, true); }
  }

  _playerMenu(entity) {
    const main = this._main();
    const joined = this._members(main).includes(entity);
    this._dialog({
      title: this._pname(entity),
      text: this._statusText(entity),
      image: this._hass.states[entity]?.attributes.entity_picture,
      actions: [
        { label: joined ? this._t("group_leave") : this._t("group_join"), icon: joined ? "mdi:link-variant-off" : "mdi:link-variant", primary: true, run: () => this._toggleGroup(entity) },
        { label: this._t("make_main"), icon: "mdi:star-circle", run: () => this._setMain(entity) },
      ],
    });
  }

  _statusText(entity) {
    const s = this._hass.states[entity];
    if (!s) return "";
    if (s.state === "playing" || s.state === "paused") {
      return [s.attributes.media_title, s.attributes.media_artist].filter(Boolean).join(" – ") || s.state;
    }
    return this._hass.formatEntityState ? this._hass.formatEntityState(s) : s.state;
  }

  /* ================================================================ DOM */

  _build() {
    if (!this._hass || !this._config) return;
    this._built = true;
    const root = this.shadowRoot;
    // Ohne Kartenhintergrund kein <ha-card>: Themes/UIX/card-mod können ha-card sonst einen Hintergrund aufzwingen
    const tag = this._config.card_background ? "ha-card" : "div";
    root.innerHTML = `<style>${CSS}</style>
      <${tag} class="card">
        <div class="root" id="root">
          <aside class="sidebar" id="sidebar">
            <div class="sb-bg" id="sbBg"></div>
            <div class="sb-full" id="sbFull"></div>
            <div class="sb-mini" id="sbMini"></div>
          </aside>
          <div class="scrim" id="scrim"></div>
          <section class="main" id="main">
            <div class="groupbar" id="groupbar"></div>
            <nav class="tabs" id="tabs"></nav>
            <div class="toolbar" id="toolbar"></div>
            <div class="content" id="content"></div>
          </section>
          <div class="pop-bd" id="popBd" hidden></div>
          <div class="pop" id="pop" hidden role="listbox"></div>
          <div class="overlay" id="overlay" hidden></div>
          <div class="toast" id="toast"></div>
        </div>
      </${tag}>`;
    this.$ = (id) => root.getElementById(id);
    this._renderSidebarSkeleton();
    this._renderTabs();
    this._bindContent();
    this.$("main").addEventListener("click", () => {
      if (!this._ui.pinned && !this._ui.collapsed && this._config.sidebar.collapsible !== false) this._setCollapsed(true);
    });
    this._ro?.disconnect();
    this._ro = new ResizeObserver(() => this._layout());
    this._ro.observe(this.$("root"));
    this._ro.observe(this.$("sbFull")); // Höhe der Sidebar ändert sich (Icons, Schrift, Inhalt)
    this._ro.observe(this.$("sbFull"));
    this._applyHeight();
    this._layout();
    this._startTimers();
    this._lastSig = "";
    this._resolveEntries().then(() => this._showTab(this._activeTab, true));
  }

  _applyHeight() {
    const root = this.$("root");
    const h = this._config.height;
    if (h) {
      root.style.height = typeof h === "number" ? h + "px" : h;
    } else if (this.isPanel) {
      root.style.height = "calc(100dvh - var(--header-height, 56px) - 16px)";
    } else if (this.layout === "grid" || this.getAttribute("layout") === "grid" || this._autoMode === "fill") {
      root.style.height = "100%";
    } else if (this._autoMode === "fixed") {
      root.style.height = "min(85dvh, 760px)";
    } else {
      root.style.height = "100%";
      if (root.clientWidth > 0) {
        this._autoMode = root.clientHeight >= 200 ? "fill" : "fixed";
        if (this._autoMode === "fixed") root.style.height = "min(85dvh, 760px)";
      }
    }
    root.style.minHeight = this._config.min_height ? this._config.min_height + "px" : "";
  }

  _position() {
    const c = this._config.sidebar;
    if (c.position !== "auto") return c.position;
    const { w, h } = this._size;
    const landscape = w >= 720 && w >= h * 1.05;
    return landscape ? c.position_landscape : c.position_portrait;
  }

  _layout() {
    const root = this.$("root");
    if (!root) return;
    this._applyHeight();
    const w = root.clientWidth, h = root.clientHeight;
    this._size = { w, h };
    const pos = this._position();
    const side = pos === "left" || pos === "right";
    const sb = this.$("sidebar");
    root.className = `root pos-${pos} ${side ? "side" : "stack"}${this._ui.collapsed ? " collapsed" : ""}${this._ui.pinned ? " pinned" : " floating"}${w < 520 ? " compact" : ""}`;
    if (this._iconPos !== pos) {
      this._iconPos = pos;
      const col = this.$("colBtn"), exp = this.$("expBtn");
      if (col) col.innerHTML = icon({ left: "mdi:chevron-left", right: "mdi:chevron-right", top: "mdi:chevron-up", bottom: "mdi:chevron-down" }[pos]);
      if (exp) exp.innerHTML = icon({ left: "mdi:chevron-right", right: "mdi:chevron-left", top: "mdi:chevron-down", bottom: "mdi:chevron-up" }[pos]);
    }

    let sbw = this._config.sidebar.width;
    if (sbw === "auto") sbw = Math.round(Math.max(260, Math.min(360, w * 0.32)));
    root.style.setProperty("--sb-w", sbw + "px");
    root.style.setProperty("--mini", MINI + "px");

    let reserve;
    if (this._ui.collapsed) reserve = MINI;
    else reserve = side ? sbw : this.$("sbFull").offsetHeight || 200;
    root.style.setProperty("--reserve", reserve + "px");
    sb.style.setProperty("--full-h", (this.$("sbFull").scrollHeight || 200) + "px");

    const coarse = window.matchMedia?.("(pointer: coarse)").matches;
    let tile = this._config.tile_size;
    const named = { small: 110, medium: 145, large: 185, xlarge: 230 };
    if (named[tile]) tile = named[tile];
    else if (tile === "auto") {
      const avail = (side ? w - reserve : w) - 24;
      // Schmale Geräte (iPhone): 3 Spalten, ab 480 px 4 Spalten
      if (avail < 640) { const cols = avail < 480 ? 3 : 4; tile = Math.max(90, Math.floor((avail - (cols - 1) * 12) / cols) - 1); }
      else tile = Math.round(Math.max(coarse ? 150 : 140, Math.min(260, avail / (coarse ? 6 : 7) - 12)));
    }
    root.style.setProperty("--tile", parseInt(tile, 10) + "px");
    root.style.setProperty("--tap", coarse ? "48px" : "40px");
  }

  _setCollapsed(v) {
    this._ui.collapsed = v;
    this._save();
    this._layout();
    this._updateSidebar();
  }
  _setPinned(v) {
    this._ui.pinned = v;
    this._save();
    this._layout();
    this._updateSidebar();
  }

  _startTimers() {
    if (this._tick || !this._built) return;
    this._tick = setInterval(() => this._updateProgress(), 1000);
  }

  /* ---------------- sidebar ---------------- */

  _renderSidebarSkeleton() {
    const t = (k) => esc(this._t(k));
    const collapsible = this._config.sidebar.collapsible;
    this.$("sbFull").innerHTML = `
      <div class="sb-head">
        <button class="select-wrap" id="playerBtn" aria-label="${t("main_player")}">${icon("mdi:speaker", "sel-ic")}<span class="sel-name" id="playerName"></span>${icon("mdi:chevron-down", "sel-chev")}</button>
        <button class="ib ov-head" data-cmd="overview" title="${t("all_players")}">${icon("mdi:speaker-multiple")}</button>
        ${collapsible ? `<button class="ib" id="pinBtn"></button><button class="ib" id="colBtn" title="${t("collapse")}"></button>` : ""}
      </div>
      <div class="cover-wrap"><div class="cover" id="cover" title="${t("song_info")}"></div></div>
      <div class="info">
        <div class="title" id="title"></div>
        <div class="artist" id="artist"></div>
        <div class="album" id="album"></div>
        <div class="grouped" id="grouped"></div>
      </div>
      <div class="progress">
        <div class="bar" id="bar"><div class="fill" id="fill"></div></div>
        <div class="times"><span id="pos"></span><span id="dur"></span></div>
      </div>
      <div class="controls">
        <button class="ib sm like" data-cmd="like" id="likeBtn" hidden title="${t("like")}">${icon("mdi:heart-outline")}</button>
        <button class="ib sm" data-cmd="shuffle" id="shufBtn">${icon("mdi:shuffle")}</button>
        <button class="ib" data-cmd="prev">${icon("mdi:skip-previous")}</button>
        <button class="ib play" data-cmd="playpause" id="ppBtn">${icon("mdi:play")}</button>
        <button class="ib" data-cmd="next">${icon("mdi:skip-next")}</button>
        <button class="ib sm" data-cmd="repeat" id="repBtn">${icon("mdi:repeat-off")}</button>
      </div>
      <div class="volume">
        <button class="ib sm" data-cmd="mute" id="muteBtn" title="${t("mute")}">${icon("mdi:volume-high")}</button>
        <button class="ib sm" data-cmd="voldown" title="${t("vol_down")}">${icon("mdi:volume-minus")}</button>
        <input type="range" min="0" max="100" step="1" id="vol" aria-label="Volume">
        <button class="ib sm" data-cmd="volup" title="${t("vol_up")}">${icon("mdi:volume-plus")}</button>
        <span class="volv" id="volv"></span>
      </div>
      <button class="ov-btn" data-cmd="overview">${icon("mdi:speaker-multiple")}<span>${t("all_players")}</span>${icon("mdi:chevron-right", "ov-chev")}</button>`;
    this.$("sbMini").innerHTML = `
      <div class="mini-cover" id="miniCover"></div>
      <div class="mini-info"><div class="title" id="miniTitle"></div><div class="artist" id="miniArtist"></div></div>
      <div class="mini-ctl">
        <button class="ib like" data-cmd="like" id="miniLike" hidden title="${t("like")}">${icon("mdi:heart-outline")}</button>
        <button class="ib" data-cmd="playpause" id="miniPp">${icon("mdi:play")}</button>
        <button class="ib mini-next" data-cmd="next">${icon("mdi:skip-next")}</button>
      </div>
      <button class="ib mini-ov" data-cmd="overview" title="${t("all_players")}">${icon("mdi:speaker-multiple")}</button>
      ${collapsible ? `<button class="ib mini-exp" id="expBtn" title="${t("expand")}"></button>` : ""}`;

    this._lastPic = undefined; // neues DOM: Cover neu setzen
    this._iconPos = null; // … und die Pfeile zum Ein-/Ausklappen
    const sb = this.$("sidebar");
    sb.addEventListener("click", (e) => {
      const b = e.target.closest("[data-cmd]");
      if (b) { this._cmd(b.dataset.cmd); return; }
      if (e.target.closest("#colBtn")) this._setCollapsed(true);
      else if (e.target.closest("#expBtn")) this._setCollapsed(false);
      else if (e.target.closest("#pinBtn")) this._setPinned(!this._ui.pinned);
      else if (e.target.closest("#playerBtn")) this._playerPicker();
      else if (e.target.closest("#cover")) this._songInfo();
      else if (this._ui.collapsed && e.target.closest("#sbMini")) this._setCollapsed(false);
    });
    const vol = this.$("vol");
    vol.addEventListener("pointerdown", () => { this._volDrag = true; });
    vol.addEventListener("input", () => {
      this.$("volv").textContent = vol.value;
      vol.style.setProperty("--v", vol.value + "%");
      clearTimeout(this._volT);
      this._volT = setTimeout(() => this._setVolume(vol.value / 100), 250);
    });
    vol.addEventListener("change", () => { this._volDrag = false; this._setVolume(vol.value / 100); });
    this.$("bar").addEventListener("click", (e) => {
      const s = this._hass.states[this._main()];
      const d = s?.attributes.media_duration;
      if (!d) return;
      const r = e.currentTarget.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      this._svc("media_player", "media_seek", { seek_position: Math.round(d * p) }, { entity_id: this._main() });
    });
  }

  async _cmd(cmd) {
    if (cmd === "like") { if (this._now) this._toggleFavorite(this._now); return; }
    if (cmd === "overview") { this._openOverview(); return; }
    const main = this._main();
    if (!main) return;
    const s = this._hass.states[main];
    const target = { entity_id: main };
    try {
      switch (cmd) {
        case "playpause": await this._svc("media_player", "media_play_pause", {}, target); break;
        case "next": await this._svc("media_player", "media_next_track", {}, target); break;
        case "prev": await this._svc("media_player", "media_previous_track", {}, target); break;
        case "shuffle": await this._svc("media_player", "shuffle_set", { shuffle: !s.attributes.shuffle }, target); break;
        case "repeat": {
          const next = { off: "all", all: "one", one: "off" }[s.attributes.repeat || "off"];
          await this._svc("media_player", "repeat_set", { repeat: next }, target); break;
        }
        case "volup": case "voldown": {
          const cur = this._volPending ?? s.attributes.volume_level ?? 0;
          const step = (this._config.volume_step ?? 5) / 100;
          const nv = Math.max(0, Math.min(1, Math.round((cur + (cmd === "volup" ? step : -step)) * 100) / 100));
          this._volPending = nv;
          clearTimeout(this._volPT); this._volPT = setTimeout(() => { this._volPending = null; }, 1500);
          this.$("vol").value = Math.round(nv * 100); this.$("volv").textContent = Math.round(nv * 100);
          if (s.attributes.is_volume_muted && cmd === "volup") this._svc("media_player", "volume_mute", { is_volume_muted: false }, target).catch(() => {});
          await this._svc("media_player", "volume_set", { volume_level: nv }, target); break;
        }
        case "mute": await this._svc("media_player", "volume_mute", { is_volume_muted: !s.attributes.is_volume_muted }, target); break;
      }
    } catch (e) { this._toast(`${this._t("error")}: ${e.message || e}`, true); }
  }

  _setVolume(v) {
    const main = this._main();
    if (main) this._svc("media_player", "volume_set", { volume_level: Math.round(v * 100) / 100 }, { entity_id: main }).catch(() => {});
  }

  _onHass() {
    if (!this._built) return;
    const main = this._main();
    const players = this._players();
    const ents = [...new Set([main, ...players.map((p) => p.entity)].filter(Boolean))];
    const sig = JSON.stringify([main, ents.map((e) => {
      const s = this._hass.states[e];
      if (!s) return e;
      const a = s.attributes;
      return [e, s.state, a.media_title, a.media_content_id, a.media_artist, a.entity_picture, a.group_members, a.volume_level, a.is_volume_muted, a.shuffle, a.repeat, a.media_position_updated_at, a.media_duration];
    })]);
    if (sig === this._lastSig) return;
    const prevTitle = this._lastTitle;
    this._lastSig = sig;
    const ms = main && this._hass.states[main];
    this._lastTitle = ms ? `${ms.attributes.media_title}|${ms.attributes.media_content_id}` : "";
    this._updateSidebar();
    this._renderGroupBar();
    if (prevTitle !== this._lastTitle) this._updateQueueBadge();
    if (this._ovOpen) this._renderOverview();
    if (prevTitle !== undefined && prevTitle !== this._lastTitle && this._config.tabs[this._activeTab]?.type === "queue") {
      clearTimeout(this._qT);
      this._qT = setTimeout(() => this._loadQueue(true), 600);
    } else if (this._config.tabs[this._activeTab]?.type === "queue") {
      this._markQueueCurrent();
    }
  }

  _updateSidebar() {
    if (!this._built) return;
    const main = this._main();
    if (!main) {
      this.$("title").textContent = this._t("no_player");
      return;
    }
    this.$("playerName").textContent = this._pname(main);

    const s = this._hass.states[main];
    const a = s.attributes;
    const active = s.state === "playing" || s.state === "paused";
    // Bild: eigenes entity_picture, sonst das des Gruppen-Leiters
    let rawPic = active ? a.entity_picture : null;
    if (active && !rawPic) {
      const leader = (a.group_members || [])[0];
      if (leader && leader !== main) rawPic = this._hass.states[leader]?.attributes.entity_picture;
    }
    const pic = rawPic ? (rawPic.startsWith("/") ? this._hass.hassUrl?.(rawPic) || rawPic : rawPic) : null;
    if (this._lastPic !== pic) {
      this._lastPic = pic;
      const ph = `<div class="ph">${icon("mdi:music")}</div>`;
      ["cover", "miniCover"].forEach((id) => {
        const el = this.$(id);
        if (!pic) { el.innerHTML = ph; return; }
        const img = new Image();
        img.alt = ""; img.draggable = false;
        img.onerror = () => { el.innerHTML = ph; if (this._lastPic === pic) this._lastPic = null; };
        img.src = pic;
        el.replaceChildren(img);
      });
      this.$("sbBg").style.backgroundImage = pic ? `url("${pic.replace(/"/g, "%22")}")` : "none";
    }
    this._updateNow(main, s);
    const title = active ? a.media_title || this._pname(main) : this._t("nothing_playing");
    const artist = active ? a.media_artist || "" : this._pname(main);
    this.$("title").textContent = title;
    this.$("artist").textContent = artist;
    this.$("album").textContent = active ? a.media_album_name || "" : "";
    this.$("miniTitle").textContent = title;
    this.$("miniArtist").textContent = artist;
    const members = this._members(main);
    this.$("grouped").innerHTML = members.length
      ? `${icon("mdi:speaker-multiple")} ${esc(this._t("grouped_with"))} ${members.map((m) => esc(this._pname(m))).join(", ")}` : "";

    const ppIcon = s.state === "playing" ? "mdi:pause" : "mdi:play";
    this.$("ppBtn").innerHTML = icon(ppIcon);
    this.$("miniPp").innerHTML = icon(ppIcon);
    this.$("shufBtn").classList.toggle("on", !!a.shuffle);
    this.$("repBtn").classList.toggle("on", a.repeat && a.repeat !== "off");
    this.$("repBtn").innerHTML = icon(a.repeat === "one" ? "mdi:repeat-once" : a.repeat === "all" ? "mdi:repeat" : "mdi:repeat-off");
    this.$("muteBtn").innerHTML = icon(a.is_volume_muted ? "mdi:volume-off" : (a.volume_level ?? 0) < 0.35 ? "mdi:volume-low" : "mdi:volume-high");
    if (!this._volDrag && this._volPending == null && a.volume_level != null) {
      const v = Math.round(a.volume_level * 100);
      this.$("vol").value = v;
      this.$("vol").style.setProperty("--v", v + "%");
      this.$("volv").textContent = v;
    }
    const pin = this.$("pinBtn");
    if (pin) {
      pin.innerHTML = icon(this._ui.pinned ? "mdi:pin" : "mdi:pin-off-outline");
      pin.title = this._t(this._ui.pinned ? "unpin" : "pin");
      pin.classList.toggle("on", this._ui.pinned);
    }
    this._updateProgress();
    requestAnimationFrame(() => this._layout());
  }

  /* ---------------- aktueller Titel: Gefällt mir, Songinfo ---------------- */

  _updateNow(main, s) {
    const a = s.attributes;
    const active = s.state === "playing" || s.state === "paused";
    const uri = active ? a.media_content_id : null;
    if (uri && !this._entries) { this._resolveEntries().then(() => { const st = this._hass.states[this._main()]; if (st) this._updateNow(this._main(), st); }); return; }
    if (!uri || !this._entries?.mq) { this._now = null; this._renderLike(); return; }
    if (this._now?.uri === uri) return;
    this._now = { uri, name: a.media_title, artists: a.media_artist ? [a.media_artist] : [], album: a.media_album_name, favorite: false, media_type: "track" };
    this._renderLike();
    const now = this._now;
    this._libRef(uri).then(async (ref) => {
      let it = ref.item;
      if (!it && ref.id) it = await this._mqCmd(`music/${PLURAL[ref.media_type] || "tracks"}/get`, { item_id: ref.id, provider_instance_id_or_domain: "library" });
      if (this._now !== now) return;
      if (it) { now.favorite = !!it.favorite; now.detail = it; now.libId = ref.id; }
      if (!now.favorite) {
        if (it?.artists?.length) now.artists = it.artists.map((x) => x.name);
        await this._markFavorites([now]);
        if (now._lib && !now.libId) now.libId = /\/([^/]+)$/.exec(now._lib)?.[1];
      }
      if (this._now === now) this._renderLike();
    }).catch(() => {});
    this._updateQueueBadge();
  }

  _renderLike() {
    const on = !!this._now?.favorite;
    ["likeBtn", "miniLike"].forEach((id) => {
      const b = this.$(id);
      if (!b) return;
      b.hidden = !this._now;
      b.classList.toggle("on", on);
      b.innerHTML = icon(on ? "mdi:heart" : "mdi:heart-outline");
      b.title = this._t(on ? "unlike" : "like");
    });
  }

  async _songInfo() {
    const main = this._main();
    const s = main && this._hass.states[main];
    if (!s || !(s.state === "playing" || s.state === "paused")) return;
    const a = s.attributes, now = this._now, d = now?.detail;
    let genres = [];
    if (now?.libId && this._entries?.mq) {
      try {
        const g = await this._mqCmd("music/genres/genres_for_media_item", { media_type: "track", media_id: now.libId });
        genres = (g || []).map((x) => x.name || x).filter(Boolean);
        if (!genres.length && d?.album?.item_id) {
          const al = await this._mqCmd("music/albums/get", { item_id: d.album.item_id, provider_instance_id_or_domain: d.album.provider || "library" });
          genres = al?.metadata?.genres || [];
        }
      } catch (e) { /* ohne Genre */ }
    }
    const t = (k) => this._t(k);
    const rows = [
      [t("f_title"), a.media_title + (d?.version ? ` (${d.version})` : "")],
      [t("f_artist"), d?.artists?.map((x) => x.name).join(", ") || a.media_artist],
      [t("f_album"), d?.album?.name || a.media_album_name],
      [t("f_year"), d?.album?.year || d?.year],
      [t("f_duration"), fmtTime(d?.duration || a.media_duration)],
      [t("f_genre"), genres.join(", ")],
      [t("f_source"), [...new Set((d?.provider_mappings || []).map((m) => m.provider_domain.replace(/_/g, " ")))].join(", ")],
      [t("f_player"), this._pname(main)],
    ].filter((r) => r[1]);
    const actions = [];
    if (now?.uri) actions.push({ label: t("start_radio"), icon: "mdi:radio-tower", run: () => this._play({ uri: now.uri, name: now.name, media_type: "track" }, "replace", true) });
    this._dialog({
      title: t("song_info"), image: this._lastPic || null,
      html: `<dl class="info-rows">${rows.map((r) => `<dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd>`).join("")}</dl>`,
      actions, like: now && this._entries?.mq ? { on: !!now.favorite, run: () => this._toggleFavorite(now) } : null, big: true,
    });
  }

  _playerPicker() {
    const main = this._main();
    const list = this._players().map((p) => p.entity);
    if (main && !list.includes(main)) list.unshift(main);
    const pop = this.$("pop"), bd = this.$("popBd"), btn = this.$("playerBtn"), root = this.$("root");
    if (!pop.hidden) { this._closePop(); return; }
    pop.innerHTML = list.map((e) => {
      const st = this._hass.states[e];
      const playing = st?.state === "playing";
      return `<button class="pop-it${e === main ? " active" : ""}" data-e="${esc(e)}">
        <span class="pop-ic">${playing ? `<span class="eq"><i></i><i></i><i></i></span>` : icon("mdi:speaker")}</span>
        <span class="act-l"><span>${esc(this._pname(e))}</span><small>${esc(this._statusText(e))}</small></span>
        ${e === main ? icon("mdi:check", "act-chk") : ""}</button>`;
    }).join("");
    const rr = root.getBoundingClientRect(), br = btn.getBoundingClientRect();
    const top = br.bottom - rr.top + 6;
    Object.assign(pop.style, { left: Math.max(6, br.left - rr.left) + "px", top: top + "px",
      width: Math.min(rr.width - 12, Math.max(br.width, 300)) + "px", maxHeight: Math.max(160, rr.height - top - 10) + "px" });
    pop.hidden = false; bd.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    pop.onclick = (ev) => {
      const it = ev.target.closest("[data-e]");
      if (!it) return;
      this._closePop();
      this._setMain(it.dataset.e);
    };
    bd.onclick = () => this._closePop();
    this._popKey = (ev) => { if (ev.key === "Escape") this._closePop(); };
    document.addEventListener("keydown", this._popKey);
  }

  _closePop() {
    const pop = this.$("pop"), bd = this.$("popBd");
    if (pop) { pop.hidden = true; pop.innerHTML = ""; }
    if (bd) bd.hidden = true;
    this.$("playerBtn")?.setAttribute("aria-expanded", "false");
    if (this._popKey) document.removeEventListener("keydown", this._popKey);
  }

  /* ---------------- Warteschlange: dezente Anzeige am Tab ---------------- */

  _updateQueueBadge() {
    const qi = this._config.tabs.findIndex((t) => t.type === "queue");
    const main = this._main();
    if (qi < 0 || !main) return;
    clearTimeout(this._qbT);
    this._qbT = setTimeout(async () => {
      let n = 0;
      try {
        const r = await this._svc("music_assistant", "get_queue", {}, { entity_id: main }, true);
        const q = r?.[main] || Object.values(r || {})[0];
        if (q) n = Math.max(0, (q.items || 0) - (q.current_index == null ? 0 : q.current_index + 1));
      } catch (e) { return; }
      const tab = this.shadowRoot.querySelector(`.tab[data-tab="${qi}"]`);
      if (!tab) return;
      tab.querySelector(".qbadge")?.remove();
      if (n > 0) tab.insertAdjacentHTML("beforeend", `<span class="qbadge" title="${n} ${esc(this._t("queue_upcoming"))}">${n > 99 ? "99+" : n}</span>`);
    }, 400);
  }

  _updateProgress() {
    if (!this._built || !this._hass) return;
    const main = this._main();
    const s = main && this._hass.states[main];
    if (!s) return;
    const a = s.attributes;
    const dur = a.media_duration;
    let pos = a.media_position;
    if (pos != null && s.state === "playing" && a.media_position_updated_at) {
      pos += (Date.now() - new Date(a.media_position_updated_at).getTime()) / 1000;
    }
    if (dur && pos != null) pos = Math.min(pos, dur);
    const pct = dur && pos != null ? (pos / dur) * 100 : 0;
    this.$("fill").style.width = pct + "%";
    this.$("pos").textContent = s.state === "playing" || s.state === "paused" ? fmtTime(pos) : "";
    this.$("dur").textContent = dur ? fmtTime(dur) : "";
    this.$("sbMini").style.setProperty("--pct", pct + "%");
  }

  /* ---------------- group bar ---------------- */

  _renderGroupBar() {
    const bar = this.$("groupbar");
    if (!this._config.show_group_bar) { bar.hidden = true; return; }
    const main = this._main();
    const others = this._players().filter((p) => p.entity !== main);
    if (!main || !others.length) { bar.hidden = true; return; }
    bar.hidden = false;
    const members = this._members(main);
    const html = others.map((p) => {
      const s = this._hass.states[p.entity];
      const joined = members.includes(p.entity);
      const playing = s.state === "playing";
      const leaderElsewhere = !joined && this._members(p.entity).length > 0;
      const sub = playing || s.state === "paused" ? (s.attributes.media_title || "") : "";
      return `<button class="chip${joined ? " joined" : ""}${playing ? " playing" : ""}" data-player="${esc(p.entity)}" title="${esc(this._statusText(p.entity))}">
        <span class="chip-ic">${joined ? icon("mdi:link-variant") : playing ? `<span class="eq"><i></i><i></i><i></i></span>` : icon(p.icon || (leaderElsewhere ? "mdi:speaker-multiple" : "mdi:speaker"))}</span>
        <span class="chip-txt"><span class="chip-name">${esc(this._pname(p.entity))}</span>${sub ? `<span class="chip-sub">${esc(sub)}</span>` : ""}</span>
      </button>`;
    }).join("")
      + (others.some((p) => !members.includes(p.entity)) && others.length > 1 ? `<button class="chip ghost" data-groupall="1">${icon("mdi:link-variant-plus")}<span class="chip-name">${esc(this._t("group_all"))}</span></button>` : "")
      + (members.length ? `<button class="chip ghost" data-ungroup="1">${icon("mdi:link-variant-off")}<span class="chip-name">${esc(this._t("ungroup_all"))}</span></button>` : "");
    if (bar._html === html) return;
    bar._html = html;
    bar.innerHTML = html;
    if (!bar._bound) {
      bar._bound = true;
      this._bindPress(bar, "[data-player],[data-ungroup],[data-groupall]", (el) => {
        if (el.dataset.groupall) this._groupAll();
        else if (el.dataset.ungroup) {
          this._members(this._main()).forEach((m) => this._svc("media_player", "unjoin", {}, { entity_id: m }));
        } else this._toggleGroup(el.dataset.player);
      }, (el) => { if (el.dataset.player) this._playerMenu(el.dataset.player); });
    }
  }

  _groupAll() {
    const main = this._main();
    const members = this._members(main);
    const todo = this._players().map((p) => p.entity).filter((e) => e !== main && !members.includes(e));
    if (!todo.length) return;
    const go = () => this._svc("media_player", "join", { group_members: todo }, { entity_id: main })
      .catch((e) => this._toast(`${this._t("error")}: ${e.message || e}`, true));
    if (todo.some((e) => this._busy(e))) {
      this._dialog({ title: this._t("group_all"), text: this._t("group_all_q"),
        actions: [{ label: this._t("group_all"), icon: "mdi:link-variant-plus", primary: true, run: go }] });
    } else go();
  }

  /* ---------------- press handling (tap / long press / right click) ---------------- */

  _bindPress(container, selector, onTap, onLong) {
    let lp = null;
    const clear = () => { if (lp) clearTimeout(lp.timer); lp = null; };
    container.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      const el = e.target.closest(selector);
      if (!el || e.target.closest("[data-act]")) return;
      clear();
      lp = { el, x: e.clientX, y: e.clientY, fired: false };
      lp.timer = setTimeout(() => {
        if (!lp) return;
        lp.fired = true;
        if (navigator.vibrate) try { navigator.vibrate(15); } catch (er) { /* ignore */ }
        onLong(el, e);
      }, 500);
    });
    container.addEventListener("pointermove", (e) => {
      if (lp && Math.hypot(e.clientX - lp.x, e.clientY - lp.y) > 10) clear();
    });
    container.addEventListener("pointercancel", clear);
    container.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") clear(); });
    container.addEventListener("pointerup", (e) => {
      if (!lp) return;
      const { el, fired } = lp;
      clear();
      if (!fired && e.target.closest(selector) === el) onTap(el, e);
    });
    container.addEventListener("contextmenu", (e) => {
      const el = e.target.closest(selector);
      if (!el) return;
      e.preventDefault();
      clear();
      onLong(el, e);
    });
  }

  /* ---------------- tabs ---------------- */

  _tabName(tab) { return tab.name || this._t(tab.type); }

  _renderTabs() {
    setTimeout(() => this._updateQueueBadge(), 0);
    const nav = this.$("tabs");
    nav.innerHTML = this._config.tabs.map((t, i) =>
      `<button class="tab${i === this._activeTab ? " active" : ""}" data-tab="${i}">${icon(t.icon || TAB_TYPES[t.type].icon)}<span>${esc(this._tabName(t))}</span></button>`).join("");
    nav.onclick = (e) => {
      const b = e.target.closest("[data-tab]");
      if (!b) return;
      const i = +b.dataset.tab;
      if (i === this._activeTab) {
        const st = this._tabState[i];
        if (st?.stack?.length) { st.stack = []; this._showTab(i, true); return; }
        this.$("content").scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      this._showTab(i);
    };
  }

  _state(i) {
    if (!this._tabState[i]) {
      const tab = this._config.tabs[i];
      this._tabState[i] = {
        favOnly: !!tab.favorites, search: "", items: [], rawOffset: 0, scanned: 0, done: false,
        loading: false, error: null, stack: [], scroll: 0, gen: 0,
      };
    }
    return this._tabState[i];
  }

  _showTab(i, force = false) {
    const prev = this._activeTab;
    if (this._tabState[prev]) this._tabState[prev].scroll = this.$("content").scrollTop;
    this._activeTab = i;
    this._save();
    this.shadowRoot.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", +b.dataset.tab === i));
    this.shadowRoot.querySelector(`.tab[data-tab="${i}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
    const tab = this._config.tabs[i];
    const st = this._state(i);
    this._renderToolbar();
    if (tab.type === "queue") { this._loadQueue(true); return; }
    const content = this.$("content");
    content.innerHTML = `<div class="grid" id="grid"></div><div class="sentinel" id="sentinel"></div><div class="status" id="status"></div>`;
    if (force || (!st.items.length && !st.done) || st.error) this._resetTab(i);
    else {
      this._appendTiles(st.items, 0);
      content.scrollTop = st.scroll;
      this._updateStatus();
    }
    this._observe();
  }

  _resetTab(i) {
    const st = this._state(i);
    st.items = []; st.seen = new Set(); st.rawOffset = 0; st.scanned = 0; st.done = false; st.error = null; st.loading = false; st.gen++;
    st.children = null;
    if (i === this._activeTab) {
      const g = this.$("grid");
      if (g) g.innerHTML = "";
      this._loadMore(i);
    }
  }

  _renderToolbar() {
    const i = this._activeTab;
    const tab = this._config.tabs[i];
    const st = this._state(i);
    const bar = this.$("toolbar");
    if (tab.type === "queue") {
      bar.innerHTML = `<div class="tb-title">${icon("mdi:playlist-music")}<span>${esc(this._pname(this._main() || ""))}</span></div>
        <span class="spacer"></span>
        <button class="ib" data-tb="refresh" title="${esc(this._t("refresh"))}">${icon("mdi:refresh")}</button>
        <button class="ib" data-tb="clear" title="${esc(this._t("clear_queue"))}">${icon("mdi:playlist-remove")}</button>`;
    } else {
      const drill = st.stack.length ? st.stack[st.stack.length - 1] : null;
      bar.innerHTML = `
        ${drill ? `<button class="ib" data-tb="back" title="${esc(this._t("back"))}">${icon("mdi:arrow-left")}</button><div class="tb-title"><span>${esc(drill.name)}</span></div>` : ""}
        ${drill || tab.type === "playlist" ? `<span class="tb-play"><button class="ib play-all" data-tb="pl-replace" title="${esc(this._t("play_replace"))}">${icon("mdi:play")}</button><button class="ib" data-tb="pl-next" title="${esc(this._t("play_next"))}">${icon("mdi:playlist-play")}</button><button class="ib" data-tb="pl-add" title="${esc(this._t("add_queue"))}">${icon("mdi:playlist-plus")}</button></span>` : ""}
        <label class="search">${icon("mdi:magnify")}<input id="search" type="search" placeholder="${esc(this._t("search"))}" value="${esc(st.search)}" enterkeyhint="search"></label>
        ${tab.show_favorites_toggle === false ? "" : `<button class="fav-toggle${st.favOnly ? " on" : ""}" data-tb="fav" title="${esc(this._t("favorites"))}">${icon(st.favOnly ? "mdi:heart" : "mdi:heart-outline")}<span>${esc(this._t("favorites"))}</span></button>`}
        <button class="ib" data-tb="refresh" title="${esc(this._t("refresh"))}">${icon("mdi:refresh")}</button>`;
      const inp = bar.querySelector("#search");
      inp.addEventListener("input", () => {
        clearTimeout(this._searchT);
        this._searchT = setTimeout(() => { st.search = inp.value.trim(); this._resetTab(i); }, 450);
      });
    }
    bar.onclick = (e) => {
      const b = e.target.closest("[data-tb]");
      if (!b) return;
      switch (b.dataset.tb) {
        case "fav": st.favOnly = !st.favOnly; this._renderToolbar(); this._resetTab(i); break;
        case "refresh": tab.type === "queue" ? this._loadQueue(true) : this._resetTab(i); break;
        case "back": st.stack.pop(); this._renderToolbar(); this._resetTab(i); break;
        case "pl-replace": case "pl-next": case "pl-add": this._playList(i, b.dataset.tb.slice(3)); break;
        case "clear": this._dialog({
          title: this._t("clear_queue"), text: "",
          actions: [{ label: this._t("clear_queue"), icon: "mdi:playlist-remove", primary: true,
            run: () => this._svc("media_player", "clear_playlist", {}, { entity_id: this._main() }).then(() => this._loadQueue(true)) }],
        }); break;
      }
    };
  }

  _drillIn(i, item) {
    if (i !== this._activeTab) return;
    const st = this._state(i);
    st.stack.push({ name: item.name, uri: item.uri, kind: item.media_type });
    st.search = "";
    this._renderToolbar();
    this._resetTab(i);
    this.$("content").scrollTop = 0;
  }

  _observe() {
    this._io?.disconnect();
    const sentinel = this.$("sentinel");
    if (!sentinel) return;
    this._io = new IntersectionObserver((ents) => {
      if (ents.some((e) => e.isIntersecting)) this._loadMore(this._activeTab);
    }, { root: this.$("content"), rootMargin: "600px" });
    this._io.observe(sentinel);
  }

  async _loadMore(i) {
    const tab = this._config.tabs[i];
    const st = this._state(i);
    if (st.loading || st.done || tab.type === "queue") return;
    st.loading = true;
    const gen = st.gen;
    this._updateStatus();
    try {
      const drill = st.stack.length ? st.stack[st.stack.length - 1] : null;
      if (drill || tab.type === "playlist" || tab.type === "played") {
        if (!st.children) {
          let list;
          if (tab.type === "played" && !drill) {
            const mt = tab.media_type || "track";
            const r = await this._mqCmd("music/recently_played_items", { limit: tab.limit || 100, media_types: [mt], fully_played_only: false });
            list = (r || []).map((x) => this._normalize(x));
          } else {
            list = drill ? await this._fetchChildren(drill.kind, drill.uri)
              : await this._fetchChildren("playlist", await this._resolvePlaylistUri(tab));
          }
          await this._markFavorites(list);
          if (!drill) this._applyGenres(list, await this._genreMap(tab, "track").catch(() => null));
          st.children = list;
        }
        if (gen !== st.gen) return;
        const ast = drill ? null : tab._ast;
        const q = fold(st.search);
        const out = st.children.filter((x) => (!st.favOnly || x.favorite) && evalFilter(ast, x)
          && (!q || fold([x.name, ...(x.artists || []), x.album].join(" ")).includes(q)));
        st.scanned = st.children.length;
        st.done = true;
        this._pushItems(i, out);
        return;
      }
      const def = TAB_TYPES[tab.type];
      const media_type = tab.media_type || def.media_type;
      const order_by = tab.order_by || def.order_by;
      const pageSize = Math.max(25, Math.min(500, this._config.page_size));
      const want = pageSize;
      let added = [];
      const limitTotal = tab.limit || Infinity;
      const gmap = await this._genreMap(tab, media_type).catch(() => null);
      if (gen !== st.gen) return;
      while (added.length < want && !st.done) {
        const raw = await this._fetchLibrary(media_type, {
          offset: st.rawOffset, limit: pageSize, favorite: st.favOnly, search: st.search || undefined,
          order_by, album_type: tab.album_type,
        });
        if (gen !== st.gen) return;
        st.rawOffset += raw.length;
        st.scanned += raw.length;
        if (raw.length < pageSize) st.done = true;
        added = added.concat(this._applyGenres(raw, gmap).filter((x) => evalFilter(tab._ast, x)));
        if (!tab._ast) break;
        if (st.scanned >= (tab.max_scan || this._config.max_scan)) { st.done = true; break; }
        this._updateStatus(st.items.length + added.length);
      }
      if (st.items.length + added.length >= limitTotal) {
        added = added.slice(0, limitTotal - st.items.length);
        st.done = true;
      }
      this._pushItems(i, added);
    } catch (e) {
      st.error = e.message || String(e);
      st.done = true;
    } finally {
      if (gen === st.gen) {
        st.loading = false;
        if (i === this._activeTab) {
          this._updateStatus();
          requestAnimationFrame(() => {
            const c = this.$("content");
            if (c && !st.done && c.scrollHeight <= c.clientHeight + 600) this._loadMore(i);
          });
        }
      }
    }
  }

  _pushItems(i, items) {
    const st = this._state(i);
    const start = st.items.length;
    // Doppelte Einträge (gleiche URI, oder gleicher Name/Interpret/Album/Version) nur einmal zeigen
    st.seen = st.seen || new Set();
    items = items.filter((x) => {
      const k1 = x.uri, k2 = fold([x.media_type, x.name, x.version, (x.artists || []).join(","), x.album].join("|"));
      if (st.seen.has(k1) || st.seen.has(k2)) return false;
      st.seen.add(k1); st.seen.add(k2);
      return true;
    });
    st.items.push(...items);
    if (i === this._activeTab) this._appendTiles(st.items.slice(start), start);
  }

  _appendTiles(items, start) {
    const grid = this.$("grid");
    if (!grid) return;
    const frag = document.createElement("template");
    frag.innerHTML = items.map((it, k) => this._tileHtml(it, start + k)).join("");
    grid.appendChild(frag.content);
  }

  _tileHtml(it, idx) {
    const img = this._image(it);
    const sub = it.media_type === "album" || it.media_type === "track" ? (it.artists || []).join(", ")
      : it.media_type === "playlist" ? (it.owner && it.owner !== "me" ? it.owner : "")
      : it.media_type === "artist" ? "" : "";
    const cls = it.media_type === "artist" ? " round" : it.media_type === "radio" ? " radio" : "";
    return `<div class="tile${cls}" data-i="${idx}" title="${esc(it.name)}${sub ? " – " + esc(sub) : ""}">
      <div class="art">${img ? `<img loading="lazy" decoding="async" src="${esc(img)}" alt="" draggable="false" onerror="this.remove()">` : ""}${icon(TYPE_ICON[it.media_type] || "mdi:music", "ph-ic")}
        ${it.favorite ? `<span class="badge">${icon("mdi:heart")}</span>` : ""}
      </div>
      <div class="t1">${esc(it.name)}</div>
      ${sub ? `<div class="t2">${esc(sub)}</div>` : ""}
    </div>`;
  }

  _refreshImages() {
    if (this._config.tabs[this._activeTab]?.type !== "queue" && this.$("grid")) {
      const st = this._state(this._activeTab);
      this.$("grid").innerHTML = "";
      this._appendTiles(st.items, 0);
    }
  }

  _updateStatus(count) {
    const el = this.$("status");
    if (!el) return;
    const st = this._state(this._activeTab);
    const n = count ?? st.items.length;
    if (st.error) el.innerHTML = `<div class="err">${icon("mdi:alert-circle")} ${esc(st.error)}</div>`;
    else if (st.loading) el.innerHTML = `<div class="spin"></div><span>${esc(this._t("loading"))}${this._config.tabs[this._activeTab]._ast && st.scanned ? ` ${st.scanned} ${esc(this._t("scanned"))}` : ""}</span>`;
    else if (!n && st.done) el.innerHTML = `<div class="empty">${icon("mdi:music-off")}<span>${esc(this._t("no_items"))}</span></div>`;
    else el.innerHTML = st.done && n ? `<span class="count">${n}</span>` : "";
  }

  _bindContent() {
    const content = this.$("content");
    const itemAt = (el) => this._state(this._activeTab).items[+el.dataset.i];
    this._bindPress(content, ".tile[data-i], .qrow[data-q]", (el) => {
      if (el.dataset.q != null) { this._queuePlay(el.dataset.q); return; }
      const it = itemAt(el);
      if (it) this._activateItem(it);
    }, (el) => {
      if (el.dataset.q != null) { this._queueMenu(el.dataset.q); return; }
      const it = itemAt(el);
      if (it) this._itemMenu(it, this._activeTab);
    });
    content.addEventListener("click", (e) => {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      e.stopPropagation();
      const row = b.closest("[data-q]");
      if (row) this._queueAction(b.dataset.act, row.dataset.q);
    });
  }

  /* ---------------- queue ---------------- */

  async _loadQueue(force) {
    const i = this._activeTab;
    if (this._config.tabs[i]?.type !== "queue") return;
    const content = this.$("content");
    const e = await this._resolveEntries();
    if (!e.mq) {
      content.innerHTML = `<div class="status"><div class="empty">${icon("mdi:information-outline")}<span>${esc(this._t("queue_needs_mq"))}</span></div></div>`;
      return;
    }
    const main = this._main();
    if (!main) return;
    if (!this._queue || force) {
      if (!content.querySelector(".qlist")) content.innerHTML = `<div class="status"><div class="spin"></div><span>${esc(this._t("loading"))}</span></div>`;
      try {
        const r = await this._svc("mass_queue", "get_queue_items",
          { entity: main, limit_before: this._config.queue_before ?? 5, limit_after: this._config.queue_limit }, null, true);
        const raw = r?.[main] || Object.values(r || {})[0] || [];
        this._queue = { entity: main, items: await this._markFavorites(raw.map((x) => this._normalize(x))) };
      } catch (err) {
        content.innerHTML = `<div class="status"><div class="err">${icon("mdi:alert-circle")} ${esc(err.message || err)}</div></div>`;
        return;
      }
    }
    if (this._config.tabs[this._activeTab]?.type !== "queue") return;
    const items = this._queue.items;
    if (!items.length) {
      content.innerHTML = `<div class="status"><div class="empty">${icon("mdi:playlist-remove")}<span>${esc(this._t("queue_empty"))}</span></div></div>`;
      return;
    }
    const t = (k) => esc(this._t(k));
    content.innerHTML = `<div class="qlist">${items.map((it, k) => `
      <div class="qrow" data-q="${k}">
        <div class="qart">${it.image ? `<img loading="lazy" src="${esc(it.image)}" alt="" draggable="false" onerror="this.remove()">` : ""}${icon("mdi:music-note", "ph-ic")}</div>
        <div class="qtxt"><div class="t1"><span class="qfav"${it.favorite ? "" : " hidden"}>${icon("mdi:heart")}</span>${esc(it.name)}</div><div class="t2">${esc([it.artists.join(", "), it.album].filter(Boolean).join(" · "))}</div></div>
        <span class="qdur">${fmtTime(it.duration)}</span>
        <div class="qbtns">
          <button class="ib sm" data-act="up" title="${t("move_up")}">${icon("mdi:arrow-up")}</button>
          <button class="ib sm" data-act="down" title="${t("move_down")}">${icon("mdi:arrow-down")}</button>
          <button class="ib sm" data-act="next" title="${t("move_next")}">${icon("mdi:format-vertical-align-top")}</button>
          <button class="ib sm danger" data-act="remove" title="${t("remove")}">${icon("mdi:close")}</button>
        </div>
      </div>`).join("")}</div>`;
    this._markQueueCurrent(true);
  }

  _markQueueCurrent(scroll) {
    if (!this._queue) return;
    const s = this._hass.states[this._main()];
    const title = s?.attributes.media_title;
    let cur = -1;
    if (title) {
      const before = Math.min(this._config.queue_before ?? 5, this._queue.items.length - 1);
      const hits = this._queue.items.map((x, k) => (x.name === title ? k : -1)).filter((k) => k >= 0);
      cur = hits.length ? hits.reduce((a, b) => (Math.abs(b - before) < Math.abs(a - before) ? b : a)) : -1;
    }
    this.shadowRoot.querySelectorAll(".qrow").forEach((r) => {
      const k = +r.dataset.q;
      r.classList.toggle("current", k === cur);
      r.classList.toggle("past", cur >= 0 && k < cur);
    });
    if (scroll && cur > 0) this.shadowRoot.querySelector(`.qrow[data-q="${cur}"]`)?.scrollIntoView({ block: "center" });
  }

  async _queueAction(act, k) {
    setTimeout(() => this._updateQueueBadge(), 900);
    const it = this._queue?.items[+k];
    if (!it?.queue_item_id) return;
    const svc = { up: "move_queue_item_up", down: "move_queue_item_down", next: "move_queue_item_next", remove: "remove_queue_item", play: "play_queue_item" }[act];
    try {
      await this._svc("mass_queue", svc, { entity: this._queue.entity, queue_item_id: it.queue_item_id });
      const items = this._queue.items;
      const idx = +k;
      if (act === "remove") items.splice(idx, 1);
      else if (act === "up" && idx > 0) [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]];
      else if (act === "down" && idx < items.length - 1) [items[idx + 1], items[idx]] = [items[idx], items[idx + 1]];
      this._loadQueue(false);
      clearTimeout(this._qT);
      this._qT = setTimeout(() => this._loadQueue(true), 700);
    } catch (e) { this._toast(`${this._t("error")}: ${e.message || e}`, true); }
  }

  _queuePlay(k) { this._queueAction("play", k); }

  _queueMenu(k) {
    const it = this._queue?.items[+k];
    if (!it) return;
    this._dialog({
      title: it.name, text: it.artists.join(", "), image: it.image,
      like: this._entries?.mq ? { on: !!it.favorite, run: () => this._toggleFavorite(it) } : null,
      actions: [
        { label: this._t("play_now"), icon: "mdi:play", primary: true, run: () => this._queueAction("play", k) },
        { label: this._t("move_next"), icon: "mdi:format-vertical-align-top", run: () => this._queueAction("next", k) },
        { label: this._t("start_radio"), icon: "mdi:radio-tower", run: () => this._play({ ...it, media_type: "track" }, "replace", true) },
        { label: this._t("remove"), icon: "mdi:close", run: () => this._queueAction("remove", k) },
      ],
    });
  }

  /* ---------------- dialog / toast ---------------- */

  _dialog({ title, text, item, image, actions, html, like, big }) {
    const ov = this.$("overlay");
    this._ovOpen = false; ov.onchange = ov.oninput = null;
    const img = image || (item && this._image(item));
    ov.innerHTML = `<div class="sheet${big ? " big" : ""}" role="dialog" aria-modal="true">
      <div class="sheet-head">
        ${img ? `<img src="${esc(img)}" alt="" draggable="false">` : item ? `<div class="sheet-ph">${icon(TYPE_ICON[item.media_type] || "mdi:music")}</div>` : ""}
        <div class="sheet-ht"><div class="sheet-title">${esc(title)}</div>${text ? `<div class="sheet-text">${esc(text)}</div>` : ""}</div>
        ${like ? `<button class="ib like-sheet${like.on ? " on" : ""}" data-like="1" title="${esc(this._t(like.on ? "unlike" : "like"))}">${icon(like.on ? "mdi:heart" : "mdi:heart-outline")}</button>` : ""}
      </div>
      ${html || ""}
      <div class="sheet-actions">
        ${actions.map((a, k) => `<button class="act${a.primary ? " primary" : ""}${a.active ? " active" : ""}" data-k="${k}">${icon(a.icon)}<span class="act-l"><span>${esc(a.label)}</span>${a.sub ? `<small>${esc(a.sub)}</small>` : ""}</span>${a.active ? icon("mdi:check", "act-chk") : ""}</button>`).join("")}
        <button class="act cancel" data-k="-1"><span>${esc(this._t("cancel"))}</span></button>
      </div>
    </div>`;
    ov.hidden = false;
    const close = () => { ov.hidden = true; ov.innerHTML = ""; document.removeEventListener("keydown", onKey); };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    const opened = Date.now();
    ov.onclick = (e) => {
      if (Date.now() - opened < 450) return; // Ghost-Klick des öffnenden Tipps (iOS) ignorieren
      if (e.target === ov) return close();
      const lb = e.target.closest("[data-like]");
      if (lb && like) {
        like.on = !like.on;
        lb.classList.toggle("on", like.on);
        lb.innerHTML = icon(like.on ? "mdi:heart" : "mdi:heart-outline");
        like.run();
        return;
      }
      const b = e.target.closest("[data-k]");
      if (!b) return;
      const k = +b.dataset.k;
      close();
      if (k >= 0) actions[k].run();
    };
    ov.oncontextmenu = (e) => e.preventDefault();
    ov.querySelector(".act")?.focus();
  }

  _toast(msg, err = false) {
    const t = this.$("toast");
    if (!t) return;
    t.textContent = msg;
    t.className = "toast show" + (err ? " err" : "");
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => { t.className = "toast"; }, err ? 4500 : 2200);
  }
}

/* ================================================================== CSS */

const CSS = `
:host { display:block; height:100%; --mafc-accent: var(--primary-color, #03a9f4); }
.card { display:block; height:100%; overflow:hidden; position:relative; background: transparent; box-shadow:none; border:none; }
ha-card.card { background: var(--ha-card-background, var(--card-background-color, #fff)); box-shadow: var(--ha-card-box-shadow, none); border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0)); }
* { box-sizing:border-box; }
button { font:inherit; color:inherit; }
ha-icon { --mdc-icon-size: 22px; display:inline-flex; }
.root { position:relative; width:100%; overflow:hidden; color: var(--primary-text-color); font-family: var(--paper-font-body1_-_font-family, var(--ha-font-family-body, inherit)); }

/* ---------- Sidebar ---------- */
.sidebar { position:absolute; z-index:4; overflow:hidden; display:flex; flex-direction:column;
  background: var(--mafc-sidebar-background, transparent);
  transition: width .25s ease, height .25s ease, box-shadow .25s; }
.sb-bg { position:absolute; inset:-40px; background-size:cover; background-position:center; filter: blur(40px) saturate(1.4); opacity:.28; pointer-events:none; }
.sb-full, .sb-mini { position:relative; }
.side .sidebar { top:0; bottom:0; width: var(--sb-w); }
.pos-left .sidebar { left:0; border-right:1px solid var(--divider-color, rgba(127,127,127,.2)); }
.pos-right .sidebar { right:0; border-left:1px solid var(--divider-color, rgba(127,127,127,.2)); }
.stack .sidebar { left:0; right:0; }
.pos-top .sidebar { top:0; border-bottom:1px solid var(--divider-color, rgba(127,127,127,.2)); }
.pos-bottom .sidebar { bottom:0; border-top:1px solid var(--divider-color, rgba(127,127,127,.2)); }
.side.collapsed .sidebar { width: var(--mini); }
.stack.collapsed .sidebar { height: var(--mini); }
.scrim { display:none; }

.root.collapsed .sb-full { display:none !important; }
.root:not(.collapsed) .sb-mini { display:none !important; }

.sb-full { display:flex; flex-direction:column; gap:10px; padding:12px 14px 14px; height:100%; overflow:auto; }
.stack .sb-full { height:auto; display:grid; gap:6px 14px; padding:10px 14px;
  grid-template-columns: auto 1fr auto; grid-template-areas: "cover head head" "cover info controls" "cover progress volume"; align-items:center; }
.stack.compact .sb-full { grid-template-columns: auto 1fr; grid-template-areas: "head head" "cover info" "progress progress" "controls controls" "volume volume"; }
.stack .sb-head { grid-area: head; } .stack .cover-wrap { grid-area: cover; } .stack .info { grid-area: info; }
.stack .progress { grid-area: progress; } .stack .controls { grid-area: controls; } .stack .volume { grid-area: volume; min-width:200px; }

.sb-head { display:flex; align-items:center; gap:4px; }
.select-wrap { flex:1; min-width:0; position:relative; display:flex; align-items:center; gap:8px; padding:0 10px 0 12px; height: var(--tap);
  border:0; border-radius: 999px; background: rgba(127,127,127,.14); cursor:pointer; font-weight:600; font-size:15px; text-align:left; }
.select-wrap:hover { background: rgba(127,127,127,.22); }
.select-wrap .sel-ic { --mdc-icon-size:18px; color: var(--sidebar-selected-icon-color, var(--mafc-accent)); }
.sel-name { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.sel-chev { --mdc-icon-size:20px; color: var(--secondary-text-color); }
#pinBtn.on { color: var(--sidebar-selected-icon-color, var(--primary-color)); position:relative; }
#pinBtn.on::before { content:""; position:absolute; inset:0; border-radius:50%; background: var(--sidebar-selected-icon-color, var(--primary-color)); opacity:.12; }
.cover-wrap { position:relative; }
.cover { cursor:pointer; }
.ib.like.on, .ib.like-sheet.on { color:#ff4f7b; }
.qfav { color:#ff4f7b; margin-right:4px; vertical-align:-2px; } .qfav ha-icon { --mdc-icon-size:15px; } .qfav[hidden] { display:none; }
.ib[hidden] { display:none; }
.controls .ib { flex: 0 1 auto; min-width: 0; }
.pop-bd { position:absolute; inset:0; z-index:9; }
.pop { position:absolute; z-index:10; overflow:auto; padding:6px; border-radius:14px; display:flex; flex-direction:column; gap:2px;
  background: var(--ha-card-background, var(--card-background-color, #fff)); color: var(--primary-text-color);
  border:1px solid var(--divider-color, rgba(127,127,127,.25)); box-shadow: 0 10px 32px rgba(0,0,0,.35); }
.pop[hidden], .pop-bd[hidden] { display:none; }
.pop-it { display:flex; align-items:center; gap:12px; border:0; background:transparent; border-radius:10px; padding:6px 10px; min-height: var(--tap);
  cursor:pointer; color:inherit; font:inherit; font-size:15px; text-align:left; }
.pop-it:hover { background: rgba(127,127,127,.12); }
.pop-it.active { position:relative; color: var(--sidebar-selected-text-color, var(--primary-color)); }
.pop-it.active::before { content:""; position:absolute; inset:0; border-radius:inherit; background: var(--sidebar-selected-icon-color, var(--primary-color)); opacity:.12; }
.pop-it > * { position:relative; }
.pop-ic { width:28px; display:flex; justify-content:center; color: var(--secondary-text-color); }
.pop-it.active .pop-ic { color: var(--sidebar-selected-icon-color, var(--primary-color)); }
.qbadge { position:relative; min-width:18px; height:18px; padding:0 5px; border-radius:9px; font-size:11px; font-weight:600; line-height:18px; text-align:center;
  background: rgba(127,127,127,.25); color: var(--primary-text-color); }
select { appearance:none; -webkit-appearance:none; flex:1; min-width:0; border:0; background:transparent; color:inherit; font:inherit; font-weight:600;
  font-size:15px; height:100%; outline:none; cursor:pointer; text-overflow:ellipsis; }
select option { color: var(--primary-text-color); background: var(--card-background-color, #fff); }

.cover-wrap { display:flex; justify-content:center; flex: 0 1 auto; min-height:0; align-self:center; }
.cover { width:100%; max-width:320px; aspect-ratio:1; border-radius: calc(var(--ha-card-border-radius, 12px) * .8); overflow:hidden;
  background: rgba(127,127,127,.15); box-shadow: 0 6px 24px rgba(0,0,0,.25); }
.side .cover { max-height: 42vh; max-width: min(320px, 42vh); }
.stack .cover { width: 104px; } .stack.compact .cover { width:72px; }
.cover img, .mini-cover img { width:100%; height:100%; object-fit:cover; display:block; -webkit-user-drag:none; }
.ph { width:100%; height:100%; display:flex; align-items:center; justify-content:center; color: var(--secondary-text-color); }
.ph ha-icon { --mdc-icon-size: 64px; }
.mini-cover .ph ha-icon { --mdc-icon-size: 26px; }

.info { text-align:center; min-width:0; }
.stack .info { text-align:left; }
.title { font-size:18px; font-weight:600; line-height:1.25; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
.artist { font-size:15px; color: var(--secondary-text-color); margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.album { font-size:13px; color: var(--secondary-text-color); opacity:.8; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.grouped { font-size:12px; color: var(--mafc-accent); margin-top:4px; display:flex; gap:4px; align-items:center; justify-content:center; }
.grouped ha-icon { --mdc-icon-size:16px; }
.stack .grouped { justify-content:flex-start; }
.progress .bar { height:6px; border-radius:3px; background: rgba(127,127,127,.25); cursor:pointer; position:relative; touch-action:none; }
.progress .bar::before { content:""; position:absolute; inset:-10px 0; }
.progress .fill { height:100%; border-radius:3px; background: var(--mafc-accent); width:0; transition: width 1s linear; }
.times { display:flex; justify-content:space-between; font-size:12px; color: var(--secondary-text-color); margin-top:4px; font-variant-numeric: tabular-nums; }
.controls { display:flex; align-items:center; justify-content:center; gap:6px; }
.volume { display:flex; align-items:center; gap:2px; }
.volume input[type=range] { margin:0 6px; -webkit-appearance:none; appearance:none; background:transparent; height: var(--tap); cursor:pointer; touch-action: pan-y; }
.volume input[type=range]::-webkit-slider-runnable-track { height:6px; border-radius:3px; background: linear-gradient(to right, var(--mafc-accent) var(--v, 0%), rgba(127,127,127,.3) var(--v, 0%)); }
.volume input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width: calc(var(--tap) / 2); height: calc(var(--tap) / 2); margin-top: calc(3px - var(--tap) / 4);
  border-radius:50%; background: var(--mafc-accent); border:0; box-shadow: 0 1px 4px rgba(0,0,0,.35); }
.volume input[type=range]::-moz-range-track { height:6px; border-radius:3px; background: rgba(127,127,127,.3); }
.volume input[type=range]::-moz-range-progress { height:6px; border-radius:3px; background: var(--mafc-accent); }
.volume input[type=range]::-moz-range-thumb { width: calc(var(--tap) / 2); height: calc(var(--tap) / 2); border-radius:50%; background: var(--mafc-accent); border:0; }
.volv { font-size:12px; width:26px; text-align:right; color: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
input[type=range] { flex:1; min-width:0; accent-color: var(--mafc-accent); height: 28px; }

.ib { border:0; background:transparent; width: var(--tap); height: var(--tap); min-width: var(--tap); border-radius:50%; display:inline-flex; align-items:center;
  justify-content:center; cursor:pointer; color: var(--primary-text-color); -webkit-tap-highlight-color: transparent; }
.ib:hover { background: rgba(127,127,127,.15); }
.ib:active { transform: scale(.94); }
.ib.sm ha-icon { --mdc-icon-size:20px; }
.ib.on { color: var(--mafc-accent); }
.ib.play { width: calc(var(--tap) + 16px); height: calc(var(--tap) + 16px); background: var(--mafc-accent); color: var(--text-primary-color, #fff); }
.ib.play ha-icon { --mdc-icon-size:32px; }
.ib.danger:hover { color: var(--error-color, #db4437); }

.sb-mini { display:flex; align-items:center; gap:8px; padding:8px; height:100%; }
.side .sb-mini { flex-direction:column; padding:10px 8px; }
.mini-cover { width:52px; height:52px; flex:none; border-radius:8px; overflow:hidden; background: rgba(127,127,127,.15); cursor:pointer; }
.mini-info { flex:1; min-width:0; cursor:pointer; }
.mini-info .title { font-size:15px; -webkit-line-clamp:1; }
.mini-info .artist { font-size:13px; }
.side .mini-info { display:none; }
.mini-ctl { display:flex; align-items:center; gap:2px; }
.side .mini-ctl { flex-direction:column; }
.mini-exp { margin-left:auto; }
.side .mini-ov { margin-top:auto; }
.ov-btn { display:flex; align-items:center; gap:10px; border:0; border-radius:12px; padding:0 12px; min-height: var(--tap); cursor:pointer;
  background: rgba(127,127,127,.12); color: inherit; font:inherit; font-size:14px; font-weight:500; margin-top:auto; flex:none; }
.ov-btn:hover { background: rgba(127,127,127,.2); }
.ov-btn > span { flex:1; text-align:left; } .ov-chev { --mdc-icon-size:18px; color: var(--secondary-text-color); }
.stack .ov-btn { display:none; } .side .ov-head { display:none; }
.sheet.ovw { width: min(980px, 100%); max-height:100%; padding:14px 16px 16px; }
.ovw-head { display:flex; align-items:center; gap:8px; margin-bottom:10px; } .ovw-head .spacer { flex:1; }
.ovw-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap:12px; }
.pcard { display:flex; gap:12px; padding:10px; border-radius:16px; background: rgba(127,127,127,.08); border:1.5px solid transparent; min-width:0; }
.pcard.is-main { border-color: var(--sidebar-selected-icon-color, var(--mafc-accent)); }
.pc-art { position:relative; width:96px; height:96px; flex:none; border-radius:12px; overflow:hidden; background: rgba(127,127,127,.15);
  display:flex; align-items:center; justify-content:center; color: var(--secondary-text-color); }
.pc-art img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:1; }
.pc-body { flex:1; min-width:0; display:flex; flex-direction:column; gap:2px; }
.pc-name { display:flex; align-items:center; gap:6px; font-weight:600; font-size:15px; min-width:0; }
.pc-name > span:not(.eq):not(.pc-tag) { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pc-name ha-icon { --mdc-icon-size:18px; color: var(--secondary-text-color); }
.pcard.playing .pc-name .eq { color: var(--accent-color, var(--mafc-accent)); }
.pc-tag { flex:none; font-size:11px; font-weight:600; padding:1px 7px; border-radius:9px; color: var(--sidebar-selected-icon-color, var(--mafc-accent));
  background: color-mix(in srgb, var(--sidebar-selected-icon-color, var(--mafc-accent)) 14%, transparent); display:inline-flex; align-items:center; }
.pc-tag ha-icon { --mdc-icon-size:13px; color:inherit; }
.pc-t { font-size:14px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pc-a { font-size:12px; color: var(--secondary-text-color); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-height:15px; }
.pc-ctl { display:flex; align-items:center; gap:2px; margin-top:2px; } .pc-ctl .spacer { flex:1; }
.pc-pp { background: var(--mafc-accent); color: var(--text-primary-color, #fff); }
.pc-vol { margin-top:-4px; }
@media (max-width: 520px) {
  .overlay:has(.ovw) { padding:8px; }
  .sheet.ovw { padding:12px 10px; }
  .pcard { gap:10px; padding:8px; }
  .pc-art { width:64px; height:64px; border-radius:10px; }
  .pc-ctl { flex-wrap:wrap; }
  .pc-ctl .ib, .pc-vol .ib { width: calc(var(--tap) - 8px); min-width: calc(var(--tap) - 8px); height: calc(var(--tap) - 8px); }
  .pc-vol .volv { display:none; }
}
.side .mini-exp { margin: 0; }
.stack .sb-mini::after { content:""; position:absolute; left:0; bottom:0; height:3px; width: var(--pct, 0); background: var(--mafc-accent); transition: width 1s linear; }
.pos-bottom .sb-mini::after { top:0; bottom:auto; }

/* ---------- Main ---------- */
.main { position:absolute; inset:0; display:flex; flex-direction:column; min-width:0; transition: left .25s, right .25s, top .25s, bottom .25s; }
.pos-left .main { left: var(--reserve); } .pos-right .main { right: var(--reserve); }
.pos-top .main { top: var(--reserve); } .pos-bottom .main { bottom: var(--reserve); }

.groupbar { display:flex; gap:8px; padding:10px 12px 4px; overflow-x:auto; scrollbar-width:none; flex:none; }
.groupbar::-webkit-scrollbar, .tabs::-webkit-scrollbar { display:none; }
.groupbar[hidden] { display:none; }
.chip { flex:none; display:flex; align-items:center; gap:8px; height: var(--tap); padding: 0 14px 0 8px; border-radius:999px; cursor:pointer;
  border: 1.5px solid var(--divider-color, rgba(127,127,127,.3)); background: transparent; max-width: 230px; user-select:none; -webkit-user-select:none;
  -webkit-touch-callout:none; -webkit-tap-highlight-color: transparent; transition: background .2s, border-color .2s; }
.chip:hover { background: rgba(127,127,127,.1); }
.chip-ic { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; background: rgba(127,127,127,.15); flex:none; }
.chip-ic ha-icon { --mdc-icon-size:18px; }
.chip-txt { display:flex; flex-direction:column; min-width:0; line-height:1.15; text-align:left; }
.chip-name { font-size:14px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.chip-sub { font-size:11px; color: var(--secondary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:160px; }
.chip.playing { border-color: var(--accent-color, var(--mafc-accent)); }
.chip.playing .chip-ic { background: color-mix(in srgb, var(--accent-color, var(--mafc-accent)) 22%, transparent); color: var(--accent-color, var(--mafc-accent)); }
.chip.joined { background: var(--mafc-accent); border-color: var(--mafc-accent); color: var(--text-primary-color, #fff); }
.chip.joined .chip-ic { background: rgba(255,255,255,.22); color: inherit; }
.chip.joined .chip-sub { color: inherit; opacity:.85; }
.chip.ghost { border-style:dashed; padding-left:12px; }
.eq { display:flex; gap:2px; align-items:flex-end; height:14px; }
.eq i { width:3px; background: currentColor; border-radius:1px; animation: eq 1s ease-in-out infinite; }
.eq i:nth-child(2) { animation-delay: -.3s; } .eq i:nth-child(3) { animation-delay: -.6s; }
@keyframes eq { 0%,100% { height:30%; } 50% { height:100%; } }

.tb-play { display:flex; align-items:center; gap:2px; flex:none; }
.tb-play .play-all { background: var(--mafc-accent); color: var(--text-primary-color, #fff); }
.tabs { display:flex; gap:4px; padding:6px 8px; overflow-x:auto; scrollbar-width:none; flex:none; border-bottom:1px solid var(--divider-color, rgba(127,127,127,.2)); }
.tab { flex:none; position:relative; display:flex; align-items:center; gap:12px; border:0; background:none; cursor:pointer; padding:0 12px; height: var(--tap); border-radius:4px;
  font-size:14px; font-weight:500; color: var(--sidebar-text-color, var(--primary-text-color)); -webkit-tap-highlight-color: transparent; }
.tab::before { content:""; position:absolute; inset:0; border-radius:inherit; background: var(--sidebar-selected-icon-color, var(--primary-color)); opacity:0; }
.tab:hover::before { opacity:.04; } .tab.active::before { opacity:.12; } .tab > * { position:relative; }
.tab ha-icon { --mdc-icon-size:24px; color: var(--sidebar-icon-color, var(--secondary-text-color)); }
.tab.active { color: var(--sidebar-selected-text-color, var(--primary-color)); } .tab.active ha-icon { color: var(--sidebar-selected-icon-color, var(--primary-color)); }
.compact .tab span { display:none; } .compact .tab.active span { display:inline; }

.toolbar { display:flex; align-items:center; gap:8px; padding: 8px 12px; flex:none; flex-wrap:wrap; }
.tb-title { display:flex; align-items:center; gap:6px; font-weight:600; font-size:15px; min-width:0; }
.tb-title span { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width: 40vw; }
.spacer { flex:1; }
.search { flex:1; min-width:140px; display:flex; align-items:center; gap:6px; height: var(--tap); padding: 0 12px; border-radius:999px; background: rgba(127,127,127,.12); }
.search ha-icon { --mdc-icon-size:20px; color: var(--secondary-text-color); }
.search input { flex:1; min-width:0; border:0; background:transparent; outline:none; color: inherit; font: inherit; font-size:15px; }
.fav-toggle { display:flex; align-items:center; gap:6px; height: var(--tap); padding: 0 14px; border-radius:999px; cursor:pointer; font-size:14px; font-weight:500;
  border: 1.5px solid var(--divider-color, rgba(127,127,127,.3)); background:transparent; -webkit-tap-highlight-color: transparent; }
.fav-toggle ha-icon { --mdc-icon-size:20px; }
.fav-toggle.on { background: color-mix(in srgb, var(--error-color, #e91e63) 16%, transparent); border-color: var(--error-color, #e91e63); color: var(--error-color, #e91e63); }
.compact .fav-toggle span { display:none; } .compact .fav-toggle { padding: 0 10px; }

.content { flex:1; overflow-y:auto; overflow-x:hidden; padding: 4px 12px 16px; -webkit-overflow-scrolling: touch; overscroll-behavior: contain; }
.grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(var(--tile), 1fr)); gap: 14px 12px; }
.tile { cursor:pointer; min-width:0; user-select:none; -webkit-user-select:none; -webkit-touch-callout:none; -webkit-tap-highlight-color: transparent;
  border-radius: 10px; padding: 4px; transition: transform .12s, background .15s; }
.tile:hover { background: rgba(127,127,127,.08); }
.tile:active { transform: scale(.97); }
.art { position:relative; aspect-ratio:1; border-radius: calc(var(--ha-card-border-radius, 12px) * .7); overflow:hidden; background: rgba(127,127,127,.14);
  display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 8px rgba(0,0,0,.15); }
.art img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:1; pointer-events:none; }
.radio .art img { object-fit:contain; padding:10%; background: var(--card-background-color, #fff); }
.round .art { border-radius:50%; }
.ph-ic { --mdc-icon-size: 40px; color: var(--secondary-text-color); opacity:.6; }
.badge { position:absolute; z-index:2; top:6px; right:6px; width:26px; height:26px; border-radius:50%; background: rgba(0,0,0,.45); color:#ff4f7b;
  display:flex; align-items:center; justify-content:center; }
.badge ha-icon { --mdc-icon-size:16px; }
.t1 { font-size: 14.5px; font-weight:500; line-height:1.25; margin-top:7px; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; word-break: break-word; }
.t2 { font-size: 13px; color: var(--secondary-text-color); line-height:1.25; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.sentinel { height:1px; }
.status { display:flex; align-items:center; justify-content:center; gap:10px; padding: 18px 8px; color: var(--secondary-text-color); font-size:14px; min-height:60px; }
.status .empty { display:flex; flex-direction:column; align-items:center; gap:8px; padding: 24px; text-align:center; }
.status .empty ha-icon { --mdc-icon-size:42px; opacity:.6; }
.status .err { color: var(--error-color, #db4437); display:flex; gap:6px; align-items:center; }
.count { font-size:12px; opacity:.6; }
.spin { width:22px; height:22px; border-radius:50%; border:3px solid rgba(127,127,127,.25); border-top-color: var(--mafc-accent); animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ---------- Queue ---------- */
.qlist { display:flex; flex-direction:column; gap:2px; }
.qrow { display:flex; align-items:center; gap:12px; padding:6px 8px; border-radius:10px; cursor:pointer; min-height: calc(var(--tap) + 12px);
  user-select:none; -webkit-user-select:none; -webkit-touch-callout:none; -webkit-tap-highlight-color: transparent; }
.qrow:hover { background: rgba(127,127,127,.08); }
.qrow.past { opacity:.5; }
.qrow.current { background: color-mix(in srgb, var(--mafc-accent) 16%, transparent); }
.qrow.current .t1 { color: var(--mafc-accent); }
.qart { position:relative; width:48px; height:48px; flex:none; border-radius:6px; overflow:hidden; background: rgba(127,127,127,.14); display:flex; align-items:center; justify-content:center; }
.qart img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:1; }
.qtxt { flex:1; min-width:0; }
.qtxt .t1 { margin-top:0; -webkit-line-clamp:1; }
.qdur { font-size:12px; color: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
.qbtns { display:flex; gap:0; flex:none; }
.compact .qdur { display:none; }
.compact .qbtns .ib { width:38px; min-width:38px; }

/* ---------- Overlay ---------- */
.overlay { position:absolute; inset:0; z-index:10; background: rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; padding:16px;
  animation: fade .15s ease; }
.overlay[hidden] { display:none; }
@keyframes fade { from { opacity:0; } }
.sheet { width: min(420px, 100%); max-height:100%; overflow:auto; border-radius: var(--ha-dialog-border-radius, 20px); padding: 18px;
  background: var(--ha-card-background, var(--card-background-color, #fff)); color: var(--primary-text-color); box-shadow: 0 16px 48px rgba(0,0,0,.4);
  animation: pop .18s ease; }
@keyframes pop { from { transform: translateY(16px) scale(.98); opacity:.5; } }
.sheet-head { display:flex; gap:14px; align-items:center; margin-bottom:14px; }
.sheet-head img, .sheet-ph { width:64px; height:64px; border-radius:10px; object-fit:cover; flex:none; background: rgba(127,127,127,.15); display:flex; align-items:center; justify-content:center; }
.sheet-title { font-size:17px; font-weight:600; line-height:1.3; }
.sheet-ht { flex:1; min-width:0; }
.like-sheet { flex:none; }
.sheet.big .sheet-head img, .sheet.big .sheet-ph { width:96px; height:96px; }
.info-rows { display:grid; grid-template-columns:auto 1fr; gap:6px 14px; margin:0 0 14px; font-size:14px; }
.info-rows dt { color: var(--secondary-text-color); } .info-rows dd { margin:0; overflow-wrap:anywhere; }
.act-l { display:flex; flex-direction:column; min-width:0; flex:1; text-align:left; }
.act-l small { font-size:12px; opacity:.75; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.act.active { outline: 2px solid var(--sidebar-selected-icon-color, var(--mafc-accent)); outline-offset:-2px; }
.act-chk { margin-left:auto; color: var(--sidebar-selected-icon-color, var(--mafc-accent)); }
.sheet-text { font-size:14px; color: var(--secondary-text-color); margin-top:3px; }
.sheet-actions { display:flex; flex-direction:column; gap:6px; }
.act { display:flex; align-items:center; gap:12px; border:0; background: rgba(127,127,127,.1); border-radius:12px; padding: 0 16px; min-height: 50px;
  cursor:pointer; font-size:15px; font-weight:500; text-align:left; -webkit-tap-highlight-color: transparent; }
.act:hover { background: rgba(127,127,127,.18); }
.act.primary { background: var(--mafc-accent); color: var(--text-primary-color, #fff); }
.act.cancel { background: transparent; justify-content:center; color: var(--secondary-text-color); }

.toast { position:absolute; z-index:11; left:50%; bottom:16px; transform: translate(-50%, 20px); opacity:0; pointer-events:none; max-width: calc(100% - 32px);
  background: var(--primary-text-color); color: var(--card-background-color, #fff); padding: 10px 16px; border-radius: 999px; font-size:14px;
  transition: opacity .2s, transform .2s; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.toast.show { opacity:.95; transform: translate(-50%, 0); }
.toast.err { background: var(--error-color, #db4437); color:#fff; }
`;

/* =========================================================== editor */

const ED_FIELDS = [
  ["name", "Name / Titel", "text"], ["artist", "Interpret", "text"], ["album", "Album", "text"], ["genre", "Genre", "text"],
  ["favorite", "Favorit (Like)", "bool"], ["year", "Jahr", "num"],
  ["type", "Albumtyp", "text"], ["provider", "Anbieter", "text"], ["owner", "Besitzer", "text"],
];
const ED_KIND = Object.fromEntries(ED_FIELDS.map((f) => [f[0], f[2]]));
const ED_OPS = {
  text: [[":", "enthält / Muster"], ["=", "ist genau"], ["!=", "ist nicht"]],
  num: [[">=", "mindestens"], ["<=", "höchstens"], ["=", "gleich"], [">", "größer"], ["<", "kleiner"], [":", "Bereich a-b"]],
  bool: [[":", "ist"]],
};
const ED_TYPES = [["playlists", "Playlisten"], ["albums", "Alben"], ["tracks", "Titel"], ["artists", "Interpreten"],
  ["playlist", "Titel einer Playlist"], ["recent", "Neu hinzugefügt"], ["played", "Zuletzt gespielt"], ["radio", "Radiosender"], ["queue", "Warteschlange"]];
const ED_ORDER = [["", "Standard"], ["name", "Name A–Z"], ["name_desc", "Name Z–A"], ["timestamp_added_desc", "Zuletzt hinzugefügt"],
  ["timestamp_added", "Zuerst hinzugefügt"], ["last_played_desc", "Zuletzt gespielt"], ["play_count_desc", "Meistgespielt"],
  ["year_desc", "Jahr absteigend"], ["year", "Jahr aufsteigend"], ["artist_name", "Interpret"], ["random", "Zufällig"]];

function edToNode(a, neg = false) {
  if (a.not) return edToNode(a.not, !neg);
  if (a.and || a.or) return { g: a.and ? "and" : "or", not: neg, items: (a.and || a.or).map((x) => edToNode(x)) };
  return { field: a.field, op: a.op, value: String(a.value ?? ""), not: neg };
}
function edModel(ast) {
  if (!ast) return { g: "and", not: false, items: [] };
  const n = edToNode(ast);
  return n.items ? n : { g: "and", not: false, items: [n] };
}
const edQuote = (v) => (/^[^\s()"'&|]+$/.test(v) && !/^(and|or|not|und|oder|nicht)$/i.test(v) ? v : `"${v.replace(/(["\\])/g, "\\$1")}"`);
function edSer(n, top = true) {
  if (n.items) {
    const parts = n.items.map((x) => edSer(x, false)).filter(Boolean);
    if (!parts.length) return "";
    const s = parts.join(n.g === "or" ? " or " : " and ");
    if (n.not) return `not (${s})`;
    return !top && parts.length > 1 ? `(${s})` : s;
  }
  const v = n.field === "favorite" ? (n.value === "false" ? "false" : "true") : String(n.value ?? "").trim();
  if (v === "") return "";
  return `${n.not ? "not " : ""}${n.field}${n.op}${edQuote(v)}`;
}

const ED_ICONS = `music|musik note;music-note|note titel;music-note-eighth;music-box|musik;music-box-multiple|musik bibliothek;music-circle;music-clef-treble|klassik;
playlist-music|playlist;playlist-play|playlist;playlist-star|playlist favorit stern;playlist-heart|playlist favorit like herz;playlist-edit|warteschlange queue;
playlist-plus;playlist-check;format-list-bulleted|liste;album|album cd platte;disc|cd;disc-player|cd player;record-player|plattenspieler vinyl;record|platte vinyl;
cassette|kassette;account-music|interpret künstler artist;account-voice|sänger stimme;account-group|band gruppe;microphone|mikrofon gesang karaoke;
microphone-variant|mikrofon;guitar-electric|gitarre rock e-gitarre;guitar-acoustic|gitarre akustik folk;piano|klavier;violin|geige klassik;saxophone|saxophon jazz;
trumpet|trompete jazz;drum|schlagzeug trommel;metronome;bugle|horn;headphones|kopfhörer;headset;speaker|lautsprecher;speaker-multiple|lautsprecher gruppe;
speaker-wireless|lautsprecher;surround-sound;radio|radio sender;radio-tower|radio sender;radio-fm;podcast;broadcast|sender;access-point|sender;
heart|herz like favorit;heart-outline|herz like;cards-heart|herz;star|stern favorit;star-outline|stern;thumb-up|daumen like;fire|feuer hits beliebt;
trending-up|charts beliebt;chart-line|charts;trophy|pokal hits;new-box|neu;history|verlauf zuletzt;clock-outline|uhr zeit;calendar|kalender;
calendar-star|kalender;numeric-7-box|siebziger 70er;numeric-8-box|achtziger 80er;numeric-9-box|neunziger 90er;timer-sand|alt oldies;
shuffle|zufall mix;shuffle-variant|zufall;repeat|wiederholen;dance-ballroom|tanz;dance-pop|tanz pop;human-female-dance|tanz;party-popper|party feier;
glass-cocktail|party cocktail;glass-wine|wein abend;beer|bier party;coffee|kaffee morgen;weather-night|nacht abend;sleep|schlafen;bed|bett schlafzimmer;
white-balance-sunny|sonne sommer morgen;weather-sunset|sonnenuntergang chill;beach|strand sommer urlaub;palm-tree|palme urlaub;snowflake|winter schnee;
christmas-tree|weihnachten;pine-tree|wald natur;leaf|natur chill;spa|entspannung wellness;yoga|yoga entspannung;meditation|meditation ruhe;
run|laufen sport;dumbbell|sport training fitness;bike|fahrrad sport;car|auto fahrt;airplane|flugzeug reise;earth|welt international;
baby-face-outline|baby kinder;human-child|kinder;teddy-bear|kinder;school|schule lernen;book-open-variant|hörbuch buch;book-music|liederbuch;
home|zuhause haus;sofa|wohnzimmer;silverware-fork-knife|essen esszimmer;chef-hat|küche kochen;shower|bad dusche;desk|büro arbeit;laptop|arbeit;
gamepad-variant|spiele gaming;movie-open|film soundtrack;television|tv fernseher;emoticon-happy|gute laune fröhlich;emoticon-cool|cool;
lightning-bolt|energie power;rocket-launch|rakete energie;skull|metal;crown|krone king;diamond-stone|diamant;flash|blitz;
waveform|welle elektronisch;equalizer|equalizer;sine-wave|welle elektronisch;tune|einstellungen;tune-vertical|equalizer;knob|regler;
filter-variant|filter;tag|tag label;folder-music|ordner;library|bibliothek;view-grid|raster;bookmark|lesezeichen;flag|flagge;
church|kirche gospel;city|stadt urban;hand-peace|frieden hippie;cactus|country western;horse|country western;anchor|seemann;
ghost|halloween;pumpkin|halloween kürbis;candle|kerze advent;gift|geschenk`.split(/;\s*/).filter(Boolean).map((x) => { const [n, k = ""] = x.split("|"); return { n, k: fold(n.replace(/-/g, " ") + " " + k) }; });
const ED_SEARCH_TAB = { playlists: "playlist", albums: "album", tracks: "track", artists: "artist", playlist: "track", radio: "radio" };

class MaFilterCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._models = []; this._sers = []; this._errs = []; this._open = new Set([0]);
    this._bound = false;
  }

  set hass(h) { const first = !this._hass; this._hass = h; if (first && this._config) this._render(); }

  setConfig(config) {
    const json = JSON.stringify(config || {});
    if (json === this._lastEmitted && this._config) return; // eigenes Echo: nicht neu zeichnen (Fokus bleibt)
    this._config = JSON.parse(json);
    if (!Array.isArray(this._config.tabs) || !this._config.tabs.length) this._config.tabs = JSON.parse(JSON.stringify(DEFAULT_TABS));
    this._config.tabs.forEach((t, i) => this._syncModel(i));
    this._models.length = this._sers.length = this._errs.length = this._config.tabs.length;
    this._render();
  }

  _syncModel(i) {
    const t = this._config.tabs[i];
    const f = t.filter == null ? "" : typeof t.filter === "string" ? t.filter : JSON.stringify(t.filter);
    if (this._sers[i] === f && this._models[i]) return;
    try { this._models[i] = edModel(toAst(t.filter)); this._errs[i] = null; } catch (e) { this._models[i] = edModel(null); this._errs[i] = e.message; }
    this._sers[i] = f;
  }

  _maPlayers() {
    if (!this._hass) return [];
    return Object.values(this._hass.states).filter((s) => s.entity_id.startsWith("media_player.")
      && (s.attributes.app_id === "music_assistant" || s.attributes.mass_player_type != null))
      .map((s) => s.entity_id);
  }
  _pn(e) { return this._hass?.states[e]?.attributes.friendly_name || e; }
  _cfgPlayers() { return (this._config.players || []).map((p) => (typeof p === "string" ? p : p.entity)); }

  _emit() {
    const c = this._config;
    c.tabs.forEach((t, i) => {
      if (t.type === "queue") { delete t.filter; this._sers[i] = ""; return; }
      if (this._errs[i]) return; // fehlerhaften Ausdruck nicht überschreiben
      const s = edSer(this._models[i]);
      if (s) t.filter = s; else delete t.filter;
      this._sers[i] = s;
    });
    for (const k of Object.keys(c)) if (c[k] === "" || c[k] == null) delete c[k];
    if (c.sidebar) { for (const k of Object.keys(c.sidebar)) if (c.sidebar[k] === "" || c.sidebar[k] == null) delete c.sidebar[k]; if (!Object.keys(c.sidebar).length) delete c.sidebar; }
    const out = JSON.parse(JSON.stringify(c));
    this._lastEmitted = JSON.stringify(out);
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: out }, bubbles: true, composed: true }));
  }

  /* ---------- render ---------- */

  _sel(attrs, options, value) {
    return `<select ${attrs}>${options.map(([v, l]) => `<option value="${esc(v)}"${String(v) === String(value ?? "") ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
  }

  _render() {
    if (!this._config) return;
    const c = this._config, sb = c.sidebar || {};
    const all = this._maPlayers();
    const cfg = this._cfgPlayers();
    const ordered = cfg.length ? [...cfg.filter((e) => all.includes(e) || this._hass?.states[e]), ...all.filter((e) => !cfg.includes(e))] : [...all].sort((a, b) => this._pn(a).localeCompare(this._pn(b)));
    const excl = new Set(c.exclude_players || []);
    const shown = (e) => (cfg.length ? cfg.includes(e) : true) && !excl.has(e);

    const players = ordered.map((e, k) => {
      const st = this._hass?.states[e];
      return `<div class="prow${shown(e) ? "" : " off"}">
        <label class="chk"><input type="checkbox" data-pl="${esc(e)}"${shown(e) ? " checked" : ""}><span>${esc(this._pn(e))}</span></label>
        <span class="muted">${esc(e)}${st?.state === "unavailable" ? " · nicht verfügbar" : ""}</span>
        <span class="sp"></span>
        <button class="ib" data-act="pl-up" data-k="${k}" title="Nach oben"${k === 0 ? " disabled" : ""}>${icon("mdi:arrow-up")}</button>
        <button class="ib" data-act="pl-down" data-k="${k}" title="Nach unten"${k === ordered.length - 1 ? " disabled" : ""}>${icon("mdi:arrow-down")}</button>
      </div>`;
    }).join("") || `<div class="muted">Keine Music-Assistant-Player gefunden.</div>`;
    this._ordered = ordered;

    const tabs = c.tabs.map((t, i) => this._tabHtml(t, i)).join("");
    const mainOpts = [["", "Automatisch"], ...ordered.filter(shown).map((e) => [e, this._pn(e)])];

    this.shadowRoot.innerHTML = `<style>${ED_CSS}</style>
      <div class="ed">
        <details open><summary>${icon("mdi:cog")} Allgemein</summary><div class="body grid2">
          <label>Hauptplayer beim Start${this._sel('data-k="entity"', mainOpts, c.entity)}</label>
          <label>Titel/Radio antippen${this._sel('data-k="track_tap"', [["", "Menü öffnen"], ["play", "Direkt abspielen"]], c.track_tap)}</label>
          <label>Alben/Playlisten antippen${this._sel('data-k="collection_tap"', [["", "Menü öffnen"], ["open", "Öffnen"], ["play", "Abspielen"]], c.collection_tap)}</label>
          <label>Wenn schon etwas läuft${this._sel('data-k="when_playing"', [["", "Nachfragen"], ["replace", "Ersetzen"], ["next", "Als nächstes"], ["add", "Anhängen"], ["play", "Sofort spielen"]], c.when_playing)}</label>
          <label>Sidebar-Position${this._sel('data-sb="position"', [["", "Automatisch"], ["left", "Links"], ["right", "Rechts"], ["top", "Oben"], ["bottom", "Unten"]], sb.position)}</label>
          <label>Kachelgröße${this._sel('data-k="tile_size"', [["", "Automatisch"], ["small", "Klein"], ["medium", "Mittel"], ["large", "Groß"]], c.tile_size)}</label>
          ${!sb.position || sb.position === "auto" ? `
          <label>Querformat${this._sel('data-sb="position_landscape"', [["", "Links"], ["right", "Rechts"]], sb.position_landscape)}</label>
          <label>Hochformat${this._sel('data-sb="position_portrait"', [["", "Oben"], ["bottom", "Unten"]], sb.position_portrait)}</label>` : ""}
          <label class="chk"><input type="checkbox" data-b="card_background"${c.card_background ? " checked" : ""}><span>Kartenhintergrund (sonst transparent)</span></label>
          <label class="chk"><input type="checkbox" data-sbb="pinned"${sb.pinned === false ? "" : " checked"}><span>Sidebar fixiert</span></label>
          <label class="chk"><input type="checkbox" data-sbb="collapsed"${sb.collapsed ? " checked" : ""}><span>Sidebar eingeklappt starten</span></label>
          <label class="chk"><input type="checkbox" data-b="show_group_bar"${c.show_group_bar === false ? "" : " checked"}><span>Gruppier-Leiste anzeigen</span></label>
        </div></details>

        <details open><summary>${icon("mdi:speaker-multiple")} Mediaplayer</summary><div class="body">
          <div class="hint">Angehakte Player erscheinen in der Auswahl und in der Gruppier-Leiste. Die Reihenfolge gilt auch für die Anzeige.</div>
          <div class="plist">${players}</div>
          <div class="row"><button class="btn" data-act="pl-all">Alle anzeigen</button><button class="btn" data-act="pl-none">Keine</button></div>
        </div></details>

        <details open><summary>${icon("mdi:tab")} Tabs</summary><div class="body">
          ${tabs}
          <div class="row">${this._sel('id="newType"', ED_TYPES, "albums")}<button class="btn primary" data-act="tab-add">${icon("mdi:plus")} Tab hinzufügen</button></div>
        </div></details>

        <details><summary>${icon("mdi:tune")} Erweitert</summary><div class="body grid2">
          <label>Music-Assistant-Eintrag (config_entry_id)<input data-k="config_entry_id" value="${esc(c.config_entry_id || "")}" placeholder="automatisch"></label>
          <label>mass_queue-Eintrag<input data-k="mass_queue_entry_id" value="${esc(c.mass_queue_entry_id || "")}" placeholder="automatisch"></label>
          <label>MA-Server-URL (Cover)<input data-k="ma_url" value="${esc(c.ma_url || "")}" placeholder="automatisch"></label>
          <label>Karten-ID (Speicherung)<input data-k="id" value="${esc(c.id || "")}" placeholder="default"></label>
          <label>Höhe (z. B. 700 oder 80vh)<input data-k="height" value="${esc(c.height ?? "")}" placeholder="automatisch"></label>
          <label>Max. durchsuchte Einträge<input type="number" data-n="max_scan" value="${esc(c.max_scan ?? "")}" placeholder="3000"></label>
        </div></details>
      </div>`;
    this._sugEl = null;
    this.shadowRoot.querySelectorAll("ha-icon-picker[data-iconpick]").forEach((pk) => {
      const t = c.tabs[+pk.dataset.t];
      pk.hass = this._hass; pk.value = t.icon || ""; pk.placeholder = TAB_TYPES[t.type]?.icon || "";
    });
    if (!this._bound) this._bind();
  }

  /* ---------- Vorschläge beim Tippen (Symbole, Bibliothekssuche) ---------- */

  async _maEntry() {
    if (this._config.config_entry_id) return this._config.config_entry_id;
    if (this._maEntryId !== undefined) return this._maEntryId;
    try {
      const r = await this._hass.callWS({ type: "config_entries/get", domain: "music_assistant" });
      this._maEntryId = (r || []).find((x) => x.state === "loaded")?.entry_id || null;
    } catch (e) { this._maEntryId = null; }
    return this._maEntryId;
  }

  _sugKind(el) {
    const ti = +el.dataset.t, tab = this._config.tabs[ti];
    if (el.dataset.sug === "icon") return { kind: "icon" };
    if (el.dataset.sug === "playlist") return { kind: "lib", mt: "playlist" };
    const n = this._node(ti, el.dataset.p);
    if (n.field === "artist") return { kind: "lib", mt: "artist" };
    if (n.field === "album") return { kind: "lib", mt: "album" };
    const mt = tab.type === "recent" ? (tab.media_type || "album") : ED_SEARCH_TAB[tab.type];
    return mt ? { kind: "lib", mt } : null;
  }

  async _sugQuery(el) {
    const k = this._sugKind(el);
    const raw = el.value.trim();
    if (!k) return this._sugClose();
    const seq = (this._sugSeq = (this._sugSeq || 0) + 1);
    let items = [];
    if (k.kind === "icon") {
      const q = fold(raw.replace(/^mdi:/i, "").replace(/-/g, " "));
      const words = q.split(/\s+/).filter(Boolean);
      const hits = ED_ICONS.filter((x) => words.every((w) => x.k.includes(w)));
      hits.sort((a, b) => (b.n.startsWith(q) - a.n.startsWith(q)) || a.n.length - b.n.length);
      items = hits.slice(0, 40).map((x) => ({ icon: "mdi:" + x.n, label: "mdi:" + x.n, value: "mdi:" + x.n }));
      if (/^mdi:[a-z0-9-]+$/.test(raw) && !items.some((x) => x.value === raw)) items.unshift({ icon: raw, label: raw, value: raw, sub: "eigene Eingabe" });
    } else {
      const q = raw.replace(/[*?"]/g, " ").replace(/^\/.*\/$/, "").trim();
      if (q.length < 2) return this._sugClose();
      this._sugShow(el, [{ label: "Suche …", busy: true }]);
      await new Promise((r) => setTimeout(r, 250));
      if (seq !== this._sugSeq) return;
      try {
        const entry = await this._maEntry();
        const r = await this._hass.callWS({ type: "call_service", domain: "music_assistant", service: "get_library",
          service_data: { config_entry_id: entry, media_type: k.mt, search: q, limit: 12 }, return_response: true });
        const list = r?.response?.items || [];
        const seen = new Set();
        items = list.filter((it) => !seen.has(it.name + "|" + it.uri) && seen.add(it.name + "|" + it.uri)).map((it) => ({
          label: it.name, value: it.name, uri: it.uri, image: typeof it.image === "string" ? it.image : null, icon: TYPE_ICON[k.mt],
          sub: (it.artists || []).map((a) => a.name || a).filter(Boolean).join(", ") || (it.owner ? "von " + it.owner : ""),
        }));
        if (!items.length) items = [{ label: "Keine Treffer in der Bibliothek", busy: true }];
      } catch (e) { items = [{ label: "Suche nicht möglich: " + (e.message || e), busy: true }]; }
      if (seq !== this._sugSeq) return;
    }
    if (!items.length) return this._sugClose();
    this._sugShow(el, items);
  }

  _sugShow(el, items) {
    if (!this._sugEl || !this._sugEl.isConnected) {
      this._sugEl = document.createElement("div");
      this._sugEl.className = "sug";
      this._sugEl.addEventListener("pointerdown", (e) => {
        const row = e.target.closest("[data-si]");
        e.preventDefault();
        if (row) this._sugPick(+row.dataset.si);
      });
      this.shadowRoot.appendChild(this._sugEl);
    }
    this._sugFor = el; this._sugItems = items; this._sugIdx = items[0]?.busy ? -1 : 0;
    this._sugEl.innerHTML = items.map((it, k) => `<div class="si${it.busy ? " busy" : ""}" ${it.busy ? "" : `data-si="${k}"`}>
      ${it.image ? `<img src="${esc(it.image)}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'noimg'}))">` : it.icon ? icon(it.icon) : ""}
      <span class="sl"><span>${esc(it.label)}</span>${it.sub ? `<small>${esc(it.sub)}</small>` : ""}</span></div>`).join("");
    const hr = this.getBoundingClientRect(), r = el.getBoundingClientRect();
    Object.assign(this._sugEl.style, { left: r.left - hr.left + "px", top: r.bottom - hr.top + 2 + "px", width: Math.max(240, r.width) + "px", display: "block" });
    this._sugMark();
  }
  _sugMark() {
    this._sugEl?.querySelectorAll("[data-si]").forEach((x) => x.classList.toggle("act", +x.dataset.si === this._sugIdx));
    this._sugEl?.querySelector(".act")?.scrollIntoView({ block: "nearest" });
  }
  _sugClose() { this._sugSeq = (this._sugSeq || 0) + 1; if (this._sugEl) this._sugEl.style.display = "none"; this._sugFor = null; }

  _sugPick(k) {
    const it = this._sugItems?.[k], el = this._sugFor;
    if (!it || it.busy || !el) return;
    const ti = +el.dataset.t, tab = this._config.tabs[ti];
    this._sugClose();
    el.value = it.value;
    if (el.dataset.sug === "icon") { tab.icon = it.value; this._emit(); this._render(); return; }
    if (el.dataset.sug === "playlist") {
      tab.playlist = it.value;
      if (it.uri) tab.uri = it.uri; else delete tab.uri;
      const u = this.shadowRoot.querySelector(`input[data-t="${ti}"][data-k="uri"]`);
      if (u) u.value = tab.uri || "";
      this._emit(); return;
    }
    this._node(ti, el.dataset.p).value = it.value;
    this._errs[ti] = null;
    this._emit(); this._refreshExpr(ti);
  }

  _tabHtml(t, i) {
    const n = this._config.tabs.length;
    const open = this._open.has(i);
    const typeName = (ED_TYPES.find((x) => x[0] === t.type) || [, t.type])[1];
    const expr = this._errs[i] ? this._sers[i] : edSer(this._models[i]);
    let extra = "";
    if (t.type === "playlist") extra += `<label>Playlist (tippen zum Suchen)<input data-t="${i}" data-k="playlist" data-sug="playlist" autocomplete="off" value="${esc(t.playlist || "")}" placeholder="z. B. 70ties"></label>
      <label>oder URI<input data-t="${i}" data-k="uri" value="${esc(t.uri || "")}" placeholder="library://playlist/…"></label>`;
    if (t.type === "recent") extra += `<label>Medientyp${this._sel(`data-t="${i}" data-k="media_type"`, [["", "Alben"], ["track", "Titel"], ["playlist", "Playlisten"], ["artist", "Interpreten"], ["radio", "Radio"]], t.media_type)}</label>`;
    if (!["queue", "playlist"].includes(t.type)) extra += `<label>Sortierung${this._sel(`data-t="${i}" data-k="order_by"`, ED_ORDER, t.order_by)}</label>
      <label>Max. Anzahl<input type="number" min="1" data-t="${i}" data-n="limit" value="${esc(t.limit ?? "")}" placeholder="unbegrenzt"></label>`;
    return `<div class="tabbox${open ? " open" : ""}">
      <div class="tabhead">
        <button class="ib" data-act="tab-toggle" data-t="${i}">${icon(open ? "mdi:chevron-down" : "mdi:chevron-right")}</button>
        <span id="thi${i}">${icon(t.icon || TAB_TYPES[t.type]?.icon || "mdi:tab")}</span>
        <span class="tname">${esc(t.name || typeName)}</span><span class="muted">${esc(typeName)}${t.filter ? " · gefiltert" : ""}</span>
        <span class="sp"></span>
        <button class="ib" data-act="tab-up" data-t="${i}" title="Nach oben"${i === 0 ? " disabled" : ""}>${icon("mdi:arrow-up")}</button>
        <button class="ib" data-act="tab-down" data-t="${i}" title="Nach unten"${i === n - 1 ? " disabled" : ""}>${icon("mdi:arrow-down")}</button>
        <button class="ib danger" data-act="tab-del" data-t="${i}" title="Tab löschen"${n <= 1 ? " disabled" : ""}>${icon("mdi:delete")}</button>
      </div>
      ${open ? `<div class="tabbody">
        <div class="grid2">
          <label>Name<input data-t="${i}" data-k="name" value="${esc(t.name || "")}" placeholder="${esc(typeName)}"></label>
          ${customElements.get("ha-icon-picker")
            ? `<label>Symbol<ha-icon-picker data-t="${i}" data-iconpick="1"></ha-icon-picker></label>`
            : `<label>Symbol<span class="iwrap"><span class="ipv" id="ipv${i}">${icon(t.icon || TAB_TYPES[t.type]?.icon || "mdi:tab")}</span><input data-t="${i}" data-k="icon" data-sug="icon" autocomplete="off" value="${esc(t.icon || "")}" placeholder="${esc(TAB_TYPES[t.type]?.icon || "")} – tippen zum Suchen"></span></label>`}
          <label>Inhalt${this._sel(`data-t="${i}" data-k="type" data-rerender="1"`, ED_TYPES, t.type)}</label>
          ${extra}
        </div>
        ${t.type === "queue" ? "" : `
        <div class="row">
          <label class="chk"><input type="checkbox" data-t="${i}" data-b="favorites"${t.favorites ? " checked" : ""}><span>Favoriten-Schalter beim Öffnen an</span></label>
          <label class="chk"><input type="checkbox" data-t="${i}" data-b="show_favorites_toggle"${t.show_favorites_toggle === false ? "" : " checked"}><span>Favoriten-Schalter anzeigen</span></label>
        </div>
        <div class="fhead">${icon("mdi:filter-variant")} Filter</div>
        ${this._groupHtml(this._models[i], i, "", true)}
        <label class="expr">Ausdruck (direkt bearbeitbar)<input data-t="${i}" data-expr="1" value="${esc(expr)}" placeholder="kein Filter – alle Einträge"></label>
        <div class="err" id="err${i}">${this._errs[i] ? esc("Filterfehler: " + this._errs[i]) : ""}</div>`}
      </div>` : ""}
    </div>`;
  }

  _groupHtml(g, ti, path, root) {
    const items = g.items.map((n, k) => {
      const p = path === "" ? String(k) : `${path}.${k}`;
      const join = k > 0 ? `<div class="join">${g.g === "or" ? "ODER" : "UND"}</div>` : "";
      return join + (n.items ? this._groupHtml(n, ti, p, false) : this._ruleHtml(n, ti, p));
    }).join("");
    return `<div class="grp${root ? " root" : ""}${g.not ? " neg" : ""}">
      <div class="ghead">
        <div class="seg">
          <button data-act="g-op" data-v="and" data-t="${ti}" data-p="${path}" class="${g.g === "and" ? "on" : ""}">UND</button>
          <button data-act="g-op" data-v="or" data-t="${ti}" data-p="${path}" class="${g.g === "or" ? "on" : ""}">ODER</button>
        </div>
        <label class="chk sm"><input type="checkbox" data-gnot="1" data-t="${ti}" data-p="${path}"${g.not ? " checked" : ""}><span>NICHT</span></label>
        <span class="sp"></span>
        <button class="btn sm" data-act="r-add" data-t="${ti}" data-p="${path}">${icon("mdi:plus")} Bedingung</button>
        <button class="btn sm" data-act="g-add" data-t="${ti}" data-p="${path}">${icon("mdi:plus")} Gruppe</button>
        ${root ? "" : `<button class="ib danger" data-act="n-del" data-t="${ti}" data-p="${path}" title="Gruppe entfernen">${icon("mdi:close")}</button>`}
      </div>
      ${items || (root ? `<div class="muted pad">Kein Filter – es werden alle Einträge angezeigt.</div>` : `<div class="muted pad">Leere Gruppe</div>`)}
    </div>`;
  }

  _ruleHtml(r, ti, p) {
    const kind = ED_KIND[r.field] || "text";
    const d = `data-t="${ti}" data-p="${p}"`;
    const val = kind === "bool"
      ? this._sel(`${d} data-r="value"`, [["true", "ja"], ["false", "nein"]], r.value === "false" ? "false" : "true")
      : `<input ${d} data-r="value"${["artist", "album", "name"].includes(r.field) ? ' data-sug="rule" autocomplete="off"' : ""} value="${esc(r.value)}" placeholder="${kind === "num" ? (r.op === ":" ? "1970-1979" : "1990") : "z. B. Rock* oder Queen"}"${kind === "num" && r.op !== ":" ? ' inputmode="decimal"' : ""}>`;
    return `<div class="rule${r.not ? " neg" : ""}">
      <label class="chk sm"><input type="checkbox" ${d} data-r="not"${r.not ? " checked" : ""}><span>NICHT</span></label>
      ${this._sel(`${d} data-r="field"`, ED_FIELDS.map((f) => [f[0], f[1]]), r.field)}
      ${this._sel(`${d} data-r="op"`, ED_OPS[kind], r.op)}
      ${val}
      <button class="ib danger" data-act="n-del" ${d} title="Bedingung entfernen">${icon("mdi:close")}</button>
    </div>`;
  }

  /* ---------- events ---------- */

  _node(ti, path) {
    let n = this._models[ti];
    if (path === "" || path == null) return n;
    for (const k of path.split(".")) n = n.items[+k];
    return n;
  }
  _parentOf(ti, path) {
    const parts = path.split(".");
    const k = +parts.pop();
    return { parent: this._node(ti, parts.join(".")), k };
  }
  _refreshExpr(ti) {
    const inp = this.shadowRoot.querySelector(`input[data-expr][data-t="${ti}"]`);
    if (inp && this.shadowRoot.activeElement !== inp) inp.value = edSer(this._models[ti]);
    const err = this.shadowRoot.getElementById("err" + ti);
    if (err) err.textContent = this._errs[ti] ? "Filterfehler: " + this._errs[ti] : "";
  }

  _setPlayers(list) {
    const all = this._ordered || [];
    const objs = new Map((this._config.players || []).filter((p) => typeof p === "object").map((p) => [p.entity, p]));
    delete this._config.exclude_players;
    const sortedAll = [...all].sort((a, b) => this._pn(a).localeCompare(this._pn(b)));
    if (list.length === all.length && list.every((e, k) => e === sortedAll[k]) && !objs.size) delete this._config.players;
    else this._config.players = list.map((e) => objs.get(e) || e);
  }

  _bind() {
    this._bound = true;
    const sr = this.shadowRoot;
    sr.addEventListener("click", (e) => {
      const b = e.target.closest("[data-act]");
      if (!b || b.disabled) return;
      const ti = b.dataset.t != null ? +b.dataset.t : null;
      const p = b.dataset.p ?? "";
      const tabs = this._config.tabs;
      const swap = (arr, a, c) => { [arr[a], arr[c]] = [arr[c], arr[a]]; };
      const swapTab = (a, c) => {
        [tabs, this._models, this._sers, this._errs].forEach((arr) => swap(arr, a, c));
        const oa = this._open.has(a), oc = this._open.has(c);
        this._open.delete(a); this._open.delete(c);
        if (oa) this._open.add(c); if (oc) this._open.add(a);
      };
      switch (b.dataset.act) {
        case "tab-toggle": this._open.has(ti) ? this._open.delete(ti) : this._open.add(ti); this._render(); return;
        case "tab-up": swapTab(ti, ti - 1); break;
        case "tab-down": swapTab(ti, ti + 1); break;
        case "tab-del":
          if (!confirm(`Tab „${tabs[ti].name || (ED_TYPES.find((x) => x[0] === tabs[ti].type) || [, ""])[1]}“ löschen?`)) return;
          [tabs, this._models, this._sers, this._errs].forEach((arr) => arr.splice(ti, 1));
          this._open = new Set([...this._open].filter((x) => x !== ti).map((x) => (x > ti ? x - 1 : x)));
          break;
        case "tab-add": {
          const type = sr.getElementById("newType").value;
          tabs.push({ type });
          this._models.push(edModel(null)); this._sers.push(""); this._errs.push(null);
          this._open.add(tabs.length - 1);
          break;
        }
        case "g-op": this._node(ti, p).g = b.dataset.v; break;
        case "r-add": this._node(ti, p).items.push({ field: "genre", op: ":", value: "", not: false }); break;
        case "g-add": this._node(ti, p).items.push({ g: this._node(ti, p).g === "and" ? "or" : "and", not: false, items: [{ field: "artist", op: ":", value: "", not: false }] }); break;
        case "n-del": { const { parent, k } = this._parentOf(ti, p); parent.items.splice(k, 1); break; }
        case "pl-up": case "pl-down": {
          const k = +b.dataset.k, list = [...this._ordered];
          swap(list, k, b.dataset.act === "pl-up" ? k - 1 : k + 1);
          const cur = new Set(this._cfgPlayers().length ? this._cfgPlayers() : list);
          this._ordered = list;
          this._config.players = list.filter((x) => cur.has(x)).map((x) => (this._config.players || []).find((p2) => typeof p2 === "object" && p2.entity === x) || x);
          break;
        }
        case "pl-all": delete this._config.players; delete this._config.exclude_players; break;
        case "pl-none": this._config.players = []; delete this._config.exclude_players; break;
        default: return;
      }
      if (ti != null) this._errs[ti] = ["g-op", "r-add", "g-add", "n-del"].includes(b.dataset.act) ? null : this._errs[ti];
      this._emit();
      this._render();
    });

    const onEdit = (e, final) => {
      const el = e.target;
      const ds = el.dataset;
      const c = this._config;
      const ti = ds.t != null ? +ds.t : null;
      let rerender = false;
      if (ds.pl) {
        const set = new Set(this._ordered.filter((x) => {
          const cb = sr.querySelector(`input[data-pl="${CSS_ESC(x)}"]`);
          return cb && cb.checked;
        }));
        this._setPlayers(this._ordered.filter((x) => set.has(x)));
        rerender = true;
      } else if (ds.r) {
        const n = this._node(ti, ds.p);
        if (ds.r === "not") n.not = el.checked;
        else if (ds.r === "field") {
          const kind = ED_KIND[el.value];
          n.field = el.value; n.op = ED_OPS[kind][0][0]; n.value = kind === "bool" ? "true" : (ED_KIND[n.field] === ED_KIND[el.value] ? n.value : "");
          rerender = true;
        } else if (ds.r === "op") { n.op = el.value; rerender = true; }
        else n.value = el.value;
        this._errs[ti] = null;
      } else if (ds.gnot) { this._node(ti, ds.p).not = el.checked; this._errs[ti] = null; rerender = true; }
      else if (ds.expr) {
        if (!final) return;
        try { this._models[ti] = edModel(toAst(el.value.trim() || null)); this._errs[ti] = null; rerender = true; }
        catch (err) { this._errs[ti] = err.message; this._sers[ti] = el.value; c.tabs[ti].filter = el.value; this._refreshExpr(ti); this._emit(); return; }
      } else if (ds.sb) { c.sidebar = c.sidebar || {}; c.sidebar[ds.sb] = el.value || undefined; if (ds.sb === "position") rerender = true; }
      else if (ds.sbb) { c.sidebar = c.sidebar || {}; c.sidebar[ds.sbb] = ds.sbb === "pinned" ? (el.checked ? undefined : false) : (el.checked || undefined); }
      else if (ds.b) {
        const tgt = ti != null ? c.tabs[ti] : c;
        if (ds.b === "show_favorites_toggle" || ds.b === "show_group_bar") { if (el.checked) delete tgt[ds.b]; else tgt[ds.b] = false; }
        else if (el.checked) tgt[ds.b] = true; else delete tgt[ds.b];
      } else if (ds.n) {
        const tgt = ti != null ? c.tabs[ti] : c;
        const v = parseInt(el.value, 10);
        if (isNaN(v)) delete tgt[ds.n]; else tgt[ds.n] = v;
      } else if (ds.k) {
        const tgt = ti != null ? c.tabs[ti] : c;
        let v = el.value;
        if (ds.k === "height" && /^\d+$/.test(v)) v = +v;
        if (v === "" || v == null) delete tgt[ds.k]; else tgt[ds.k] = v;
        if (ds.k === "type" && ti != null) {
          ["playlist", "uri", "media_type"].forEach((k) => { if (k in tgt && !(v === "playlist" && k !== "media_type") && !(v === "recent" && k === "media_type")) delete tgt[k]; });
          rerender = true;
        }
      } else return;
      this._emit();
      if (ti != null) this._refreshExpr(ti);
      if (rerender || (final && el.tagName === "SELECT")) this._render();
    };
    sr.addEventListener("input", (e) => {
      const el = e.target;
      if (el.tagName !== "INPUT" || el.type === "checkbox") return;
      if (el.dataset.k === "playlist" && el.dataset.t != null) {
        delete this._config.tabs[+el.dataset.t].uri;
        const u = sr.querySelector(`input[data-t="${el.dataset.t}"][data-k="uri"]`);
        if (u) u.value = "";
      }
      onEdit(e, false);
      if (el.dataset.k === "icon") { const pv = sr.getElementById("ipv" + el.dataset.t); if (pv) pv.innerHTML = icon(/^[a-z]+:[a-z0-9-]+$/.test(el.value) ? el.value : TAB_TYPES[this._config.tabs[+el.dataset.t].type]?.icon || "mdi:tab"); }
      if (el.dataset.sug) this._sugQuery(el);
    });
    sr.addEventListener("focusin", (e) => { const el = e.target; if (el.dataset?.sug && el.dataset.sug === "icon") this._sugQuery(el); });
    sr.addEventListener("focusout", (e) => { if (e.target === this._sugFor) setTimeout(() => { if (this.shadowRoot.activeElement !== this._sugFor) this._sugClose(); }, 150); });
    sr.addEventListener("keydown", (e) => {
      if (!this._sugFor || e.target !== this._sugFor || this._sugEl?.style.display === "none") return;
      const n = (this._sugItems || []).filter((x) => !x.busy).length;
      if (e.key === "ArrowDown" && n) { this._sugIdx = (this._sugIdx + 1) % n; this._sugMark(); e.preventDefault(); }
      else if (e.key === "ArrowUp" && n) { this._sugIdx = (this._sugIdx - 1 + n) % n; this._sugMark(); e.preventDefault(); }
      else if (e.key === "Enter" && this._sugIdx >= 0) { this._sugPick(this._sugIdx); e.preventDefault(); }
      else if (e.key === "Escape") { this._sugClose(); e.preventDefault(); e.stopPropagation(); }
    });
    // HA-Symbolauswahl: Wert übernehmen, ohne neu zu zeichnen (sonst wird der offene Picker zerstört).
    // Das Ereignis kann vom Picker selbst oder von seinem inneren Feld kommen; Zwischenwerte beim Tippen
    // sind keine gültigen Symbolnamen und werden ignoriert.
    const applyIcon = (pk, raw) => {
      const ti = +pk.dataset.t, tab = this._config.tabs[ti];
      if (!tab) return;
      const v = String(raw ?? "").trim();
      if (v && !/^[a-z0-9_-]+:[a-z0-9_-]+$/i.test(v)) return;
      if ((tab.icon || "") === v) return;
      if (v) tab.icon = v; else delete tab.icon;
      const hi = sr.getElementById("thi" + ti);
      if (hi) hi.innerHTML = icon(v || TAB_TYPES[tab.type]?.icon || "mdi:tab");
      this._emit();
    };
    sr.addEventListener("value-changed", (e) => {
      const pk = e.composedPath().find((n) => n.matches?.("ha-icon-picker[data-iconpick]"));
      if (!pk) return;
      e.stopPropagation();
      applyIcon(pk, e.detail?.value);
    });
    sr.addEventListener("focusout", (e) => {
      const pk = e.target.closest?.("ha-icon-picker[data-iconpick]");
      if (pk) setTimeout(() => applyIcon(pk, pk.value), 0);
    });
    sr.addEventListener("change", (e) => onEdit(e, true));
  }
}

const CSS_ESC = (s) => (window.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/["\\]/g, "\\$&"));

const ED_CSS = `
:host { display:block; position:relative; color: var(--primary-text-color); font-size:14px; }
.sug { position:absolute; z-index:20; display:none; max-height:300px; overflow:auto; border-radius:10px; padding:4px;
  background: var(--card-background-color, #fff); border:1px solid var(--divider-color, rgba(127,127,127,.3)); box-shadow: 0 8px 24px rgba(0,0,0,.25); }
.si { display:flex; align-items:center; gap:10px; padding:6px 8px; border-radius:8px; cursor:pointer; min-height:40px; }
.si.act, .si[data-si]:hover { background: rgba(127,127,127,.15); }
.si.busy { cursor:default; color: var(--secondary-text-color); font-style:italic; }
.si img, .si .noimg { width:32px; height:32px; border-radius:6px; object-fit:cover; flex:none; background: rgba(127,127,127,.15); }
.si ha-icon { flex:none; color: var(--secondary-text-color); }
.si .sl { display:flex; flex-direction:column; min-width:0; }
.si .sl > span { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color: var(--primary-text-color); }
.si small { color: var(--secondary-text-color); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.iwrap { display:flex; align-items:center; gap:6px; }
.iwrap input { flex:1; min-width:0; }
.ipv { display:inline-flex; width:28px; justify-content:center; color: var(--primary-text-color); }
* { box-sizing:border-box; }
ha-icon { --mdc-icon-size:20px; display:inline-flex; }
details { border:1px solid var(--divider-color, rgba(127,127,127,.25)); border-radius:12px; margin-bottom:12px; background: var(--card-background-color); }
summary { cursor:pointer; padding:12px 14px; font-weight:600; font-size:15px; display:flex; align-items:center; gap:8px; list-style:none; }
summary::-webkit-details-marker { display:none; }
.body { padding: 0 14px 14px; }
.grid2 { display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:10px 12px; align-items:end; }
label { display:flex; flex-direction:column; gap:4px; font-size:12px; color: var(--secondary-text-color); }
label.chk { flex-direction:row; align-items:center; gap:8px; font-size:14px; color: var(--primary-text-color); cursor:pointer; }
label.chk.sm { font-size:12px; font-weight:600; color: var(--secondary-text-color); }
input, select { font:inherit; font-size:14px; color: var(--primary-text-color); background: var(--secondary-background-color, rgba(127,127,127,.08));
  border:1px solid var(--divider-color, rgba(127,127,127,.3)); border-radius:8px; padding:8px 10px; min-height:38px; min-width:0; }
input:focus, select:focus { outline:2px solid var(--primary-color); outline-offset:-1px; }
input[type=checkbox] { min-height:auto; width:18px; height:18px; accent-color: var(--primary-color); padding:0; }
.hint, .muted { color: var(--secondary-text-color); font-size:12px; }
.hint { margin-bottom:8px; }
.pad { padding:6px 4px; }
.row { display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-top:10px; }
.sp { flex:1; }
.btn { display:inline-flex; align-items:center; gap:6px; border:1px solid var(--divider-color, rgba(127,127,127,.3)); background:transparent; color:inherit;
  border-radius:999px; padding:6px 14px; min-height:36px; cursor:pointer; font:inherit; font-size:14px; }
.btn.sm { padding:4px 10px; min-height:30px; font-size:13px; }
.btn.sm ha-icon { --mdc-icon-size:16px; }
.btn.primary { background: var(--primary-color); border-color: var(--primary-color); color: var(--text-primary-color, #fff); }
.ib { border:0; background:transparent; color:inherit; width:34px; height:34px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; flex:none; }
.ib:hover { background: rgba(127,127,127,.15); }
.ib:disabled { opacity:.3; cursor:default; background:transparent; }
.ib.danger:hover { color: var(--error-color, #db4437); }
.plist { display:flex; flex-direction:column; gap:2px; }
.prow { display:flex; align-items:center; gap:10px; padding:2px 4px; border-radius:8px; }
.prow.off .chk span { opacity:.5; }
.prow .muted { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.tabbox { border:1px solid var(--divider-color, rgba(127,127,127,.25)); border-radius:10px; margin-bottom:8px; }
.tabbox.open { border-color: var(--primary-color); }
.tabhead { display:flex; align-items:center; gap:8px; padding:4px 6px; }
.tname { font-weight:600; }
.tabbody { padding: 4px 12px 12px; }
.fhead { margin:14px 0 6px; font-weight:600; display:flex; align-items:center; gap:6px; }
.grp { border:1px solid var(--divider-color, rgba(127,127,127,.3)); border-left:3px solid var(--primary-color); border-radius:8px; padding:8px; margin:4px 0;
  background: rgba(127,127,127,.04); display:flex; flex-direction:column; gap:4px; }
.grp.neg { border-left-color: var(--error-color, #db4437); }
.grp .grp { margin-left:8px; }
.ghead { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.seg { display:inline-flex; border:1px solid var(--primary-color); border-radius:999px; overflow:hidden; }
.seg button { border:0; background:transparent; color: var(--primary-color); padding:4px 12px; font:inherit; font-size:12px; font-weight:700; cursor:pointer; }
.seg button.on { background: var(--primary-color); color: var(--text-primary-color, #fff); }
.join { font-size:11px; font-weight:700; color: var(--primary-color); padding-left:10px; letter-spacing:.05em; }
.rule { display:grid; grid-template-columns: auto minmax(0, 1fr) minmax(0, 1fr) auto; gap:6px; align-items:center;
  padding:6px; border-radius:8px; background: var(--card-background-color); }
.rule > .chk { grid-column:1; grid-row:1; }
.rule > [data-r="field"] { grid-column:2; grid-row:1; }
.rule > [data-r="op"] { grid-column:3; grid-row:1; }
.rule > [data-r="value"] { grid-column:2 / 4; grid-row:2; }
.rule > .ib { grid-column:4; grid-row:1; }
.rule.neg select, .rule.neg input:not([type=checkbox]) { border-color: var(--error-color, #db4437); }
.expr { margin-top:10px; }
.expr input { font-family: var(--code-font-family, ui-monospace, monospace); font-size:13px; }
.err { color: var(--error-color, #db4437); font-size:12px; min-height:4px; margin-top:4px; }
`;

if (!customElements.get("ma-filter-card-editor")) customElements.define("ma-filter-card-editor", MaFilterCardEditor);

if (!customElements.get("ma-filter-card")) {
  customElements.define("ma-filter-card", MusicAssistantFilterCard);
}
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "ma-filter-card")) {
  window.customCards.push({
    type: "ma-filter-card",
    name: "Music Assistant Filtercard",
    description: "Music-Assistant-Player mit Sidebar, Gruppierung, filterbaren Tabs und Queue-Editor",
    preview: false,
    documentationURL: "https://github.com/",
  });
}
console.info(`%c MA-FILTER-CARD %c ${MAFC_VERSION} `, "background:#03a9f4;color:#fff;font-weight:700", "background:#333;color:#fff");

if (typeof window !== "undefined") window.__mafcFilter = { parseFilterString, toAst, evalFilter };

"use strict";

const app = document.getElementById("app");
const crumbs = document.getElementById("crumbs");
const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const store = { data: null, byId: {}, temples: {}, player: null };

fetch("data/puzzles.json")
  .then((r) => r.json())
  .then((data) => {
    store.data = data;
    data.puzzles.forEach((p) => (store.byId[p.id] = p));
    data.temples.forEach((t) => (store.temples[t.id] = t));
    window.addEventListener("hashchange", route);
    route();
  })
  .catch(() => {
    app.innerHTML = `<div class="panel"><h2>Couldn't load the puzzle data.</h2></div>`;
  });

function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") n.className = v;
    else if (k === "html") n.innerHTML = v;
    else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) n.setAttribute(k, v);
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue;
    n.append(kid instanceof Node ? kid : document.createTextNode(kid));
  }
  return n;
}

function medal(p) {
  if (p.record == null) return null;
  const diff = p.moves - p.record;
  const cls = diff <= 0 ? "" : diff <= 5 ? "silver" : "bronze";
  const num = diff <= 0 ? "I" : diff <= 5 ? "II" : "III";
  return el("span", { class: `medal ${cls}`, title: diff <= 0 ? "Perfect" : `${diff} over the record` }, num);
}

function verdict(p) {
  if (p.record == null) return "Tutorial puzzle, no world record";
  if (p.originalRecord && p.moves <= p.record) return `New world record: ${p.record} moves (previous record ${p.originalRecord})`;
  const d = p.moves - p.record;
  if (d < 0) return `Beats the world record (${p.record}) by ${-d}`;
  if (d === 0) return `Ties the world record (${p.record})`;
  return `${d} over the world record (${p.record})`;
}

function setCrumbs(parts) {
  crumbs.replaceChildren(...parts.map(([label, href]) => el("a", { href }, label)));
}

function route() {
  if (store.player) store.player.destroy();
  store.player = null;
  const parts = (location.hash.slice(1) || "/").split("/").filter(Boolean);
  window.scrollTo(0, 0);
  if (parts[0] === "t" && store.temples[parts[1]]) return templePage(store.temples[parts[1]]);
  if (parts[0] === "p" && store.byId[parts[1]]) return puzzlePage(store.byId[parts[1]]);
  homePage();
}

function totals(ids) {
  const ps = ids.map((id) => store.byId[id]);
  return {
    count: ps.length,
    moves: ps.reduce((s, p) => s + p.moves, 0),
    perfect: ps.filter((p) => p.record != null && p.moves <= p.record).length,
    beats: ps.filter((p) => p.originalRecord || (p.record != null && p.moves < p.record)).length,
    proven: ps.filter((p) => p.optimal).length,
  };
}

const CAST = [
  ["claudius", "Claudius", "The castaway",
    "A Roman sailor washed up on the island of Pixelus with nothing but a sandal tan. He's the one hurling tiles across every floor in the game.",
    "Shipwrecked, sunburnt, and somehow now in charge of interior design."],
  ["cave", "The Cyclops", "Keeper of the cave",
    "Myth's one-eyed giants were famous builders. This one guards the tutorial cave, where every floor teaches one trick.",
    "One eye, zero depth perception. Don't ask me to line tiles up."],
  ["flora", "Flora", "Goddess of flowers",
    "The Roman goddess of spring and blossoms. Her temple is where the island's real puzzles begin to bloom.",
    "Every missing tile is just a flower that hasn't opened yet."],
  ["cupid", "Cupid", "God of love",
    "The winged son of Venus, armed with a bow and far too many arrows. His floors are hearts, roses and long chains of stoppers.",
    "I never miss. Tiles, on the other hand..."],
  ["neptune", "Neptune", "God of the sea",
    "Ruler of oceans and earthquakes, never seen without his trident. His temple fills the tile tray to the brim.",
    "Seven helpers deep? That's a puddle where I'm from."],
  ["venus", "Venus", "Goddess of beauty",
    "Born from sea foam and carried ashore on a scallop shell. Her temple holds the toughest records of the early game.",
    "Beauty takes exactly as many moves as the record says. No more."],
  ["bacchus", "Bacchus", "God of wine and revelry",
    "Grapes, goblets and feasts. Some of his tiles come already placed, and the shortest route often lifts them out first.",
    "A tile already in place? Pour it out and start the party over."],
  ["vulcan", "Vulcan", "God of fire and the forge",
    "The blacksmith of the gods, hammering away beneath a volcano. His floors are spotted with glue, and a tile set on glue stays forever.",
    "Measure twice, glue once."],
];

const FACTS = [
  ["Developer", "Nuclide Games"],
  ["Publisher", "PopCap Games"],
  ["Released", "2005, Windows and Mac"],
  ["Temples", "9 temples, 201 puzzles"],
  ["Ancestor", "Guru Logi Champ (GBA, 2001)"],
];

function castCard([id, name, role, bio, quote]) {
  const bubble = el("div", { class: "bubble" }, `“${quote}”`);
  const pic = el("button", { class: "cast-pic", type: "button", "aria-label": `Say hi to ${name}` }, sprite(id, 72));
  pic.addEventListener("click", () => {
    pic.classList.remove("hop");
    void pic.offsetWidth;
    pic.classList.add("hop");
    bubble.classList.add("show");
    clearTimeout(bubble.timer);
    bubble.timer = setTimeout(() => bubble.classList.remove("show"), 3200);
  });
  const temple = store.temples[id];
  return el("article", { class: "cast-card panel" },
    bubble,
    pic,
    el("h3", {}, name),
    el("span", { class: "role" }, role),
    el("p", {}, bio),
    temple ? el("a", { class: "pill", href: `#/t/${id}` }, `Visit ${temple.name}`) : null,
  );
}

function homePage() {
  setCrumbs([]);
  document.title = "Pixelus Deluxe Solutions";
  const all = totals(store.data.puzzles.map((p) => p.id));
  const hero = el("section", { class: "hero" },
    el("div", { class: "hero-title" },
      sprite("claudius", 88),
      el("div", {},
        el("span", { class: "kicker" }, "Solutions & world records for"),
        el("h1", {}, "Pixelus Deluxe"),
      ),
    ),
    el("p", {}, "Every temple puzzle solved in the fewest moves we could find. Play each board yourself with the real sliding rules, then watch the solution move by move."),
    el("div", { class: "stat-row" },
      el("div", { class: "stat" }, el("b", {}, String(all.count)), el("span", {}, "puzzles solved")),
      el("div", { class: "stat" }, el("b", {}, String(all.perfect)), el("span", {}, "at or under the record")),
      el("div", { class: "stat" }, el("b", {}, String(all.beats)), el("span", {}, "new world records")),
      el("div", { class: "stat" }, el("b", {}, String(all.proven)), el("span", {}, "proven optimal")),
    ),
  );
  const grid = el("section", { class: "temple-grid" },
    store.data.temples.map((t) => {
      const s = totals(t.puzzles);
      const thumbs = t.puzzles.slice(0, 8).map((id) => el("img", { src: store.byId[id].thumb, alt: "", loading: "lazy" }));
      return el("a", { class: "temple-card panel", href: `#/t/${t.id}` },
        sprite(t.id, 56),
        el("h2", {}, t.name),
        el("div", { class: "mosaic-strip" }, thumbs),
        el("p", {}, t.blurb),
        el("div", { class: "temple-meta" },
          el("span", { class: "pill" }, `${s.count} puzzles`),
          el("span", { class: "pill" }, `${s.moves} moves`),
          s.proven ? el("span", { class: "pill proven" }, `${s.proven} proven optimal`) : null,
          s.beats ? el("span", { class: "pill beats" }, `${s.beats} new world record${s.beats > 1 ? "s" : ""}`) : null,
        ),
      );
    }),
  );
  const about = el("section", { class: "panel about" },
    el("h2", {}, "What the badges mean"),
    el("ul", {},
      el("li", {}, el("b", {}, "Gold medal (I): "), "the solution matches the game's world record move count."),
      el("li", {}, el("b", {}, "Proven optimal: "), "a solver proved that no shorter solution exists, either because the plan meets a guaranteed minimum or because every shorter plan was searched and none works."),
      el("li", {}, el("b", {}, "Lower bound: "), "on bigger puzzles a full proof is out of reach, so the page shows the guaranteed minimum instead. The real best lies somewhere between that and the record."),
      el("li", {}, el("b", {}, "New world record: "), "the solution beat the record that was in the game, so the game's world record is now this one."),
    ),
  );
  const story = el("section", { class: "panel story" },
    el("div", { class: "story-text" },
      el("h2", {}, "About the game"),
      el("p", {}, "Pixelus Deluxe is a tile-sliding puzzle game from Nuclide Games, published by PopCap Games in 2005. You play Claudius, a Roman sailor shipwrecked on the island of Pixelus, whose temples have lost the tiles of their mosaic floors."),
      el("p", {}, "Each temple belongs to a god of the old myths, and each puzzle is a picture with gaps in it. Claudius flings tiles in from the edge of the floor. A tile only stops when it bumps into another one, so the art is in building stoppers, then pulling them back out before you run out of tiles."),
      el("p", {}, "Expert mode takes away the undo button and shows a world record for every puzzle. Those records are what this site is chasing."),
    ),
    el("dl", { class: "facts" }, FACTS.map(([k, v]) => [el("dt", {}, k), el("dd", {}, v)]).flat()),
  );
  const rules = el("section", { class: "rules" },
    el("h2", {}, "Rules of the floor"),
    el("div", { class: "rule-row" },
      [["Slide in", "Click an empty cell. A tile flies in from the far edge and only stops there if something solid is right behind that cell."],
       ["Pull out", "Click one of your tiles. It leaves along any clear line to the edge."],
       ["Count everything", "Every tile slid in or pulled out is one move. A helper you place and later remove costs two."],
       ["Watch the tray", "You only get as many tiles as the picture needs, so helpers have to be recycled."]]
        .map(([h, t], i) => el("div", { class: "rule panel" }, el("b", { class: "rule-num" }, String(i + 1)), el("h3", {}, h), el("p", {}, t))),
    ),
  );
  const cast = el("section", { class: "cast" },
    el("h2", {}, "Meet the cast"),
    el("p", { class: "cast-hint" }, "Click a character to say hello."),
    el("div", { class: "cast-grid" }, CAST.map(castCard)),
  );
  app.replaceChildren(hero, story, grid, rules, cast, about);
}

function templePage(t) {
  setCrumbs([["All temples", "#/"], [t.name, `#/t/${t.id}`]]);
  document.title = `${t.name} · Pixelus Deluxe Solutions`;
  const s = totals(t.puzzles);
  const head = el("div", { class: "temple-head" },
    sprite(t.id, 96),
    el("h1", {}, t.name),
    el("p", {}, `${s.count} puzzles · ${s.moves} moves in total · ${s.perfect}/${s.count} perfect`),
  );
  const grid = el("div", { class: "puzzle-grid" },
    t.puzzles.map((id) => {
      const p = store.byId[id];
      return el("a", { class: "puzzle-card", href: `#/p/${p.id}` },
        medal(p),
        el("img", { src: p.thumb, alt: `${t.name} puzzle ${p.index}`, loading: "lazy" }),
        el("span", { class: "num" }, `Puzzle ${p.index}`),
        el("span", { class: "line" }, p.record != null ? `${p.moves} moves · record ${p.record}` : `${p.moves} moves`),
        p.optimal ? el("span", { class: "pill proven" }, "proven optimal") : null,
        p.originalRecord ? el("span", { class: "pill beats" }, "New world record") : null,
      );
    }),
  );
  app.replaceChildren(head, grid);
}

function puzzlePage(p) {
  const t = store.temples[p.temple];
  setCrumbs([["All temples", "#/"], [t.name, `#/t/${t.id}`], [`Puzzle ${p.index}`, `#/p/${p.id}`]]);
  document.title = `${t.name} ${p.index} · Pixelus Deluxe Solutions`;

  const side = el("nav", { class: "side-list panel" },
    t.puzzles.map((id) => {
      const q = store.byId[id];
      return el("a", { href: `#/p/${q.id}`, class: q.id === p.id ? "active" : "" },
        el("img", { src: q.thumb, alt: "" }),
        el("span", {}, el("b", {}, `Puzzle ${q.index}`), el("small", {}, `${q.moves} moves`)),
      );
    }),
  );

  const boardEl = el("div", { class: "board" });
  const board = el("div", { class: "board-wrap" }, boardEl);
  const hud = el("aside", { class: "hud panel" });
  app.replaceChildren(el("div", { class: "player" }, side, board, hud));
  store.player = new Player(p, t, boardEl, hud);
  const active = side.querySelector(".active");
  if (active) active.scrollIntoView({ block: "nearest" });
}

const GLYPHS = [
  "M6 18V6h12v10H10v-6h4v2",
  "M16.5 6.5c-2.5-2-8-1.5-8 2.5s7.5 2.5 7.5 6.5-5 4.5-8 2.5",
  "M12 4l8 8-8 8-8-8zM12 9l3 3-3 3-3-3z",
  "M6.5 6.5l11 11M17.5 6.5l-11 11M12 9.5v5M9.5 12h5",
  "M12 19v-8M12 11c-1.5-2.5-1-5.5 0-6.5 1 1 1.5 4 0 6.5M12 13c-2-1-5-.5-6 1.5 2 1 4.5.5 6-1.5M12 13c2-1 5-.5 6 1.5-2 1-4.5.5-6-1.5",
  "M12 6a3 3 0 1 1 0 .01M12 12a3 3 0 1 1-.01 0M6 12a3 3 0 1 1 0 .01M18 12a3 3 0 1 1 0 .01M12 18a3 3 0 1 1 0 .01",
  "M5 9.5c2.3-2.3 4.7 2.3 7 0s4.7-2.3 7 0M5 14.5c2.3-2.3 4.7 2.3 7 0s4.7-2.3 7 0",
  "M12 12h3v-4H8v8h10V5H5v14h14",
  "M6 6h12v12H6zM6 12h12M12 6v12",
  "M12 5l2 5h5l-4 3 1.5 5L12 15l-4.5 3L9 13 5 10h5z",
];

function glyph(i) {
  const n = ((i * 2654435761) >>> 0) % GLYPHS.length;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", "glyph");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", GLYPHS[n]);
  svg.append(path);
  return svg;
}

class Thrower {
  constructor(board) {
    this.board = board;
    this.el = el("div", { class: "claudius" }, sprite("claudius", 44));
    board.root.parentElement.append(this.el);
    this.at = null;
    requestAnimationFrame(() => this.walk(-1, Math.floor(board.cols / 2), 1, 0));
  }

  spot(r, c) {
    const b = this.board.root;
    const size = this.board.cells[0].getBoundingClientRect().width;
    return [b.offsetLeft + b.clientLeft + (c + 0.5) * size, b.offsetTop + b.clientTop + (r + 0.5) * size];
  }

  walk(r, c, dr, dc) {
    const [x, y] = this.spot(r, c);
    const moved = !this.at || Math.hypot(x - this.at[0], y - this.at[1]) > 1;
    this.at = [x, y];
    this.el.classList.toggle("face-left", dc < 0);
    this.el.style.setProperty("--dx", `${dc * 9}px`);
    this.el.style.setProperty("--dy", `${dr * 9}px`);
    this.el.style.transform = `translate(${x}px, ${y}px)`;
    if (moved) this.act("pop");
    return moved ? 110 : 0;
  }

  act(kind) {
    this.el.classList.remove("throw", "catch", "pop");
    void this.el.offsetWidth;
    this.el.classList.add(kind);
  }
}

class Board {
  constructor(p, root, onMove) {
    this.rows = p.board.length;
    this.cols = p.board[0].length;
    this.root = root;
    this.onMove = onMove;
    this.solid = new Set();
    this.goal = new Set();
    this.start = new Set();
    this.glue = new Set();
    p.board.forEach((line, r) =>
      [...line].forEach((ch, c) => {
        const i = r * this.cols + c;
        if (ch === "#" || ch === "X") this.solid.add(i);
        else if (ch === "o") this.goal.add(i);
        else if (ch === "t") this.start.add(i);
        else if (ch === "P" || ch === "x") {
          this.goal.add(i);
          this.start.add(i);
        }
        if (ch === "g") this.goal.add(i);
        if (ch === "g" || ch === "G" || ch === "x") this.glue.add(i);
      }),
    );
    this.tray = this.goal.size;
    this.mine = new Set(this.start);
    this.history = [];
    this.busy = false;
    this.locked = false;
    this.speed = 1;
    this.build();
    this.thrower = new Thrower(this);
  }

  build() {
    this.root.style.setProperty("--rows", this.rows);
    this.root.style.setProperty("--cols", this.cols);
    this.cells = [];
    this.root.replaceChildren();
    for (let i = 0; i < this.rows * this.cols; i++) {
      const cell = el("div", { class: "cell" });
      cell.addEventListener("click", () => this.click(i));
      cell.addEventListener("mouseenter", () => this.hover(i, true));
      cell.addEventListener("mouseleave", () => this.hover(i, false));
      this.cells.push(cell);
      this.root.append(cell);
    }
    this.paint();
  }

  rc(i) { return [Math.floor(i / this.cols), i % this.cols]; }
  inside(r, c) { return r >= 0 && r < this.rows && c >= 0 && c < this.cols; }
  filled(i) { return this.solid.has(i) || this.mine.has(i); }

  lane(i, dr, dc) {
    const [r, c] = this.rc(i);
    const path = [];
    let rr = r - dr, cc = c - dc;
    while (this.inside(rr, cc)) {
      path.push(rr * this.cols + cc);
      rr -= dr;
      cc -= dc;
    }
    const sr = r + dr, sc = c + dc;
    return { dr, dc, path, stop: this.inside(sr, sc) ? sr * this.cols + sc : -1 };
  }

  placeLane(i) {
    if (this.filled(i) || this.mine.size >= this.tray) return null;
    let best = null;
    for (const [dr, dc] of DIRS) {
      const l = this.lane(i, dr, dc);
      if (l.stop < 0 || !this.filled(l.stop)) continue;
      if (l.path.some((j) => this.filled(j))) continue;
      if (!best || l.path.length < best.path.length) best = l;
    }
    return best;
  }

  removeLane(i) {
    if (!this.mine.has(i) || this.glue.has(i)) return null;
    let best = null;
    for (const [dr, dc] of DIRS) {
      const l = this.lane(i, dr, dc);
      if (l.path.some((j) => this.filled(j))) continue;
      if (!best || l.path.length < best.path.length) best = l;
    }
    return best;
  }

  hover(i, on) {
    const cell = this.cells[i];
    cell.classList.remove("hover-ok", "hover-bad");
    if (!on || this.locked || this.solid.has(i)) return;
    const ok = this.mine.has(i) ? this.removeLane(i) : this.placeLane(i);
    cell.classList.add(ok ? "hover-ok" : "hover-bad");
  }

  click(i) {
    if (this.busy || this.locked || this.solid.has(i)) return;
    const op = this.mine.has(i) ? "r" : "p";
    if (!this.apply(op, i, true)) {
      this.cells[i].classList.remove("shake");
      void this.cells[i].offsetWidth;
      this.cells[i].classList.add("shake");
    }
  }

  apply(op, i, animate) {
    const l = op === "p" ? this.placeLane(i) : this.removeLane(i);
    if (!l) return false;
    const finish = () => {
      if (op === "p") this.mine.add(i);
      else this.mine.delete(i);
      this.history.push([op, i]);
      this.last = op === "p" ? i : -1;
      this.paint();
      this.busy = false;
      if (this.onMove) this.onMove(this);
    };
    if (!animate) {
      finish();
      return true;
    }
    this.busy = true;
    if (op === "r") {
      this.mine.delete(i);
      this.paint();
      this.mine.add(i);
    }
    this.fly(i, l, op, finish);
    return true;
  }

  fly(i, l, op, done) {
    const [r, c] = this.rc(i);
    const dist = l.path.length + 1;
    const wait = this.thrower.walk(r - l.dr * dist, c - l.dc * dist, l.dr, l.dc) / this.speed;
    setTimeout(() => {
      if (op === "p") this.thrower.act("throw");
      this.launch(i, l, op, done);
    }, wait + (op === "p" ? 70 / this.speed : 0));
  }

  launch(i, l, op, done) {
    const size = this.cells[0].getBoundingClientRect().width;
    const [r, c] = this.rc(i);
    const dist = l.path.length + 1;
    const out = [(r - l.dr * dist) * size, (c - l.dc * dist) * size];
    const at = [r * size, c * size];
    const [from, to] = op === "p" ? [out, at] : [at, out];
    const f = el("div", { class: `flyer${this.goal.has(i) ? "" : " temp"}${this.glue.has(i) && op === "p" ? " glued" : ""}` }, glyph(i));
    f.style.left = "1px";
    f.style.top = "1px";
    f.style.transform = `translate(${from[1]}px, ${from[0]}px)`;
    f.style.transitionDuration = `${Math.max(90, dist * 28) / this.speed}ms`;
    this.root.append(f);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        f.style.transform = `translate(${to[1]}px, ${to[0]}px)`;
      }),
    );
    let ended = false;
    const end = () => {
      if (ended) return;
      ended = true;
      f.remove();
      if (op === "r") this.thrower.act("catch");
      done();
    };
    f.addEventListener("transitionend", end);
    setTimeout(end, Math.max(90, dist * 28) / this.speed + 120);
  }

  paint() {
    this.cells.forEach((cell, i) => {
      cell.className = "cell" + (this.goal.has(i) ? " target" : "") + (this.glue.has(i) ? " glue" : "");
      cell.replaceChildren();
      if (this.solid.has(i)) cell.append(el("div", { class: "tile fixed" }, glyph(i)));
      else if (this.mine.has(i)) {
        const cls = "tile" + (this.goal.has(i) ? "" : " temp") + (this.glue.has(i) ? " glued" : "") + (i === this.last ? " last" : "");
        cell.append(el("div", { class: cls }, glyph(i)));
      }
    });
  }

  solved() {
    if (this.mine.size !== this.goal.size) return false;
    for (const g of this.goal) if (!this.mine.has(g)) return false;
    return true;
  }

  reset() {
    this.mine = new Set(this.start);
    this.history = [];
    this.last = -1;
    this.busy = false;
    this.root.querySelectorAll(".flyer").forEach((f) => f.remove());
    this.paint();
  }

  undo() {
    if (this.busy || !this.history.length) return;
    const moves = this.history.slice(0, -1);
    this.reset();
    for (const [op, i] of moves) this.apply(op, i, false);
  }
}

class Player {
  constructor(p, t, boardEl, hud) {
    this.p = p;
    this.t = t;
    this.hud = hud;
    this.step = 0;
    this.playing = false;
    this.timer = null;
    this.mode = "play";
    this.board = new Board(p, boardEl, () => this.update());
    this.plan = p.plan.map(([op, r, c]) => [op, r * this.board.cols + c, r, c]);
    this.render();
  }

  render() {
    const p = this.p;
    this.ctr = {
      moves: el("b", {}, "0"),
      tray: el("b", {}, String(this.board.tray)),
      record: el("b", {}, p.record != null ? String(p.record) : "–"),
    };
    this.banner = el("div", { class: "banner", hidden: true });
    this.playBtn = el("button", { class: "btn primary", onclick: () => this.toggle() }, "Play solution");
    this.prevBtn = el("button", { class: "btn", onclick: () => this.prev(), title: "Previous move" }, "◀ Step");
    this.nextBtn = el("button", { class: "btn", onclick: () => this.next(), title: "Next move" }, "Step ▶");
    this.moveList = el("div", { class: "moves" },
      this.plan.map(([op, , r, c], k) =>
        el("span", { class: op === "p" ? "place" : "remove", title: `Move ${k + 1}` }, `${op === "p" ? "+" : "−"}${r + 1},${c + 1}`),
      ),
    );
    const speed = el("input", { type: "range", min: "0.25", max: "3", step: "0.25", value: "1",
      oninput: (e) => (this.board.speed = Number(e.target.value)) });

    this.hud.replaceChildren(
      el("h2", {}, `${this.t.name} · Puzzle ${p.index}`),
      el("p", { class: "note" }, `${verdict(p)}. ${p.optimal ? "Proven optimal." : `Lower bound: ${p.lowerBound} moves.`}`),
      el("div", { class: "counter" },
        el("div", {}, this.ctr.moves, el("small", {}, "MOVES")),
        el("div", {}, this.ctr.tray, el("small", {}, "TILES LEFT")),
        el("div", {}, this.ctr.record, el("small", {}, "RECORD")),
      ),
      this.banner,
      el("div", { class: "btn-row" },
        el("button", { class: "btn", onclick: () => this.userUndo() }, "Undo"),
        el("button", { class: "btn", onclick: () => this.userReset() }, "Reset"),
      ),
      el("h2", {}, `Solution · ${p.moves} moves`),
      el("div", { class: "btn-row" }, this.playBtn, this.prevBtn, this.nextBtn),
      el("label", { class: "speed" }, "Speed", speed),
      this.moveList,
      el("p", { class: "note" }, "Click an empty cell to slide a tile in from an edge; it stops against the first tile in its way. Click one of your tiles to pull it back out. Red tiles are helpers sitting on non-target cells."),
      el("div", { class: "legend" },
        el("span", {}, el("i", { style: "background:var(--target)" }), "target"),
        el("span", {}, el("i", { style: "background:var(--fixed)" }), "fixed tile"),
        el("span", {}, el("i", { style: "background:var(--tile)" }), "your tile"),
        el("span", {}, el("i", { style: "background:var(--temp)" }), "helper"),
        p.board.some((l) => /[gGx]/.test(l)) ? el("span", {}, el("i", { style: "background:#2d86c9;border-radius:50%" }), "glue: a tile set here can't be removed") : null,
      ),
    );
    this.update();
  }

  update() {
    const b = this.board;
    this.ctr.moves.textContent = String(b.history.length);
    this.ctr.tray.textContent = String(b.tray - b.mine.size);
    [...this.moveList.children].forEach((s, k) => {
      s.classList.toggle("done", this.mode === "solution" && k < this.step - 1);
      s.classList.toggle("now", this.mode === "solution" && k === this.step - 1);
    });
    const now = this.moveList.querySelector(".now");
    if (now) now.scrollIntoView({ block: "nearest" });
    if (b.solved()) {
      const n = b.history.length;
      const rec = this.p.record;
      let msg = `Solved in <b>${n}</b> moves`;
      if (this.mode === "play" && rec != null) msg += n < rec ? " — that beats the world record!" : n === rec ? " — a perfect, record-tying solve!" : ` — the record is ${rec}.`;
      this.banner.innerHTML = msg;
      this.banner.hidden = false;
    } else this.banner.hidden = true;
    this.playBtn.textContent = this.playing ? "Pause" : this.step >= this.plan.length && this.mode === "solution" ? "Replay solution" : "Play solution";
    this.prevBtn.disabled = this.mode !== "solution" || this.step === 0;
    this.nextBtn.disabled = this.step >= this.plan.length && this.mode === "solution";
  }

  enterSolution() {
    if (this.mode === "solution") return;
    this.mode = "solution";
    this.step = 0;
    this.board.locked = true;
    this.board.reset();
  }

  toggle() {
    if (this.playing) return this.pause();
    this.enterSolution();
    if (this.step >= this.plan.length) {
      this.step = 0;
      this.board.reset();
    }
    this.playing = true;
    this.tick();
    this.update();
  }

  tick() {
    if (!this.playing) return;
    if (this.step >= this.plan.length) {
      this.playing = false;
      this.update();
      return;
    }
    this.next(() => {
      this.timer = setTimeout(() => this.tick(), 220 / this.board.speed);
    });
  }

  pause() {
    this.playing = false;
    clearTimeout(this.timer);
    this.update();
  }

  next(after) {
    this.enterSolution();
    if (this.board.busy || this.step >= this.plan.length) return;
    const [op, i] = this.plan[this.step];
    this.step++;
    const prevOnMove = this.board.onMove;
    this.board.onMove = (b) => {
      this.board.onMove = prevOnMove;
      this.update();
      if (after) after();
    };
    this.board.apply(op, i, true);
  }

  prev() {
    this.pause();
    if (this.step === 0) return;
    this.step--;
    this.board.reset();
    for (let k = 0; k < this.step; k++) this.board.apply(this.plan[k][0], this.plan[k][1], false);
    this.update();
  }

  userReset() {
    this.pause();
    this.mode = "play";
    this.step = 0;
    this.board.locked = false;
    this.board.reset();
    this.update();
  }

  userUndo() {
    if (this.mode === "solution") return this.prev();
    this.board.undo();
    this.update();
  }

  destroy() {
    this.playing = false;
    clearTimeout(this.timer);
  }
}

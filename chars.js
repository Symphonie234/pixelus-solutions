const PALETTE = {
  k: "#2b1d14", s: "#f2c48d", w: "#ffffff", r: "#c8323c", p: "#f28bb0", P: "#c2457a",
  y: "#f5c518", g: "#4caf50", G: "#2e7d32", b: "#3a8fd8", B: "#1d4f91", c: "#7fd6e8",
  v: "#7b3fa0", V: "#b07ad0", n: "#8b5a2b", N: "#5a3a1a", h: "#9e9e9e", H: "#5f5f5f",
  m: "#9ccc65", M: "#689f38", f: "#ff9e3d",
};

const CHARS = {
  cave: {
    name: "the Cyclops",
    mode: "blink",
    base: [
      "....kkkkkkkk....",
      "...kmmmmmmmmk...",
      "..kmmmmmmmmmmk..",
      "..kmmkkkkkkmmk..",
      "..kmkwwwwwwkmk..",
      "..kmkwwkkwwkmk..",
      "..kmkwwkkwwkmk..",
      "..kmmkkkkkkmmk..",
      "..kmmmmmmmmmmk..",
      "..kmmkwkkwkmmk..",
      "..kmmmkkkkmmmk..",
      "...kmmmmmmmmk...",
      "....kkNNNNkk....",
      "...knnnnnnnnk...",
      "..kmknnnnnnkmk..",
      "...kk.kkkk.kk...",
    ],
    alt: {
      4: "..kmmmmmmmmmmk..",
      5: "..kmkkkkkkkkmk..",
      6: "..kmmmmmmmmmmk..",
      7: "..kmmmmmmmmmmk..",
    },
  },
  flora: {
    name: "Flora",
    mode: "flip",
    base: [
      "..p..y..p..y..p.",
      "..gpgygpgygpgy..",
      "...knnnnnnnnk...",
      "..knnnnnnnnnnk..",
      "..knssssssssnk..",
      "..knskssssksnk..",
      "..knssssssssnk..",
      "..knpssrrsspnk..",
      "..knnssssssnnk..",
      "..knn.kssk.nnk..",
      "....kGggggGk....",
      "...kgggpgggk....",
      "..kgggggggggk...",
      ".kgGgggpgggGgk..",
      ".kkkkkkkkkkkkk..",
      "....ks....sk....",
    ],
    alt: {
      0: ".p..y..p..y..p..",
      1: "..ygpgygpgygpg..",
    },
  },
  cupid: {
    name: "Cupid",
    mode: "flip",
    base: [
      "......kkkk......",
      ".....kyyyyk.....",
      "....kyssssyk....",
      "....kskssksk....",
      "....kspsspsk....",
      ".ww..kssrsk..ww.",
      "wwww..kssk..wwww",
      ".wwwksssssskwww.",
      "..wwksspssskww..",
      "...kssssssskn...",
      "...kwwwwwwwk.n..",
      "...kwwwwwwwk.n..",
      "....kwwwwwk.n...",
      "....ksk.ksk.....",
      "....kk...kk.....",
      "................",
    ],
    alt: {
      5: "ww...kssrsk...ww",
      6: ".www..kssk..www.",
      7: "..wwksssssskww..",
      8: "....ksspsssk....",
    },
  },
  neptune: {
    name: "Neptune",
    mode: "flip",
    base: [
      "h.h.h...y.y.y...",
      "hhhhh..kyyyyyk..",
      "..h...kssssssk..",
      "..h...kskssksk..",
      "..h...kssssssk..",
      "..h..kwwwwwwwwk.",
      "..h..kwwwrrwwwk.",
      "..h...kwwwwwwk..",
      "..hs.kbbbbbbbbk.",
      "..hsskbbbbbbbbk.",
      "..h..kbbBbbBbbk.",
      "..h..kbbbbbbbbk.",
      "..h..kBbbbbbbBk.",
      "cc.cc.kbbbbbbk.c",
      "ccBcccBcccBcccBc",
      "BBBBBBBBBBBBBBBB",
    ],
    alt: {
      13: ".cc.cckbbbbbbkc.",
      14: "cccBcccBcccBcccB",
    },
  },
  venus: {
    name: "Venus",
    mode: "flip",
    base: [
      "......kkkk......",
      ".....kyyyyk.....",
      "....kyssssyk....",
      "....yskssksy....",
      "....yspsspsy....",
      "....yysrrsyy....",
      "...yyyksskyyy...",
      "...yykwwwwkyy...",
      "....kwwwwwwk....",
      "....kwwwwwwk....",
      ".pp.kwwwwwwk.pp.",
      "pPppkwwwwwwkppPp",
      "pPpPpPpPpPpPpPpP",
      ".pPpPpPpPpPpPpP.",
      "..ppppppppppppp.",
      "....pppppppp....",
    ],
    alt: {
      0: "..w...kkkk....w.",
      1: ".www.kyyyyk.....",
    },
  },
  bacchus: {
    name: "Bacchus",
    mode: "flip",
    base: [
      "...vVvgGgvVv....",
      "..vVkkkkkkkkVv..",
      "..gknnnnnnnnkg..",
      "...kssssssssk...",
      "...kskssssksk...",
      "...kpsssssspk...",
      "...kssrrrrssk...",
      "....kssssssk....",
      "..kvvvvvvvvvvk..",
      ".kvvVvvvvvvVvvk.",
      "skvvvvvvvvvvvvks",
      ".kvvvvvVvvvvvvk.",
      "..kvvvvvvvvvvk..",
      "...kvvvvvvvvk...",
      "....kss..ssk....",
      "....kkk..kkk....",
    ],
    alt: {
      7: "....kssssssk.yry",
      8: "..kvvvvvvvvvvkys",
      10: "skvvvvvvvvvvvvk.",
    },
  },
  vulcan: {
    name: "Vulcan",
    mode: "flip",
    base: [
      "..........HHH...",
      "...kkkkk..HHH...",
      "..kNNNNNk..n....",
      "..ksssssk..n....",
      "..kskssks.sn....",
      "..kNNNNNk.s.....",
      "..kNrrNNkss.....",
      ".knnnnnnnk......",
      ".knnhnnnnk......",
      ".knnnnnnnk......",
      ".knnnnnnnk..HHHH",
      "..knn.nnk..HHHHH",
      "..kss.ssk...HHH.",
      "..kkk.kkk..HHHHH",
      "HHHHHHHHHHHHHHHH",
      "NNNNNNNNNNNNNNNN",
    ],
    alt: {
      0: "................",
      1: "...kkkkk........",
      2: "..kNNNNNk.......",
      3: "..ksssssk.......",
      4: "..kskssks.......",
      5: "..kNNNNNk.......",
      6: "..kNrrNNkss..f.f",
      7: ".knnnnnnnk.ssf..",
      8: ".knnhnnnnk...n.f",
      9: ".knnnnnnnk..HHH.",
    },
  },
};

function spriteFrame(rows) {
  let out = "";
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === ch) end++;
      if (PALETTE[ch]) out += `<rect x="${x}" y="${y}" width="${end - x}" height="1" fill="${PALETTE[ch]}"/>`;
      x = end;
    }
  });
  return out;
}

function sprite(id, size = 64) {
  const ch = CHARS[id];
  if (!ch) return null;
  const alt = ch.base.map((row, y) => ch.alt[y] ?? row);
  const wrap = document.createElement("span");
  wrap.className = `sprite ${ch.mode}`;
  wrap.title = ch.name;
  wrap.style.setProperty("--size", `${size}px`);
  wrap.innerHTML =
    `<svg viewBox="0 0 16 16" shape-rendering="crispEdges" aria-label="${ch.name}" role="img">` +
    `<g class="f1">${spriteFrame(ch.base)}</g><g class="f2">${spriteFrame(alt)}</g></svg>`;
  return wrap;
}

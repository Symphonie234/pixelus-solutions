function spriteFrame(rows, pal) {
  let out = "";
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === ch) end++;
      if (pal[ch]) out += `<rect x="${x}" y="${y}" width="${end - x}" height="1" fill="${pal[ch]}"/>`;
      x = end;
    }
  });
  return out;
}

function sprite(id, size = 64) {
  const ch = CHARS[id];
  if (!ch) return null;
  const n = ch.base.length;
  const alt = ch.base.map((row, y) => ch.alt[y] ?? row);
  const wrap = document.createElement("span");
  wrap.className = `sprite ${ch.mode}`;
  wrap.title = ch.name;
  wrap.style.setProperty("--size", `${size}px`);
  wrap.innerHTML =
    `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" aria-label="${ch.name}" role="img">` +
    `<g class="f1">${spriteFrame(ch.base, ch.pal)}</g><g class="f2">${spriteFrame(alt, ch.pal)}</g></svg>`;
  return wrap;
}

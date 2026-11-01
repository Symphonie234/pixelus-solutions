# Pixelus Solutions

A fan-made archive of solutions for every temple puzzle in *Pixelus Deluxe*, solved in the fewest moves found so far.

Each puzzle page has:

- a playable board with the game's rules: click an empty cell and a tile slides in from an edge until it hits another tile; click one of your tiles to pull it back out,
- the saved solution, animated move by move, with step controls and a speed slider,
- the move count next to the game's world record, and whether the solution is proven optimal.

Moves are counted the way the game counts them: every tile slid in or pulled out is one move.

## Running it

It's a static site with no build step. Serve the folder with any static server, for example:

```
python -m http.server 8000
```

Then open http://localhost:8000.

## Files

- `index.html`, `styles.css`, `app.js`: the site.
- `data/puzzles.json`: every puzzle's board, solution, record and proof status.
- `thumbs/`: the finished mosaic for each puzzle.

*Pixelus Deluxe* is a game by Nuclide Games, published by PopCap. This site is unofficial.

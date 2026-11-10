/*
 * Découpe une planche de sprites générée (fond transparent, grille régulière)
 * en atlas exploitable par le jeu.
 *
 * Usage : node tools/atlas/slice_atlas.js images/atlas/src/foxy_props.png
 *
 * Lit la description <planche>.sprites.json à côté de la planche :
 *   { "output": "foxy", "columns": 4, "rows": 3, "cells": [["car_side"], ...] }
 * Une cellule peut contenir plusieurs objets séparés : ils sont nommés de
 * gauche à droite (position horizontale de leur centre).
 *
 * Produit dans images/atlas/ :
 *   <output>.png  les sprites ré-empaquetés, sans halo ni poussières
 *   <output>.json le rectangle de chaque sprite dans cette planche
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const ALPHA_THRESHOLD = 32;   // en dessous : halo de détourage, mis à zéro
const MIN_COMPONENT_AREA = 400; // en dessous : poussière, supprimée
const PADDING = 2;
const ATLAS_MAX_WIDTH = 2048;

function readSheet(sheetPath) {
  const png = PNG.sync.read(fs.readFileSync(sheetPath));
  const specPath = sheetPath.replace(/\.png$/i, '.sprites.json');
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  if (spec.cells.length !== spec.columns * spec.rows) {
    throw new Error(`${specPath} : ${spec.cells.length} cellules pour une grille ${spec.columns}x${spec.rows}`);
  }
  return { png, spec };
}

function alphaAt(png, x, y) {
  return png.data[(y * png.width + x) * 4 + 3];
}

/** Composantes connexes (8-voisinage) des pixels opaques d'un rectangle. */
function findComponents(png, rect) {
  const { x: rx, y: ry, w, h } = rect;
  const labels = new Int32Array(w * h).fill(-1);
  const components = [];

  for (let start = 0; start < w * h; start++) {
    if (labels[start] !== -1 || alphaAt(png, rx + (start % w), ry + Math.floor(start / w)) < ALPHA_THRESHOLD) continue;

    const component = { pixels: [], minX: w, minY: h, maxX: 0, maxY: 0, sumX: 0 };
    const stack = [start];
    labels[start] = components.length;

    while (stack.length) {
      const index = stack.pop();
      const cx = index % w;
      const cy = Math.floor(index / w);
      component.pixels.push(index);
      component.sumX += cx;
      component.minX = Math.min(component.minX, cx);
      component.minY = Math.min(component.minY, cy);
      component.maxX = Math.max(component.maxX, cx);
      component.maxY = Math.max(component.maxY, cy);

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const neighbor = ny * w + nx;
          if (labels[neighbor] !== -1 || alphaAt(png, rx + nx, ry + ny) < ALPHA_THRESHOLD) continue;
          labels[neighbor] = components.length;
          stack.push(neighbor);
        }
      }
    }
    components.push(component);
  }
  return components;
}

function sliceSheet(sheetPath) {
  const { png, spec } = readSheet(sheetPath);
  const cellWidth = Math.floor(png.width / spec.columns);
  const cellHeight = Math.floor(png.height / spec.rows);
  const sprites = [];

  spec.cells.forEach((names, cellIndex) => {
    const rect = {
      x: (cellIndex % spec.columns) * cellWidth,
      y: Math.floor(cellIndex / spec.columns) * cellHeight,
      w: cellWidth,
      h: cellHeight
    };
    const objects = findComponents(png, rect)
      .filter(c => c.pixels.length >= MIN_COMPONENT_AREA)
      .sort((a, b) => b.pixels.length - a.pixels.length);

    if (objects.length < names.length) {
      throw new Error(`Cellule ${cellIndex + 1} : ${objects.length} objet(s) trouvé(s), ${names.length} attendu(s) (${names.join(', ')}). Objets collés ?`);
    }

    // Les morceaux détachés d'un objet (mât, perle isolée) sont rattachés
    // à l'objet principal le plus proche horizontalement.
    const main = objects.slice(0, names.length)
      .sort((a, b) => a.sumX / a.pixels.length - b.sumX / b.pixels.length);
    objects.slice(names.length).forEach(fragment => {
      const fx = fragment.sumX / fragment.pixels.length;
      const owner = main.reduce((best, c) =>
        Math.abs(c.sumX / c.pixels.length - fx) < Math.abs(best.sumX / best.pixels.length - fx) ? c : best);
      owner.pixels.push(...fragment.pixels);
      owner.minX = Math.min(owner.minX, fragment.minX);
      owner.minY = Math.min(owner.minY, fragment.minY);
      owner.maxX = Math.max(owner.maxX, fragment.maxX);
      owner.maxY = Math.max(owner.maxY, fragment.maxY);
    });

    main.forEach((component, i) => {
      sprites.push({ name: names[i], cell: rect, component });
    });
  });

  const atlas = packSprites(png, sprites);
  const outputDir = path.join(path.dirname(sheetPath), '..');
  const imageFile = `${spec.output}.png`;
  fs.writeFileSync(path.join(outputDir, imageFile), PNG.sync.write(atlas.png));
  fs.writeFileSync(
    path.join(outputDir, `${spec.output}.json`),
    JSON.stringify({ image: `images/atlas/${imageFile}`, sprites: atlas.frames }, null, 2) + '\n'
  );
  console.log(`Atlas "${spec.output}" : ${sprites.length} sprites, ${atlas.png.width}x${atlas.png.height} -> images/atlas/${imageFile}`);
}

/**
 * Range les sprites par rangées (du plus haut au plus bas) dans une nouvelle
 * planche. Seuls les pixels de chaque objet sont copiés : deux objets proches
 * sur la planche source ne débordent pas l'un sur l'autre.
 */
function packSprites(source, sprites) {
  const placements = [];
  let cursorX = 0;
  let cursorY = 0;
  let rowHeight = 0;

  [...sprites]
    .sort((a, b) => (b.component.maxY - b.component.minY) - (a.component.maxY - a.component.minY))
    .forEach(sprite => {
      const w = sprite.component.maxX - sprite.component.minX + 1 + PADDING * 2;
      const h = sprite.component.maxY - sprite.component.minY + 1 + PADDING * 2;
      if (cursorX + w > ATLAS_MAX_WIDTH) {
        cursorX = 0;
        cursorY += rowHeight;
        rowHeight = 0;
      }
      placements.push({ sprite, x: cursorX, y: cursorY, w, h });
      cursorX += w;
      rowHeight = Math.max(rowHeight, h);
    });

  const width = Math.max(...placements.map(p => p.x + p.w));
  const height = Math.max(...placements.map(p => p.y + p.h));
  const png = new PNG({ width, height });
  png.data.fill(0);
  const frames = {};

  placements.forEach(({ sprite, x, y, w, h }) => {
    const { cell, component } = sprite;
    component.pixels.forEach(index => {
      const sx = cell.x + (index % cell.w);
      const sy = cell.y + Math.floor(index / cell.w);
      const dx = x + PADDING + (index % cell.w) - component.minX;
      const dy = y + PADDING + Math.floor(index / cell.w) - component.minY;
      source.data.copy(png.data, (dy * width + dx) * 4, (sy * source.width + sx) * 4, (sy * source.width + sx) * 4 + 4);
    });
    frames[sprite.name] = { x, y, w, h };
  });

  // Ordre de la description d'origine, plus lisible que l'ordre de rangement.
  const orderedFrames = {};
  sprites.forEach(s => { orderedFrames[s.name] = frames[s.name]; });
  return { png, frames: orderedFrames };
}

const sheetPath = process.argv[2];
if (!sheetPath) {
  console.error('Usage : node tools/atlas/slice_atlas.js <planche.png>');
  process.exit(1);
}
sliceSheet(sheetPath);

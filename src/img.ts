import { QuadKey } from '@basemaps/geo';
import { TileMatrixSet } from '@basemaps/geo/build/tile.matrix.set.js';
import { GoogleTms } from '@basemaps/geo/build/tms/google.js';
import NodeCanvas from 'canvas';
import { Vector } from './vector.js';
import { BorderColors } from './wmts/index.js';

const CanvasSize = 512;
const FontSize = 80;
const FontFamily = process.env.XYZ_FONT_FAMILY ?? 'Victor Mono';

function isQuadKeyCapable(tms: TileMatrixSet): boolean {
  for (const def of tms.def.tileMatrix) {
    if (def.matrixWidth !== def.matrixHeight) return false;
  }
  return true;
}

async function toXyz(v: Vector, tms?: TileMatrixSet): Promise<Buffer> {
  const espgName = tms?.def.identifier ?? GoogleTms.def.identifier;

  let qk = isQuadKeyCapable(tms ?? GoogleTms) ? QuadKey.fromTile(v) : '';

  // Quad keys get too long for tiles so shorten them
  const halfQk = Math.ceil(qk.length / 2);
  if (halfQk > 6) qk = qk.slice(0, halfQk) + '\n' + qk.slice(halfQk);

  const xyzS = `${v.x},${v.y}`;
  const canvas = NodeCanvas.createCanvas(CanvasSize, CanvasSize);

  const ctx = canvas.getContext('2d');

  const halfCanvas = CanvasSize / 2;
  const quarterCanvas = CanvasSize / 4;

  const tileFontSize = Math.min(Math.floor(CanvasSize / v.z + 30), FontSize);

  // Fill & Stroke the center text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${tileFontSize}px '${FontFamily}'`;
  ctx.fillStyle = 'rgba(240,240,240,0.87)';
  ctx.strokeStyle = 'rgba(0,0,0,0.87)';
  // Render the XYZ
  ctx.fillText(xyzS, halfCanvas, halfCanvas - quarterCanvas);
  ctx.strokeText(xyzS, halfCanvas, halfCanvas - quarterCanvas);

  // Quadkey
  if (qk !== '') {
    ctx.fillText(qk, halfCanvas, halfCanvas - quarterCanvas / 3);
    ctx.strokeText(qk, halfCanvas, halfCanvas - quarterCanvas / 3);
  }

  // Zoom level
  ctx.fillText(`z${v.z}`, halfCanvas, halfCanvas + quarterCanvas);
  ctx.strokeText(`z${v.z}`, halfCanvas, halfCanvas + quarterCanvas);

  // Log the TileMatrixSet used to render this
  if (tms) {
    ctx.font = `bold ${FontSize - 24}px "${FontFamily}"`;
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = BorderColors[espgName];

    ctx.fillText(tms.def.identifier, halfCanvas, CanvasSize);
    ctx.strokeText(tms.def.identifier, halfCanvas, CanvasSize);
  }

  // Stroke around the edges
  ctx.strokeStyle = BorderColors[espgName];
  ctx.lineWidth = 4;
  // ctx.stroke

  ctx.beginPath();
  ctx.lineTo(1, 1);
  ctx.lineTo(1, CanvasSize - 1);
  ctx.lineTo(CanvasSize - 1, CanvasSize - 1);
  ctx.lineTo(CanvasSize - 1, 1);
  ctx.lineTo(1, 1);
  ctx.stroke();

  return canvas.toBuffer('image/png');
}

export const Png = { toXyz };

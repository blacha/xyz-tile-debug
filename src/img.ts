import { QuadKey } from '@basemaps/geo';
import { TileMatrixSet } from '@basemaps/geo/build/tile.matrix.set';
import { GoogleTms } from '@basemaps/geo/build/tms/google';
import * as NodeCanvas from 'canvas';
import { Vector } from './vector';
import { BorderColors } from './wmts';

const CanvasSize = 512;
const FontSize = CanvasSize / 8;

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
  if (qk.length > 10) qk = qk.slice(0, 3) + '.' + qk.slice(qk.length - 6);

  const xyzS = `${v.x},${v.y}`;
  const canvas = NodeCanvas.createCanvas(CanvasSize, CanvasSize);
  const ctx = canvas.getContext('2d');

  const halfCanvas = CanvasSize / 2;
  const quarterCanvas = CanvasSize / 4;

  // Fill & Stroke the center text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${FontSize}px 'm+ 1m'`;
  ctx.fillStyle = 'rgba(240,240,240,1)';
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  // Render the XYZ
  ctx.fillText(xyzS, halfCanvas, halfCanvas - quarterCanvas);
  ctx.strokeText(xyzS, halfCanvas, halfCanvas - quarterCanvas);

  // Quadkey
  if (qk !== '') {
    ctx.fillText(qk, halfCanvas, halfCanvas);
    ctx.strokeText(qk, halfCanvas, halfCanvas);
  }

  // Zoom level
  ctx.fillText(`z${v.z}`, halfCanvas, halfCanvas + quarterCanvas);
  ctx.strokeText(`z${v.z}`, halfCanvas, halfCanvas + quarterCanvas);

  // Log the TileMatrixSet used to render this
  if (tms) {
    ctx.font = `bold ${FontSize - 12}px "m+ 1m"`;
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = BorderColors[espgName];

    ctx.fillText(tms.def.identifier, halfCanvas, CanvasSize);
    ctx.strokeText(tms.def.identifier, halfCanvas, CanvasSize);
  }

  // Stroke around the edges
  ctx.strokeStyle = BorderColors[espgName];

  ctx.beginPath();
  ctx.lineTo(0.5, 0.5);
  ctx.lineTo(0.5, CanvasSize - 0.5);
  ctx.lineTo(CanvasSize - 0.5, CanvasSize - 0.5);
  ctx.lineTo(CanvasSize - 0.5, 0.5);
  ctx.lineTo(0.5, 0.5);
  ctx.stroke();

  return canvas.toBuffer('image/png');
}

export const Png = { toXyz };

import { Vector } from './vector';
import { QuadKey } from '@basemaps/geo';
import { TileMatrixSet } from '@basemaps/geo/build/tile.matrix.set';
import * as NodeCanvas from 'canvas';

const CANVAS_SIZE = 256;
const FONT_SIZE = CANVAS_SIZE / 6;

async function xyzPng(v: Vector, tms?: TileMatrixSet) {
    let qk = '';
    try {
        qk = tms?.quadKey.fromTile(v) ?? QuadKey.fromTile(v);
    } catch (e) {}

    // Quad keys get too long for tiles so shorten them
    if (qk.length > 10) {
        qk = qk.slice(0, 3) + '.' + qk.slice(qk.length - 6);
    }
    const xyzS = `${v.x},${v.y}`;
    const canvas = NodeCanvas.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    const ctx = canvas.getContext('2d');

    const halfCanvas = CANVAS_SIZE / 2;
    const quarterCanvas = CANVAS_SIZE / 4;

    // Fill & Stroke the center text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${FONT_SIZE}px "m+ 1m"`;
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    // Render the XYZ
    ctx.fillText(xyzS, halfCanvas, halfCanvas - quarterCanvas);
    ctx.strokeText(xyzS, halfCanvas, halfCanvas - quarterCanvas);

    // Quadkey
    ctx.fillText(qk, halfCanvas, halfCanvas);
    ctx.strokeText(qk, halfCanvas, halfCanvas);

    // Zoom level
    ctx.fillText(`z${v.z}`, halfCanvas, halfCanvas + quarterCanvas);
    ctx.strokeText(`z${v.z}`, halfCanvas, halfCanvas + quarterCanvas);

    // Log the TileMatrixSet used to render this
    if (tms) {
        ctx.font = `bold ${FONT_SIZE - 12}px "m+ 1m"`;
        ctx.textBaseline = 'bottom';

        ctx.fillText(tms.def.identifier, halfCanvas, CANVAS_SIZE);
        ctx.strokeText(tms.def.identifier, halfCanvas, CANVAS_SIZE);
    }

    // Stroke around the edges
    ctx.strokeStyle = 'rgba(255,0,0,0.75)';
    ctx.beginPath();
    ctx.lineTo(0.5, 0.5);
    ctx.lineTo(0.5, CANVAS_SIZE - 0.5);
    ctx.lineTo(CANVAS_SIZE - 0.5, CANVAS_SIZE - 0.5);
    ctx.lineTo(CANVAS_SIZE - 0.5, 0.5);
    ctx.lineTo(0.5, 0.5);
    ctx.stroke();

    return canvas.toBuffer('image/png');
}

export const Png = {
    toXyz: xyzPng,
};

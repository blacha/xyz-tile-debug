import { Vector } from './vector';
import { QuadKey } from './quad.key';
import * as NodeCanvas from 'canvas';

const CANVAS_SIZE = 256;
const FONT_SIZE = CANVAS_SIZE / 6;

async function xyzPng(v: Vector) {
    let qk = QuadKey.toQuadKey(v);
    // Quad keys get too long for tiles so shorten them
    if (qk.length > 10) {
        qk = qk.slice(0, 3) + '..' + qk.slice(qk.length - 7);
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
    ctx.fillText(xyzS, halfCanvas, quarterCanvas);
    ctx.strokeText(xyzS, halfCanvas, quarterCanvas);
    ctx.fillText(qk, halfCanvas, quarterCanvas * 2);
    ctx.strokeText(qk, halfCanvas, quarterCanvas * 2);
    ctx.fillText(`z${v.z}`, halfCanvas, quarterCanvas * 3);
    ctx.strokeText(`z${v.z}`, halfCanvas, quarterCanvas * 3);

    // Stroke around the edges
    ctx.strokeStyle = 'rgba(255,0,0,0.75)';
    ctx.beginPath();
    ctx.lineTo(0.5, 0.5);
    ctx.lineTo(0.5, CANVAS_SIZE - 0.5);
    ctx.lineTo(CANVAS_SIZE - 0.5, CANVAS_SIZE - 0.5);
    ctx.lineTo(CANVAS_SIZE - 0.5, 0.5);
    ctx.lineTo(0.5, 0.5);
    ctx.stroke();

    return canvas.toBuffer('image/png', {});
}

export const Png = {
    toXyz: xyzPng,
};

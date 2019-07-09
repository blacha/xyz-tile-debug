import { Vector } from './vector';
import { QuadKey } from './quad.key';
import * as NodeCanvas from 'canvas';

const CANVAS_SIZE = 256;

async function xyzPng(v: Vector) {
    let qk = QuadKey.toQuadKey(v);
    // Quad keys get too long for tiles so shorten them
    if (qk.length > 10) {
        qk = qk.slice(0, 3) + '..' + qk.slice(qk.length - 7);
    }
    const xyzS = `${v.x},${v.y} z${v.z}`;
    const canvas = NodeCanvas.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    const ctx = canvas.getContext('2d');

    // Fill & Stroke the center text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 24px "m+ 1m"';
    ctx.fillStyle = 'rgba(256,256,256,0.87)';
    ctx.strokeStyle = 'rgba(0,0,0,0.87)';
    ctx.fillText(xyzS, CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 12);
    ctx.strokeText(xyzS, CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 12);
    ctx.fillText(qk, CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 12);
    ctx.strokeText(qk, CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 12);

    // Stroke around the edges
    ctx.strokeStyle = 'rgba(256,0,0,0.75)';
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

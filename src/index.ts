import * as express from 'express';
import { performance } from 'perf_hooks';
import 'source-map-support/register';
import { Png } from './img';
import { Logger } from './log';
import { Vector } from './vector';
import { buildWmts } from './wmts/build';
import { TileMatrixes } from './wmts';

const PORT = process.env.PORT || 8855;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const app = express();

function getXyz(req: express.Request): Vector {
    const x = parseInt(req.params['x'] ?? req.query['x'], 10);
    const y = parseInt(req.params['y'] ?? req.query['y'], 10);
    const z = parseInt(req.params['z'] ?? req.query['z'], 10);

    if (isNaN(x) || isNaN(y) || isNaN(z)) {
        throw new Error(`Invalid xyz ${x}/${y}/${z}`);
    }

    return { x, y, z };
}

export interface Req extends express.Request {
    ctx: Record<string, any>;
}
function asyncRequest(fn: (req: Req, res: express.Response) => Promise<void>) {
    return async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        const startTime = performance.now();

        const logCtx: Record<string, any> = {
            ip: req.headers['x-forwarded-for'] ?? req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            duration: -1,
            status: 200,
        };
        const subReq = req as Req;
        subReq.ctx = logCtx;

        try {
            await fn(subReq, res);
        } catch (e) {
            res.status(500);
            logCtx.err = e;
            res.end();
        }

        logCtx.duration = Math.floor((performance.now() - startTime) * 100) / 100;
        logCtx.status = res.statusCode;

        if (res.statusCode > 399) {
            Logger.warn(logCtx, req.url);
        } else {
            Logger.info(logCtx, req.url);
        }

        next();
    };
}

async function serveTile(req: Req, res: express.Response) {
    const v = getXyz(req);
    const matrixName = req.query['tms'] ?? req.params['tms'] ?? '';
    const tms = TileMatrixes.find((f) => f.def.identifier == matrixName);
    const png = await Png.toXyz(v, tms);

    req.ctx.x = v.x;
    req.ctx.y = v.y;
    req.ctx.z = v.z;
    req.ctx.tms = tms?.def.identifier;
    res.header('content-type', 'image/png');
    res.send(png);
}

async function serveWmts(req: Req, res: express.Response) {
    res.header('content-type', 'application/xml');
    res.header('cache-control', 'no-cache');
    res.send(buildWmts(TileMatrixes, BASE_URL));
}

app.get('/v1/tiles/:tms/:z/:x/:y.png', asyncRequest(serveTile));
app.get('/:z/:x/:y.png', asyncRequest(serveTile));

app.get('/WMTSCapabilities.xml', asyncRequest(serveWmts));
app.get('/v1/wmts/WMTSCapabilities.xml', asyncRequest(serveWmts));

async function init() {
    await app.listen(PORT);
    Logger.info(
        { wmts: `${BASE_URL}/v1/wmts/WMTSCapabilities.xml'`, xyz: `${BASE_URL}/v1/tiles/:tileMatrixSet/:z/:x/:y.png` },
        'Started',
    );
}

init().catch(console.error.bind(console));

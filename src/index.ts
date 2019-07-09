import 'source-map-support/register';

import * as express from 'express';
import { Png } from './img';
import { Vector } from './vector';

const PORT = process.env.PORT || Math.floor(Math.random() * 4096) + 30000;
const app = express();

function getXyz(req: express.Request): Vector {
    const x = parseInt(req.params['x'], 10);
    const y = parseInt(req.params['y'], 10);
    const z = parseInt(req.params['z'], 10);

    if (isNaN(x) || isNaN(y) || isNaN(z)) {
        throw new Error(`Invalid xyz ${x}/${y}/${z}`);
    }

    return { x, y, z };
}

app.get('/:x/:y/:z.png', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const v = getXyz(req);
    console.time(`png:${v.x}:${v.y}:${v.z}`);
    const png = await Png.toXyz(v);
    console.timeEnd(`png:${v.x}:${v.y}:${v.z}`);
    res.header('content-type', 'image/png');
    res.send(png);
    next();
});

async function init() {
    await app.listen(PORT);
    console.log('Listening', `http://localhost:${PORT}`);
    console.log(`http://localhost:${PORT}/{x}/{y}/{z}.png`);
}

init().catch(console.error.bind(console));

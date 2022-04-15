import { startCluster } from './cluster.js';
import { init } from './server.js';

const WORKER_COUNT = Number(process.env.WORKER_COUNT ?? '4');

startCluster(init, WORKER_COUNT);

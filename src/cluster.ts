import cluster from 'cluster';
import { Logger } from './log.js';
const GIT_HASH = process.env.GIT_HASH;
const GIT_VERSION = process.env.GIT_VERSION;

export function startCluster(start: (id: string) => void, workerCount: number): void {
  if (cluster.isMaster && workerCount > 1) {
    if (GIT_VERSION) Logger.info({ version: GIT_VERSION, hash: GIT_HASH, workers: workerCount }, 'Starting');

    for (let i = 0; i < workerCount; i++) cluster.fork({ WORKER_ID: i });
    cluster.on('exit', (worker) => Logger.warn({ wId: `w${worker.id - 1}` }, 'Worker:Exit'));
  } else {
    start(`w${process.env.WORKER_ID}`);
  }
}

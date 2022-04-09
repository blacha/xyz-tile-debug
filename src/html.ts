import { GoogleTms, Nztm2000QuadTms } from '@basemaps/geo';
import { V } from './vdom.js';

export function buildIndex(): string {
  let startX = 6624592;
  let startY = 5675226;
  const tiles = [];

  for (let z = GoogleTms.maxZoom; z > 0; z--) {
    tiles.push(
      V('img', { src: `/v1/tiles/WebMercatorQuad/${z}/${startY}/${startX}.png`, width: '256', height: '256' }),
    );
    startX = Math.floor(startX / 2);
    startY = Math.floor(startY / 2);
  }
  tiles.push(V('h1', GoogleTms.identifier));

  startX = 662459;
  startY = 567522;
  for (let z = Nztm2000QuadTms.maxZoom; z > 0; z--) {
    tiles.push(V('img', { src: `/v1/tiles/NZTM2000Quad/${z}/${startY}/${startX}.png`, width: '256', height: '256' }));
    startX = Math.floor(startX / 2);
    startY = Math.floor(startY / 2);
  }
  tiles.push(V('h1', Nztm2000QuadTms.identifier));

  return V('html', [V('body', [V('h1', 'Example Tiles'), ...tiles.reverse()])]).toString();
}

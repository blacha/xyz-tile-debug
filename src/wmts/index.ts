import * as NZTM from '@linzjs/tile-matrix-set';
import { GoogleTms } from '@basemaps/geo/build/tms/google';
import { TileMatrixSet } from '@basemaps/geo';

const Nztm2000Tms = new TileMatrixSet(NZTM.Nztm2000);
const Nztm2000QuadTms = new TileMatrixSet(NZTM.Nztm2000Quad);

export const TileMatrixes = [Nztm2000Tms, Nztm2000QuadTms, GoogleTms];

export const BorderColors: Record<string, string> = {
  [GoogleTms.def.identifier]: 'rgba(255,0,0,0.75)',
  [Nztm2000Tms.def.identifier]: 'rgba(255,0,255,0.75)',
  [Nztm2000QuadTms.def.identifier]: 'rgba(255,127,63,0.75)',
};

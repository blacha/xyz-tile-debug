import { GoogleTms } from '@basemaps/geo/build/tms/google.js';
import { Nztm2000Tms, Nztm2000QuadTms } from '@basemaps/geo/build/tms/nztm2000.js';

export const TileMatrixes = [Nztm2000Tms, Nztm2000QuadTms, GoogleTms];

export const BorderColors: Record<string, string> = {
  [GoogleTms.def.identifier]: 'rgba(255,0,0,0.75)',
  [Nztm2000Tms.def.identifier]: 'rgba(255,0,255,0.75)',
  [Nztm2000QuadTms.def.identifier]: 'rgba(255,127,63,0.75)',
};

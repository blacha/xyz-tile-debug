import { Nztm2000Tms } from '@basemaps/geo/build/tms/nztm2000';
import { GoogleTms } from '@basemaps/geo/build/tms/google';

export const TileMatrixes = [Nztm2000Tms, GoogleTms];

export const BorderColors: Record<string, string> = {
  [GoogleTms.def.identifier]: 'rgba(255,0,0,0.75)',
  [Nztm2000Tms.def.identifier]: 'rgba(255,0,255,0.75)',
};

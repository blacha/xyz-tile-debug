import * as o from 'ospec';
import { QuadKey } from '../src/quad.key';

o.spec('QuadKey', () => {
    const XYZ = { x: 857, y: 555, z: 10 };
    const QUAD_KEY = '3101213023';

    o('should round trip', () => {
        const qk = QuadKey.toQuadKey(XYZ);
        const xyz = QuadKey.toXyz(qk);
        o(xyz).deepEquals(XYZ);
    });

    o('should compute known value', () => {
        const qk = QuadKey.toQuadKey(XYZ);
        o(qk).equals(QUAD_KEY);
    });

    o('should error on invalid quadkey', () => {
        o(() => QuadKey.toXyz('0b')).throws('Unkown char:"b" offset:1 in quad key 0b');
    });
});

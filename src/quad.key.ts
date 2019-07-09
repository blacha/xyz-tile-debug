import { Vector } from './vector';

function xyzToQuadKey(v: Vector) {
    const quadKey = [];
    for (let i = v.z; i > 0; i--) {
        let digit = 0;
        const mask = 1 << (i - 1);
        if ((v.x & mask) != 0) {
            digit += 1;
        }
        if ((v.y & mask) != 0) {
            digit += 2;
        }

        quadKey.push(digit);
    }
    return quadKey.join('');
}

function quadKeyToXyz(qk: string) {
    let x = 0;
    let y = 0;
    const levelOfDetail = qk.length;
    for (let i = levelOfDetail; i > 0; i--) {
        const mask = 1 << (i - 1);
        const char = qk.charAt(levelOfDetail - i);
        switch (char) {
            case '0':
                break;
            case '1':
                x = x | mask;
                break;
            case '2':
                y = y | mask;
                break;
            case '3':
                x = x | mask;
                y = y | mask;
                break;
            default:
                throw Error(`Unkown char:"${char}" offset:${i} in quad key ${qk}`);
        }
    }
    return { x, y, z: qk.length };
}

export const QuadKey = {
    toXyz: quadKeyToXyz,
    toQuadKey: xyzToQuadKey,
};

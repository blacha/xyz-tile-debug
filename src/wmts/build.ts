/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TileMatrixSet } from '@basemaps/geo/build/tile.matrix.set';
import { V, VNode } from '../vdom';

const XmlPrefix = `<?xml version="1.0"?>`;
const CapabilitiesAttrs = {
    xmlns: 'http://www.opengis.net/wmts/1.0',
    'xmlns:ows': 'http://www.opengis.net/ows/1.1',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    'xmlns:gml': 'http://www.opengis.net/gml',
    'xsi:schemaLocation':
        'http://www.opengis.net/wmts/1.0 http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd',
    version: '1.0.0',
};
export function tmsToBoundingBox(tms: TileMatrixSet) {
    return V('ows:BoundingBox', { crs: tms.projection.toUrn() }, [
        V('ows:LowerCorner', tms.def.boundingBox.lowerCorner.join(' ')),
        V('ows:UpperCorner', tms.def.boundingBox.upperCorner.join(' ')),
    ]);
}
function tmsToXml(tms: TileMatrixSet): VNode {
    return V('TileMatrixSet', [
        V('ows:Title', tms.def.title),
        tms.def.abstract ? V('ows:Abstract', tms.def.abstract) : null,
        V('ows:Identifier', tms.def.identifier),
        V('ows:SupportedCRS', tms.projection.toUrn()),
        tms.def.wellKnownScaleSet ? V('ows:WellKnownScaleSet', tms.def.wellKnownScaleSet) : null,
        tmsToBoundingBox(tms),
        ...tms.def.tileMatrix.map((c) => {
            return V('TileMatrix', [
                V('ows:Identifier', c.identifier),
                V('ScaleDenominator', c.scaleDenominator),
                V('TopLeftCorner', c.topLeftCorner.join(' ')),
                V('TileWidth', c.tileWidth),
                V('TileHeight', c.tileHeight),
                V('MatrixWidth', c.matrixWidth),
                V('MatrixHeight', c.matrixHeight),
            ]);
        }),
    ]);
}

export function buildWmts(tms: TileMatrixSet[], baseUrl: string): string {
    return (
        XmlPrefix +
        V('Capabilities', CapabilitiesAttrs, [
            V('Contents', [
                V('Layer', [
                    V('ows:Title', 'Debug Tiles'),
                    V('ows:Abstract', ''),
                    V('ows:Identifier', 'DebugTiles'),
                    ...tms.map(tmsToBoundingBox),
                    V('Style', [V('ows:Identifier', 'default')]),
                    V('Format', 'image/png'),
                    ...tms.map((c) => V('TileMatrixSetLink', [V('TileMatrixSet', c.def.identifier)])),
                    V('ResourceURL', {
                        format: 'image/png',
                        resourceType: 'tile',
                        template: `${baseUrl}/v1/tiles/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.png`,
                    }),
                ]),
                ...tms.map(tmsToXml),
            ]),
        ]).toString()
    );
}

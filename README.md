# Debug XYZ tile server

Generates debug tiles to overlay in a system that consumes XYZ tiles


![Example Tile](./static/example.tile.png)


## Format
Images are output with a red border, QuadKey and XYZ tile information

```
QuadKey
X, Y, Zoom
```


# Building
This requires [NodeJs](https://nodejs.org/en/) > 12 & [Yarn](https://yarnpkg.com/en/)

Use [n](https://github.com/tj/n) to manage nodeJs versions

```bash
# Download the latest nodejs & yarn
n latest
npm install -g yarn

# Install node deps
yarn

# Build everything into /build
yarn run build

# Run the unit tests
yarn run test

# Start the server
yarn run start
```

The server will start on a random port above 30000, this can be configured using a `PORT` environment vairable

```shell
PORT=1234 yarn run start
```

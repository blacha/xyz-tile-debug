FROM node:16-alpine as builder

RUN apk add  --update --no-cache \
    build-base \
    autoconf \
    bash \
    krb5-dev \
    imagemagick \
    libjpeg \
    cairo-dev \
    imagemagick \
    icu-dev \
    jpeg-dev \
    libpng-dev \
    pango-dev \
    giflib-dev \
    gd-dev \
    fontconfig

# Create app directory
WORKDIR /usr/src/app

COPY *.json ./
COPY yarn.lock ./

RUN yarn
ADD src ./src
RUN yarn build

ADD static/mplus-1m-regular.ttf /usr/share/fonts/
ADD static/VictorMono-Medium.otf /usr/share/fonts/

RUN fc-cache -f

CMD ["node", "build/src/index.js"]

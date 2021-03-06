FROM node:15-alpine as builder

RUN apk add  --update --no-cache \
    build-base \
    autoconf \
    bash \
    python \
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
    ttf-opensans ttf-dejavu ttf-droid \
    ttf-freefont ttf-liberation ttf-ubuntu-font-family \
    fontconfig

# Create app directory
WORKDIR /usr/src/app

COPY *.json ./
COPY yarn.lock ./
ADD src ./src

RUN yarn
RUN yarn build

ADD static/mplus-1m-regular.ttf /usr/share/fonts/
RUN fc-cache -f

CMD ["yarn", "start"]

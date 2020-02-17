FROM node:lts-alpine

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python

COPY . /var/www

RUN cd /var/www &&\
  npm install --quiet node-gyp -g &&\
  npm install --quiet && \
  apk del native-deps

WORKDIR /var/www
EXPOSE 3000
CMD ["npm", "run", "serve"]
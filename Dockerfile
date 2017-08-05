FROM node:8.2-alpine

WORKDIR /esspunkt60

COPY app /esspunkt60/app
COPY public /esspunkt60/public
COPY package.json /esspunkt60/package.json
COPY index.js /esspunkt60/index.js
COPY run.sh /esspunkt60/run.sh

RUN npm install && chmod +x /esspunkt60/run.sh && \
    mkdir -p /esspunkt60/public/upload/doc && \
    mkdir -p /esspunkt60/public/upload/images

CMD ["/esspunkt60/run.sh"]

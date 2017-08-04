#!/bin/sh

sed -i "s/_WEBSOCKETADDR_/$WEBSOCKETADDR/g" /esspunkt60/public/js/app.js
sed -i "s/_WEBSOCKETPORT_/$WEBSOCKETPORT/g" /esspunkt60/public/js/app.js

node /esspunkt60/index.js
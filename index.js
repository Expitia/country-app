var http = require( 'http');
var express = require( 'express');
var path = require( 'path');

const port = 3001;
const app = express();

app.use(express.json());
app.use(express.static("express"));
app.use('/', express.static("build"));
const server = http.createServer(app);
server.listen(port);
console.debug('Server listening on port ' + port);
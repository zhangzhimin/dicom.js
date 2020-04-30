//很多浏览不支持本地资源，故使用node将其提供出去

var http = require('http');
var express = require('express');
var path = require('path');
var serveIndex = require('serve-index');


var app = express();

app.use(serveIndex(__dirname));
app.use(express.static(__dirname));

http.createServer(app).listen(3000);

console.log('dicom.js demo is run at 3000 port')
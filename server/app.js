var express = require('express'),
    sys = require('sys'),
    path = require('path');
var app = express();

app.use(express.logger());
app.use(express.static( path.join(__dirname, 'web') ));
app.use(express.bodyParser());

app.get('/server', function (request, response) {
    console.log('GET /server');
});

app.listen(8000);
console.log('Express is listening on port 8000');
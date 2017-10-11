var express = require('express');
var apis = require('./routes/api');

var app = express();

app.set('port', 3333);

app.use('/', apis);

app.listen(app.get('port'), function() {
    console.log('Server started on http://localhost.com:' + app.get('port'));
});

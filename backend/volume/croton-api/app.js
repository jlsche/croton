const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const multer = require('multer');
const apis = require('./routes/api');

const app = express();


app.set('port', 3333);

// Body Parser Middleware
app.use(bodyParser.json({ type: '*/*' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }));
app.use(multer().any())

// Allow cross origin resource 
app.use(cors());
app.use('/', apis);

app.listen(app.get('port'), function() {
    console.log('Server started on http://localhost.com:' + app.get('port'));
});

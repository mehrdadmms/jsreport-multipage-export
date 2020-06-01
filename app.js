const { PORT } = require('./config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  limit: '50mb',
  extended: true
}));

app.use('/', require('./export'));


app.listen(PORT, ()=> {
    console.log(`server is running on localhost:${PORT}`)
});

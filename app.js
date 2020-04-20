const { PORT } = require('./config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use('/', require('./export'));


app.listen(PORT, ()=> {
    console.log(`server is running on localhost:${PORT}`)
});

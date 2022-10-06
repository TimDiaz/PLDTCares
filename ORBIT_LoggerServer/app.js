const express = require("express");
const bodyParser = require("body-parser");
const initLogger = require("./helpers/serverlogger");
const emailer = require("./routes/emailer");

var app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initLogger.configure();

emailer(app, initLogger);

app.listen(7746, function () {
    console.log("App running on port.", 7746);
});
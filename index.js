var express = require('express');
var app = express();

module.exports.zug = [
    "nächster Zug kommt in 10 Minuten"
];

app.get('/foehrich', function(req, res) {
    res.json({ foherich: module.exports.zug });
});

app.listen(3000);
var express = require('express');
var app = express();
var request = require('request-promise');

var options = {
    method: 'GET',
    uri: 'https://efa-api.asw.io/api/v1/station/5000154/departures/?format=json',
    json: true
};

app.get('/foehrich', function(req, res) {
    request(options)
        .then(function(response) {
            var vvsData = response;
            //res.json(vvsData.shift());
            res.json("nächster Zug kommt in 10 Minuten an. U6 nach Fasanenhof");
        })
        .catch(function(err) {
            res.json("Danger Will Robinson, Danger!");
        });
});





app.listen(process.env.PORT || 3000);
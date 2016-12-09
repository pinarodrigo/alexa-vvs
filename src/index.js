var express = require('express');
var app = express();
var request = require('request-promise');
var time = require('time');

var options = {
    method: 'GET',
    uri: 'https://efa-api.asw.io/api/v1/station/5000154/departures/?format=json',
    json: true
};

function calculateTimeToNextTrain(trainData) {
    var hour = trainData.departureTime.hour;
    var min = trainData.departureTime.minute;

    var comingTime = new time.Date(trainData.departureTime.year, trainData.departureTime.month - 1, trainData.departureTime.day, hour, min, 'Europe/Berlin');
    var now = new time.Date();
    now.setTimezone('Europe/Berlin');
    var timeDiff = comingTime.getTime() - now.getTime();

    var trainMinutes = Math.floor(timeDiff / 60000);
    var trainSeconds = ((timeDiff % 60000) / 1000).toFixed(0);

    var timeToNextTrain = { minutes: trainMinutes, seconds: trainSeconds };

    return timeToNextTrain;

}

function processTrainData(trainData) {

    var nextTrainTime = calculateTimeToNextTrain(trainData);

    outPut = 'Zug kommt in ' + nextTrainTime.minutes + ' Minute' + (nextTrainTime.minutes == 1 ? '' : 'n') + ' und ' + nextTrainTime.seconds + ' Sekunden. ' + trainData.number + ' nach ' + trainData.direction;

    return outPut;
}

function isTrainAlreadyGone(trainData) {
    var nextTrainTime = calculateTimeToNextTrain(trainData);
    var isGone = false;
    if (nextTrainTime.minutes <= 0) {
        isGone = true;
    }
    return isGone;
}

app.get('/foehrich', function(req, res) {
    request(options)
        .then(function(response) {
            var result = '';
            var vvsTrain = response.shift();
            if (isTrainAlreadyGone(vvsTrain)) {
                vvsTrain = response.shift();
            }
            var subsequentTrain = response.shift();
            result = processTrainData(vvsTrain);
            result += ', nächster ';
            result += processTrainData(subsequentTrain);
            res.json(result);
        })
        .catch(function(err) {
            res.json("Danger Will Robinson, Danger!");
        });
});





app.listen(process.env.PORT || 3000);
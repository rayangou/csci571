var createError = require('http-errors');
var express = require('express');
var path = require('path');
const request = require("request");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

/* ADD THE APP.JS CODE HERE */

// Super simple algorithm to find largest prime <= n
var calculatePrime = function(n){
  var prime = 1;
  for (var i = n; i > 1; i--) {
    var is_prime = true;
    for (var j = 2; j < i; j++) {
      if (i % j == 0) {
        is_prime = false;
        break;
      }
    }
    if (is_prime) {
      prime = i;
      break;
    }
  }
  return prime;
}

// Set up the GET route
app.get('/', function (req, res) {
  if(req.query.n) {
    // Calculate prime and render view
    var prime = calculatePrime(req.query.n);
    res.render('index', { n: req.query.n, prime: prime});
  }
  else {
    // Render view without prime
    res.render('index', {});
  }
});


/* END DIY CODE */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/getstateseal', (req, res) => {
    state = req.query["state"];
    url = 'https://www.googleapis.com/customsearch/v1?q=' + state + '%20State%20Seal&cx=016065621806241521131:a3cj5qp1rsm&imgSize=huge&imgType=news&num=1&searchType=image&key=AIzaSyAYVhtF-bEJCTQcGuay8p_QQ4pLNXFFWmM';

    request.get(url,
        (errorResponse, response, data) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Cache-Control", "no-cache");

            if (errorResponse) {
                res.status(404).send("Error while fetching images from google.");
                return null;
            }
            data = JSON.parse(data);

            if (!data ||
                data === null
            ) {
                res.status(404).send("Error while fetching images from google.");
                return null;
            }

            if (!data.hasOwnProperty("items") ||
                data.items.length <= 0
            ) {
                res.status(404).send("No Records.");
                return null;
            }

            let result = [];

            let items = data.items;
            for (let i = 0; i < items.length; i++) {
                let item = items[i];

                if (item.hasOwnProperty("link") && item.link.length > 0) {
                    result.push(item.link);
                }
            }

            res.send(result);
        });
});

module.exports = app;

console.log(`App listening on port ${process.env.PORT}!`)
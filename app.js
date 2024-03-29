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

app.get('/getstateseal', function (req, res) {
  res.json("hello world");
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


module.exports = app;

console.log(`App listening on port ${process.env.PORT}!`)
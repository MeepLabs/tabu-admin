var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var accounts = require('./routes/accounts');
var payments = require('./routes/tab-payments');
var venues = require('./routes/venues');
var authenticate = require('./routes/authenticate');

var handlebars = require('express-handlebars');
var hbs = require('hbs');
var fs = require('fs');
var debug = require('debug');
var router = express.Router();

// Add the configuration file.
var config = require('./conf/serverConf');
var app = express();

var middleware = require('./middleware')

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

//hbs.registerPartials(__'/partials/admin/**/*.hbs');

hbs.registerPartial('admin-assets-css-development', fs.readFileSync(__dirname + '/src/partials/admin/assets/admin-assets-css-development.hbs', 'utf8'));
hbs.registerPartial('admin-assets-js-development', fs.readFileSync(__dirname + '/src/partials/admin/assets/admin-assets-js-development.hbs', 'utf8'));
hbs.registerPartial('admin-head', fs.readFileSync(__dirname + '/src/partials/admin/admin-head.hbs', 'utf8'));
hbs.registerPartial('slidebars', fs.readFileSync(__dirname + '/src/partials/admin/slidebars.hbs', 'utf8'));
hbs.registerPartial('main-elements', fs.readFileSync(__dirname + '/src/partials/admin/main-elements.hbs', 'utf8'));
hbs.registerPartial('tab-payment-elements', fs.readFileSync(__dirname + '/src/partials/admin/tab-payment-elements.hbs', 'utf8'));
hbs.registerPartial('header', fs.readFileSync(__dirname + '/src/partials/admin/header.hbs', 'utf8'));
hbs.registerPartial('sidebar', fs.readFileSync(__dirname + '/src/partials/admin/sidebar.hbs', 'utf8'));
hbs.registerPartial('admin-navigation', fs.readFileSync(__dirname + '/src/partials/admin/admin-navigation.hbs', 'utf8'));

app.engine('handlebars', handlebars({
    extname: 'hbs',
    defaultLayout: 'admin-layout',
    layoutDir: __dirname + '/src/layouts'
}));

// view engine setup
app.set('views', path.join(__dirname, 'src/layouts'));
app.set('view engine', 'handlebars');

app.use(middleware.httpsRedirect);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {maxAge: config.ASSETS_MAX_AGE}));
app.use("/assets", express.static(path.join(__dirname, 'assets'), {maxAge: config.ASSETS_MAX_AGE}));


// API to verify the PIN entered by the user. On successful verification it will set the pin in the cookie.
// For subsequent requests based on this cookie we can authenticate the requests.
app.post('/api/verifyPin/', function (req, res, next) {
  var pin = req.body.pin;
  if (pin == config.SECRET_PIN) {
    res.cookie(config.COOKIE_NAME, config.SECRET_PIN, {
      maxAge: config.COOKIE_AGE
    });
    res.status(200).json(JSON.stringify({isVerified: true}));
  } else {
    res.status(401).json(JSON.stringify({isVerified: false}));
  }
  return;
});

app.use('/authenticate', authenticate);

// If user is not authenticated then redirect him to authentication page.Placemnet of this middleware is important.
// It needs to be below /authenticate route and above other routes
app.use(function (req, res, next) {
    var _pin = req.cookies[config.COOKIE_NAME];
    if (_pin == config.SECRET_PIN) {
      next();
    } else {
      res.redirect('/authenticate', 302);
    }
});

app.use('/', routes);
app.use('/accounts', accounts);
app.use('/payments', payments);
app.use('/venues', venues);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.hbs', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error.hbs', {
    message: err.message,
    error: {}
  });
});

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = app.listen(app.get('port'), function() {
//http.createServer(app).listen(app.get('port'), function(){
//	console.log('Express server listening on port ' + app.get('port'));

  debug('Express server listening on port ' + server.address().port);
});


module.exports = app;

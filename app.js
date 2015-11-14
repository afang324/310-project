///<reference path='types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='types/DefinitelyTyped/express/express.d.ts'/>
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest1');
var routes = require('./routes/index');
var users = require('./routes/users');
var parkings = require('./routes/parkings');
var stormpath = require('express-stormpath');
var app = express();
var Application = (function () {
    function Application() {
        // view engine setup
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'jade');
        // uncomment after placing your favicon in /public
        //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
        var stormpathMiddleware = stormpath.init(app, {
        apiKeyFile: './apiKey.properties',
        application: 'https://api.stormpath.com/v1/applications/10aePtwxkNLEStuvH4ErsY',
        secretKey: 'asdfghjklzxcvbnm',
        expandCustomData: true,
        enableForgotPassword: true
        });
        app.use(stormpathMiddleware);

        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'public')));
        // Make our db accessible to our router
        app.use(function (req, res, next) {
            req.db = db;
            next();
        });
        app.use('/', routes);
        app.use('/users', users);
        app.use('/parkings', parkings);
        app.use('/profile',stormpath.loginRequired,require('./profile')());
        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
        // error handlers
        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development') {
            app.use(function (err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }
        // production error handler
        // no stacktraces leaked to user
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
        module.exports = app;
        console.log('new Application is created');
    }
    return Application;
})();
var app = new Application();

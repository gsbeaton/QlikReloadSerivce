/*
| -------------------------------------------------------------------
|  Node service to write a txt file for a Qlik reload
| -------------------------------------------------------------------
|  This is a simple service that listens for a get request to 
|  http://domain.tld/api/s/{}
|
*/




/*
| -------------------------------------------------------------------
|  USER CONFIGURABLE VARIABLES
| -------------------------------------------------------------------
|  
|
*/

var settings      = {filePath    : '/tmp/'
                    ,templateFile: 'test1.txt'
                    ,port        :  8080};


/*
| -------------------------------------------------------------------
|  BASE SETUP
| -------------------------------------------------------------------
|  Set up listening service, create routes, import the packages we
|  need.
|
*/
  var express        = require('express');
  var app            = express();
  var bodyParser     = require('body-parser');
  var setControlFile = require('./app/models/fss');

/*
| -------------------------------------------------------------------
|  CONFIGURE BODYPARSER
| -------------------------------------------------------------------
|  Configure the application to user bodyparser, which will make
|  it easier to read/write response/request values.
|
*/
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  var port = process.env.PORT || settings.port;        // set our port


/*
| -------------------------------------------------------------------
|  CONFIGURE API LOGIC
| -------------------------------------------------------------------
|  The logic for the api routes.
|
*/
  var router   = express.Router();              // get an instance of the express Router


// middleware to use for all requests
    router.use(function(req, res, next) {
        // TODO - do some logging here.
        next();
    });

/*
| -------------------------------------------------------------------
|  SET FILE FOR RELOAD
| -------------------------------------------------------------------
|  Update the file with a new timestamp and set the reload flag to 1.
|
*/
    router.get('/s/:sLog', function(req, res) {
      
      settings.controlFile = req.params['sLog'];// add the name of the status file to the settings object.

      setControlFile.update(settings, function(rd){
        res.json(rd); // write the response out as a json object.
      });
        
    });

/*
| -------------------------------------------------------------------
|  REGISTER ROUTES
| -------------------------------------------------------------------
|  All routes are prefixed with /api
|
*/
  app.use('/api', router);

/*
| -------------------------------------------------------------------
|  START THE SERVER
| -------------------------------------------------------------------
|  And away we go...
|
*/
  app.listen(port);
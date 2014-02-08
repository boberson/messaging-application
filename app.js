
/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  https = require('https'),
  db = require('./model/messaging'),
  fs = require('fs'),
  path = require('path');

var app = module.exports = express();

/**
* Configuration
*/

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.cookieParser());
app.use(express.session({secret: '1qaz@WSX3edc$RFV5tgb^YHN'}));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
   app.use(express.errorHandler());
};

// production only
if (app.get('env') === 'production') {
  // TODO
}; 



// Routes
app.get('/', routes.index);
app.get('/partial/:name', routes.partial);

// JSON API

//Host API
app.get('/api/hosts', api.getHosts);
app.delete('/api/host/:id', api.deleteHost);
app.put('/api/host', api.updateHost);
app.post('/api/host', api.createHost);

// Message API
app.get('/api/messages', api.getMessages);
//app.get('/api/message/:id', api.getMessage);
app.delete('/api/message/:id', api.deleteMessage);
app.put('/api/message', api.updateMessage);
app.post('/api/message', api.createMessage);

// VarSet API
app.get('/api/varsets', api.getVarSets);
app.delete('/api/varset/:id', api.deleteVarSet);
app.put('/api/varset', api.updateVarSet);
app.post('/api/varset', api.createVarSet);
  
//Metadata API
app.get('/api/meta/tags', api.getAllTags);
app.get('/api/meta/ris', api.getAllRIs);
app.get('/api/meta/plas', api.getAllPLAs);

//Process API
app.get('/api/processes', api.getProcesses);
app.post('/api/processes/kill/:pid', api.killProcess);

//Generate API
app.post('/api/submit', api.submitMsgs);


// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

/**
* Start Server
*/
/*
 * SSL Setup
 */
/*
var options = {
    key:    fs.readFileSync('ssl/turing_localhost.key'),
    cert:   fs.readFileSync('ssl/turing_localhost.crt'),
    ca:     fs.readFileSync('ssl/root-ca.crt'),
    requestCert:        true,
    rejectUnauthorized: true  
};
https.createServer(options, app).listen(443, function () {
  console.log('Express SSL server listening on port ' + "443");
});*/

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
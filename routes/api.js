/*
 * Serve JSON to our AngularJS client
 */
var messaging = require("../model/messaging");
var Message = messaging.model.Message;
var Host = messaging.model.Host;
var url = require('url');

var validateMessage = function(message, newMsg) {
  //validates message fields. Returns true if message is good else false
  return true;  
};

exports.name = function (req, res) {
  res.json({
  	name: 'Bob'
  });
};

exports.getHosts = function (req, res) {  
  Host.find(function(error, results){
    if(error) {
      console.log("error querying db: " + error);
    }
    res.json(results);
  });
};

exports.getMessages = function (req, res) {  
  Message.find(function(error, results){
    if(error) {
      console.log("error querying db: " + error);
    }
    res.json(results);
  });
};

exports.getMessage = function(req,res) {
  var id = req.params.id;  
  Message.find({ _id: id },function(error, results){
    if(error) {
      console.log("error querying db: " + error);
    }
    res.json(results);
  });
};

exports.updateMessage = function(req,res) {
  //should do some validation here of message here later.
  var message = {};
  var id = req.body._id;
  message.text = req.body.text;
  message.tags = req.body.tags;
  message.name = req.body.name;  
  Message.findOneAndUpdate({ _id: id }, message, { upsert: true }, function(msg){
    console.log("Updated: " + msg);
  });
  res.json({status: "success"});
  
};

exports.deleteMessage = function(req,res) {
  var id = req.params.id;
  Message.findByIdAndRemove(id, function(err, rst) {
    if(err) {
      console.log("Error: "+err);
    };
  });
  
};

exports.createMessage = function(req,res) {
  //should do validation of message here later.
  var message = {};
  message.text = req.body.text;
  message.tags = req.body.tags;
  message.name = req.body.name;  
  Message.create(message, function(err, msg) {
    if(err) {
      console.log("Creation Error: " + err);
      res.json({status: "success"});
    } else {
      console.log("Created Message: " + msg);
    };
  });
    
};
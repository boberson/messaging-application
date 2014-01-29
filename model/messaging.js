/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var http = require('http');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
exports.model = {};


var uristring = 'mongodb://localhost/messaging';

var db = mongoose.connect(uristring, function (err, res) {
  if(err) {
    console.log("Error connecting to database: " + uristring + err);
  } else {
    console.log("Connected to database: " + uristring);
  };
});

exports.model.hostSchema = new Schema({
  name: String,
  email: String,
  alias: String
});

exports.model.messageSchema = new Schema({
  name: String,
  text: String,
  tags: [String],
  created: { type: Date, default: Date.now } 
});

exports.model.Message = mongoose.model('Message', exports.model.messageSchema);

exports.model.Host = mongoose.model('Host', exports.model.hostSchema);





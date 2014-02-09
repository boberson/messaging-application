/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validators = require('./Validators').validators;
exports.model = {};


var uristring = 'mongodb://localhost/MessageDatabase';

var db = mongoose.connect(uristring, function (err, res) {
  if(err) {
    console.log("Error connecting to database: " + uristring + err);
  } else {
    console.log("Connected to database: " + uristring);
  };
});

var schemas = {};
var validateEmail = [validators.email, "Must be a valid email address."];
schemas.hostSchema = new Schema({
  name: { type: String, require: "Hostname is required" },
  email: {type: String, required: "Email address is required", validate: validateEmail},
  alias: {type: String, required: "Name of Host entry required" }
});

var validateName = [ validators.alphanum, "Name must be alpha numeric."];
schemas.messageSchema = new Schema({
  name: { 
    type: String, 
    required: "Name is required", 
    validate: validateName
  },
  description: { type: String },
  text: { type: String, required: "Message text is required" },
  tags: [String],
  created: { type: Date, default: Date.now },
  updated: { type: Date }
});

schemas.varSetSchema = new Schema({
  name: String,
  osri: String,
  dri: [String],
  from: String,
  action: [String],
  info: [String],
  dtg: { type: Date }
});

exports.model.VarSet = mongoose.model('VarSet', schemas.varSetSchema);

exports.model.Message = mongoose.model('Message', schemas.messageSchema);

exports.model.Host = mongoose.model('Host', schemas.hostSchema);





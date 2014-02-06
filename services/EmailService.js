/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var email = require('../node_modules/emailjs/email');
var EventEmitter = require('events').EventEmitter;
/**
 * host = smtp host
 * message = from, to, text
 */
Emailer = function() {
  EventEmitter.call(this);
  this.continue = true;
  
};
Email.prototype = Object.create(EventEmitter.prototype);

Email.prototype.on('kill', function(){
  this.continue = false;
});

Emailer.prototype.on('emailSent', function())


var SmtpManager = function() {
  var pid = 0;
  this.process = [];
  this.createNewEmailer = function(host, to, from, messages) {
    pid += 1;
    var m = new Emailer(host, to, from, messages)
    this.process[pid] = {
      mailer: m,
      total: messages.length,
      complete: 0,
      host: host,
      messages: messages
    };    
  }
}


// Email  an array of messages to a host.
exports.emailMessages = function(host, addressee, addresser, messages, delayInMillis) {
  var connection = email.server.connect({ host: host });
  var delay,
  message = {};
  message.from = addresser;
  message.to = addressee;
  this.processes = [];
  this.numMessages = messages.length;
  this.numComplete = 0;
  
  function sendMessage(msg) {
    connection.send(msg,function(err,rst){
      this.numComplete += 1;
      if(err) {
        console.log("Error: " + err);
      } else {
        console.log("Success: " + rst);
      };
    });    
  }
  
  this.sendMessages = function(msgs) {
    m = msgs.pop()
    if(m) {
      tv = setTimeout(function(){
        message.text = m;
        sendMessage(message);
        sendMessages(msgs);
      }, delayInMillis);
      this.processes.push(tv);
    } 
  }
  sendMessages(messages)
}



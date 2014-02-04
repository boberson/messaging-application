/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var email = require('../node_modules/emailjs/email');

// Email  an array of messages to a host.
exports.emailMessages = function(host, addressee, addresser, messages, delayInMillis) {
  var connection = email.server.connect({ host: host });
  var delay,
  message = {};
  message.from = addresser;
  message.to = addressee;
  var processes = [];
  
  function sendMessage(msg) {
    connection.send(msg,function(err,rst){
      if(err) {
        console.log("Error: " + err);
      } else {
        console.log("Success: " + rst);
      };
    });
    
  }
  function sendMessages(msgs) {
    m = msgs.pop()
    if(m) {
      tv = setTimeout(function(){
        message.text = m;
        sendMessage(message);
        sendMessages(msgs);
      }, delayInMillis);
      processes.push(tv);
    } 
  }
  sendMessages(messages)
  console.log("AFTER SEND MESSAGES");
}



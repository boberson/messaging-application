/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var email = require('../node_modules/emailjs/email');
var uuid = require('../node_modules/node-uuid/uuid');
var EventEmitter = require('events').EventEmitter;

var Emailer = function() {
  EventEmitter.call(this);
  //Map all of the messages into message objects ready to send from emailjs.
  this.procs = new Array();
  this.intervals = {};
  this.getActiveProcesses = function() {
    return this.procs.filter(function(e, i, arr) {
      return e.active;
    });
  };
  this.getProcess = function(pid) {
    var process = this.procs.filter(function(e, i, arr) {
      return e.pid === pid;
    });
    if (process.length > 0) {
      return process[0];
    } else {
      return false;
    }
    ;
  };
  this.kill = function(pid) {
    var proc = this.getProcess(pid);
    if (proc) {
      proc.active = false;
      clearInterval(this.intervals[pid]);
      this.procs.splice(this.procs.indexOf(proc), 1);
      this.emit('updated');
    }
    ;
  };
  this.updateMessageSent = function(pid) {
    var proc = this.getProcess(pid);
    if (proc) {
      proc.completed += 1;
      this.emit('updated');
    };
  };
};
Emailer.prototype = Object.create(EventEmitter.prototype);

Emailer.createNew = function(host, emails, interval, em) {
  var smtpTimeout = 3000;
  var server = email.server.connect({ host: host, timeout: smtpTimeout });
  function sendMessage() {
    msg = emails.pop();
    if (msg) {
      server.send(msg, function(err, rst) {
        em.emit('updateSent', pid);
        if (err) {
          console.log("Error: " + err);
        }
        ;
      });
    } else {
      em.emit('kill', pid);
    }
    ;
  }
  ;
  if (emails.length > 0) {
    var pid = uuid.v1();
    var intervalId = setInterval(sendMessage.bind(host, emails, pid), interval);
    em.intervals[pid] = intervalId;
    var process = {};
    process.pid = pid;
    process.completed = 0;
    process.total = emails.length;
    process.to = emails[0].to;
    process.host = host;
    process.active = true;
    em.procs.push(process);
    return em;
  } else {
    console.log("Error no emails to send");
    return false;
  };
};

Emailer.prototype.on('updateSent', function(pid) {
  this.updateMessageSent(pid);
});
Emailer.prototype.on('kill', function(pid) {
  this.kill(pid);
});



exports.EmailerManager = Emailer;



/* 
 * Copyright (c) 2014, rober_000
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
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
      this.emit('updated', "Process sending To:\n"+proc.to+" finished or was killed");
    }
    ;
  };
  this.updateMessageSent = function(pid) {
    var proc = this.getProcess(pid);
    if (proc) {
      proc.completed += 1;
      this.emit('updated', "Sent Message To:\n"+proc.to);
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



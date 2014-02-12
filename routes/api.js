/*
 * Serve JSON to our AngularJS client
 */
var Database = require("../model/Database");
var Message = Database.model.Message;
var Host = Database.model.Host;
var VarSet = Database.model.VarSet;
var url = require('url');
var fs = require('fs');
var EasyZip = require('easy-zip').EasyZip;
var EmailService = require("../services/EmailService");
var EmailerManager = EmailService.EmailerManager;
var em = new EmailerManager();


var validateMessage = function(message, newMsg) {
  //validates message fields. Returns true if message is good else false
  return true;  
};
// helper to send json and mitigate json vuln
var sendJson = function(code, json, response) {
  data = ")]}',\n" + JSON.stringify(json);
  response.writeHead(code, {'Content-Type': 'text/plain' });
  response.end(data);
};

/*
 * Host API
 */
exports.getHosts = function (req, res) {  
  Host.find(function(error, results){
    if(error) {
      console.log("error querying db: " + error);
    }
    //res.json(results);
    sendJson(200, results, res);
  });
};

exports.createHost = function(req, res) {
  var host = {};
  host.alias = req.body.alias;
  host.name = req.body.name;
  host.email = req.body.email; 
  Host.create(host, function(err, msg) {
    if(err) {
      //console.log("Creation Error: " + err);
        res.jsonp(404,{status: err});
    } else {
      //console.log("Created Host: " + msg);
      res.jsonp(200, {status: "success"});
    };
  });
  
  
};

exports.updateHost = function(req, res) {
  var host = {};
  var id = req.body._id;
  host.alias = req.body.alias;
  host.name = req.body.name;
  host.email = req.body.email;
    Host.findOneAndUpdate({ _id: id }, host, { upsert: true }, function(err, msg) {
      if(err) {
        //console.log("Creation Error: " + err);
        res.jsonp(404,{status: err});
      } else {
        //console.log("Updated Host: " + msg);
        res.jsonp(200,{status: "success"});
      }
  });
};

exports.deleteHost = function(req, res) {
  var id = req.params.id;
  Host.findByIdAndRemove(id, function(err, msg) {
    if(err) {
      //console.log("Deletion Error: " + err);
        res.jsonp(404,{status: err});
    } else {
      //console.log("Deleted Host: " + msg);
      res.jsonp(200,{status: "success"});
    };
  });
};

/*
 * Message API
 */

exports.getMessages = function (req, res) {  
  Message.find(function(error, results){
    if(error) {
      console.log("error querying db: " + error);
    }
    //res.json(results);
    sendJson(200, results, res);
  });
};

/*exports.getMessage = function(req,res) {
  var id = req.params.id;  
  Message.find({ _id: id },function(error, results){
    if(error) {
      console.log("error querying db: " + error);
    }
    res.json(results);
  });
};*/

exports.createMessage = function(req,res) {
  //should do validation of message here later.
  var message = {};
  message.text = req.body.text;
  message.tags = req.body.tags;
  message.name = req.body.name;
  if(req.body.description) {
    message.description = req.body.description;
  } else {
    message.description = "";
  };  
  Message.create(message, function(err, msg) {
    if(err) {
      //console.log("Creation Error: " + err);
        res.jsonp(404,{status: err});
    } else {
      //console.log("Created Message: " + msg);
      res.jsonp(200,{status: "success"});
    };
  });    
};

exports.updateMessage = function(req,res) {
  //should do some validation here of message here later.
  var message = {};
  var id = req.body._id;
  message.text = req.body.text;
  message.tags = req.body.tags;
  message.name = req.body.name;
  if(req.body.description) {
    message.description = req.body.description;
  } else {
    message.description = "";
  };  
  Message.findOneAndUpdate({ _id: id }, message, { upsert: true }, function(err, msg) {
    if(err) {
      //console.log("Creation Error: " + err);
        res.jsonp(404,{status: err});
    } else {
      //console.log("Updated Message: " + msg);
      res.jsonp(200,{status: "success"});
    };
  });  
};

exports.deleteMessage = function(req,res) {
  var id = req.params.id;
  Message.findByIdAndRemove(id, function(err, msg) {
    if(err) {
        //console.log("Deletion Error: " + err);
        res.jsonp(404,{status: err});
    } else {
      //console.log("Deleted Message: " + msg);
      res.jsonp(200,{status: "success"});
    };
  });
  
};

/*
 * VarSet API
 */

exports.getVarSets = function (req, res) {  
  VarSet.find(function(error, results){
    if(error) {
      console.log("error querying db: " + error);
    }
    //res.json(results);
    sendJson(200, results, res);
  });
};
/* Need to change the attributes from what a host was to what a varset is */
 
exports.createVarSet = function(req, res) {
  var varset = {};
  varset.name = req.body.name;
  varset.osri = req.body.osri;
  varset.dri = req.body.dri;
  varset.dtg = req.body.dtg;
  varset.from = req.body.from;
  varset.action = req.body.action;
  varset.info = req.body.info;
  VarSet.create(varset, function(err, msg) {
    if(err) {
      //console.log("Creation Error: " + err);
      res.jsonp(404, {status: err});
    } else {
      //console.log("Created VarSet: " + msg);
      res.jsonp(200, {status: "success"});
    };
  }); 
};

exports.updateVarSet = function(req, res) {
  var varset = {};
  var id = req.body._id;
  varset.name = req.body.name;
  varset.osri = req.body.osri;
  varset.dri = req.body.dri;
  varset.dtg = req.body.dtg;
  varset.from = req.body.from;
  varset.action = req.body.action;
  varset.info = req.body.info;
  VarSet.findOneAndUpdate({ _id: id }, varset, { upsert: true }, function(err, msg) {
    if(err) {
      //console.log("Creation Error: " + err);
      res.jsonp(404, {status: err});
    } else {
      //console.log("Created VarSet: " + msg);
      res.jsonp(200, {status: "success"});
    };
  }); 
};

exports.deleteVarSet = function(req, res) {
  var id = req.params.id;
  VarSet.findByIdAndRemove(id, function(err, msg) {
    if(err) {
      //console.log("Deletion Error: " + err);
      res.jsonp(404,{status: err});
    } else {
      //console.log("Deleted VarSet: " + msg);
      res.jsonp(200,{status: "success"});
    };
  });
}; 
 

/*
 * Metadata API
 */

exports.getAllTags = function (req, res) {
  var mr = {};
  mr.map = function() { 
    this.tags.forEach(function(element, index, array){
      emit(element, 1);
    });
  };
  mr.reduce = function(key, values) {
    return values.length;
  };
  Message.mapReduce(mr, function(err, result) {
      if(err) {
        res.jsonp(404, {"error": err});
      } else {
        //res.json(result);
        sendJson(200, result, res);
      };
  });
};

exports.getAllPLAs = function(req, res) {
  var mr = {};
  mr.map = function() {
    emit(this.from, 1);
    this.action.forEach(function(element, index, array){
      emit(element, 1);
    });
    this.info.forEach(function(element, index, array){
      emit(element, 1);
    });
  };
  mr.reduce = function(key, values) {
    return values.length;
  };
  VarSet.mapReduce(mr, function(err, result) {
      if(err) {
        res.jsonp(404, {"error": err});
      } else {
        //res.json(result);
        sendJson(200, result, res);
      };
  });
};

exports.getAllRIs = function(req, res) {
  var mr = {};
  mr.map = function() {
    emit(this.osri, 1);
    this.dri.forEach(function(element, index, array){
      emit(element, 1);
    });
  };
  mr.reduce = function(key, values) {
    return values.length;
  };
  VarSet.mapReduce(mr, function(err, result) {
      if(err) {
        res.jsonp(404, {"error": err});
      } else {
        //res.json(result);
        sendJson(200, result, res);
      };
  });
};

/*
 * Generate API
 */

function rmrf(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
function uploadMessages(messages) {
  var downloaddir = "./tmp/";
  var tmpmsgdir = __dirname + "/../tmp/messages/";
  var zipfilename = 'messages.zip';
  var zipfname = __dirname + "/../tmp/" + zipfilename;
  var fname, msg;
  rmrf(tmpmsgdir);
  fs.mkdirSync(tmpmsgdir);
  for (var i in messages) {
    fname = messages[i].name + ".txt";
    msg = messages[i].message;
    fs.writeFileSync(tmpmsgdir+fname, msg);
  };    
  
  var zip = new EasyZip();
  zip.zipFolder(tmpmsgdir,function(){
    zip.writeToFile(zipfname);    
  });
  return zipfilename;  
}

function processMessages(msgTmpls, varset) {
  function pad(num, spcs) {
    var s = num+"";
    while (s.length < spcs) s = "0" + s;
    return s;
  };
  function getDoY(date) {
    var millisInDay = 86400000;
    var firstOfYear = new Date(date.getFullYear(), 0, 1); 
    return Math.round(((date - firstOfYear) / millisInDay) + .5, 0);
  };
  function getDTG(date) {
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return pad(date.getDate(),2) + pad(date.getHours(),2) + pad(date.getMinutes(),2) + "Z " + months[date.getMonth()] + " " + date.getFullYear().toString().slice(2); ;
  };
  function getParams(varset) {
    var params = {};
    params.osri = varset.osri;
    params.dri = varset.dri.join(" ");
    params.fl6 = "FM " + varset.from;
    params.fl7 = "TO " + varset.action.join("\r\n");
    params.fl8 = "INFO " + varset.info.join("\r\n");
    return params;  
  };
  function incrDateByOneMinute(datev){
    var millisInMinute = 60000;
    var newtime = datev.getTime() + millisInMinute;
    return new Date(newtime);
  };
  
  var params = getParams(varset);
  var messages = new Array();
  var message;
  var date = new Date(varset.dtg);
  for(var i in msgTmpls) {
    message = msgTmpls[i].text;
    for(var j in params) {
      re = "{"+ j.toUpperCase() +"}";
      message = message.replace(re, params[j], 'i');
    }
    dtg = getDTG(date);
    jul = pad(getDoY(date),3);
    message = message.replace("{DTG}",dtg,i);
    message = message.replace("{JUL}",jul,i);
    date = incrDateByOneMinute(date);
    msgObj = { name: msgTmpls[i].name, message: message };
    messages.push(msgObj);
  }
  return messages;
};

function createEmails(to, from, messages) {
  return messages.map(function(msgText) {
    var msg = {};
    msg.to = to;
    msg.from = from;
    msg.text = msgText.message;
    return msg;
  });
}

// post /api/submit/email
exports.submitEmail = function (req, res) {
  var data = {};
  data.messageTemplates = req.body.messages;
  data.varset = req.body.varset;
  var messages = processMessages(data.messageTemplates, data.varset);
  data.timeout = req.body.timeout * 1000;
  data.hosts = req.body.hosts;  
  for( var idx in data.hosts) {
    var emails = createEmails(data.hosts[idx].email, "msgdb@msg.lab", messages);
    EmailerManager.createNew(data.hosts[idx].name, emails, data.timeout, em);
  }
  res.jsonp(200, {"status": "success"});
};

// get /api/submit/download
exports.submitDownload = function(req,  res) {
  var data = {};
  data.messageTemplates = req.body.messages;
  data.varset = req.body.varset;
  var messages = processMessages(data.messageTemplates, data.varset);
  var fn = uploadMessages(messages);
  res.jsonp(200, {status: "success", filename : fn});
}; 


// get /api/processes
exports.getProcesses = function(req, res) {
  var result = em.getActiveProcesses();
  //res.jsonp(200, result);
  sendJson(200, result, res);
};

// post /api/processes/kill/:id
exports.killProcess = function(req, res) {
  var pid = req.params.pid;
  em.emit('kill', pid);
};

// get /api/download/:filename to download a messages.zip
exports.download = function(req, res) {
  var downloaddir = "./tmp/";
  var filename = req.params.filename;  
  res.download(downloaddir + filename);
};

//Listen to this page for getting the email processes status using server side events.
var openConnections = new Array();
exports.procStats = function(req, res) {
  //set timeout as long as possible.
  req.socket.setTimeout(Infinity);
  var headers = {
    'Content-Type': 'text/event-stream'
  };
  res.writeHead(200, headers);
  res.write('\n');
  
  //push this repsonse object to the openconnections array.
  openConnections.push(res);
  
  req.on('close', function() {
    var toRemove;
    for(var j = 0; j < openConnections.length; j++) {
      if(openConnections[j] == res) {
        toRemove = j;
        break;
      };
    };
    openConnections.splice(j,1);
  });  
};

var ua = function() {
  var result = em.getActiveProcesses();
  openConnections.forEach(function(response){
    response.write("data: "+JSON.stringify(result)+"\n\n");
  });
}
em.on('updated', ua);


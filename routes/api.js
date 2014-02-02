/*
 * Serve JSON to our AngularJS client
 */
var messaging = require("../model/messaging");
var Message = messaging.model.Message;
var Host = messaging.model.Host;
var VarSet = messaging.model.VarSet;
var url = require('url');

var validateMessage = function(message, newMsg) {
  //validates message fields. Returns true if message is good else false
  return true;  
};

/*
 * Host API
 */
exports.getHosts = function (req, res) {  
  Host.find(function(error, results){
    if(error) {
      console.log("error querying db: " + error);
    }
    res.json(results);
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
      res.jsonp(500, {status: err});
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
        res.jsonp(500,{status: err});
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
      res.jsonp(500,{status: err});
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

exports.createMessage = function(req,res) {
  //should do validation of message here later.
  var message = {};
  message.text = req.body.text;
  message.tags = req.body.tags;
  message.name = req.body.name;  
  Message.create(message, function(err, msg) {
    if(err) {
      //console.log("Creation Error: " + err);
      res.jsonp(500,{status: err});
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
  Message.findOneAndUpdate({ _id: id }, message, { upsert: true }, function(err, msg) {
    if(err) {
      //console.log("Creation Error: " + err);
      res.jsonp(500,{status: err});
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
      res.jsonp(500,{status: err});
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
    res.json(results);
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
      res.jsonp(500, {status: err});
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
      res.jsonp(500, {status: err});
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
      res.jsonp(500,{status: err});
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
        res.jsonp(500, {"error": err});
      } else {
        res.json(result);
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
        res.jsonp(500, {"error": err});
      } else {
        res.json(result);
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
        res.jsonp(500, {"error": err});
      } else {
        res.json(result);
      };
  });
};

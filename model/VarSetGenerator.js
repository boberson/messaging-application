/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var messaging = require('./messaging');
var VarSet = messaging.model.VarSet;

var varset = {};
varset.name = "DEFAULT ONE";
varset.osri = "RULYNVR";
varset.from = "USS NEVERSAIL";
varset.dri = ["RULYONE", "RULYTWO"];
varset.action = ["USS NEVERSAIL ONE", "USS NEVERSAIL TWO"];
varset.info = ["USS NEVERSAIL THREE"];

v1 = new VarSet(varset);
v1.save(function(err, rst) {});

varset.name = "DEFAULT TWO";
varset.from = "USS NEVERSAIL FIVE";
varset.info = ["USS NEVERSAIL SIX", "ALLNAV", "BTLCOM THREE"];
v2 = new VarSet(varset);
v2.save(function(err, rst) {});
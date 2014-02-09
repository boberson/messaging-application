/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Database = require('./Database');
var Host = Database.model.Host;

var host1 = {};
host1.alias = "USS TEST1";
host1.name = "1.1.1.1";
host1.email = "test@test1.com";

var host2 = {};
host2.alias = "USS TEST2";
host2.name = "2.2.2.2";
host2.email = "test@test2.com";

var host3 = {};
host3.alias = "USS TEST3";
host3.name = "3.3.3.3";
host3.email = "test@test3.com";

var host4 = {};
host4.alias = "USS TEST4";
host4.name = "4.4.4.4";
host4.email = "test@test4.com";

var host5 = {};
host5.alias = "USS TEST5";
host5.name = "5.5.5.5";
host5.email = "test@test5.com";

var host6 = {};
host6.alias = "USS TEST6";
host6.name = "6.6.6.6";
host6.email = "test@test6.com";

var host7 = {};
host7.alias = "USS TEST7";
host7.name = "7.7.7.7";
host7.email = "test@test7.com";

h1 = new Host(host1);
h1.save(function(err, rst) {
  if(err) {
    console.log("Error saving object to database: " + err);
  }
});

h2 = new Host(host2);
h2.save(function(err, rst) {
  if(err) {
    console.log("Error saving object to database: " + err);
  }
});

h3 = new Host(host3);
h3.save(function(err, rst) {
  if(err) {
    console.log("Error saving object to database: " + err);
  }
});

h4 = new Host(host4);
h4.save(function(err, rst) {
  if(err) {
    console.log("Error saving object to database: " + err);
  }
});

h5 = new Host(host5);
h5.save(function(err, rst) {
  if(err) {
    console.log("Error saving object to database: " + err);
  }
});

h6 = new Host(host6);
h6.save(function(err, rst) {
  if(err) {
    console.log("Error saving object to database: " + err);
  }
});

h7 = new Host(host7);
h7.save(function(err, rst) {
  if(err) {
    console.log("Error saving object to database: " + err);
  }
});

'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('myApp.services', []);
services.factory('Message', function() {
   var msg = {};
   msg.message = {};
   return msg;
});

services.factory('MessageService',['$http', function($http) {
  var messageService = {};
  var allMessagesUrl = '/api/messages';
  var messageUrl = '/api/message';
  
  
  messageService.getMessages = function() {
    return $http.get(allMessagesUrl);
  };
  
  messageService.updateMessage = function(message) {
    return $http.put(messageUrl, JSON.stringify(message));
  };
  
  messageService.createMessage = function(message) {
    return $http.post(messageUrl, JSON.stringify(message));
  };
  
  messageService.deleteMessage = function(id) {
    if(id !== 'undefined') {
      console.log(messageUrl+"/"+id);
      return $http.delete(messageUrl+"/"+id);
    };    
  };
  
  messageService.status = "";
  
  return messageService;
}]);

services.factory('HostService',['$http', function($http) {
  var hostService = {};
  var allHostsUrl = '/api/hosts';
  var hostUrl = '/api/host';
  
  
  hostService.getHosts = function() {
    return $http.get(allHostsUrl);
  };
  
  hostService.updateHost = function(host) {
    return $http.put(hostUrl, JSON.stringify(host));
  };
  
  hostService.createHost = function(host) {
    return $http.post(hostUrl, JSON.stringify(host));
  };
  
  hostService.deleteHost = function(id) {
    if(id !== 'undefined') {
      console.log(hostUrl+"/"+id);
      return $http.delete(hostUrl+"/"+id);
    };    
  };
  
  return hostService;
}]);

services.factory('VarService',['$http', function($http) {
  var varService = {};
  var varSvcUrl = '/api/varset';
  var varSetsUrl = '/api/varsets';
  
  varService.getVarSets = function() {
    return $http.get(varSetsUrl);
  };
  
  varService.updateVarSet = function(varset) {
    return $http.put(varSvcUrl, JSON.stringify(varset));
  };
  
  varService.createVarSet = function(varset) {
    return $http.post(varSvcUrl, JSON.stringify(varset));
  };
  
  varService.deleteVarSet = function(id) {
    if(id !== 'undefined') {
      return $http.delete(varSvcUrl+"/"+id);
    };    
  };
  
  
  return varService;
}]);

services.factory('MetadataService',['$http', function($http) {
  var metaService = {};
  var metaSvcUrl = '/api/meta';
  
  metaService.getTags = function() {
    return $http.get(metaSvcUrl+'/tags');
  };
  
  metaService.getRIs = function() {
    return $http.get(metaSvcUrl+'/ris');
  };
  
  metaService.getPLAs = function() {
    return $http.get(metaSvcUrl+'/plas');
  };
  
  
  
  return metaService;

}]);

services.factory('ProcessService', ['$http', function($http) {
    var getProcessUrl = '/api/processes';
    var processService = {};
    processService.getProcesses = function() {
      return $http.get(getProcessUrl);
    };
    
    processService.killProcess = function(pid) {
      return $http.post(getProcessUrl+"/kill/" + pid)
    };
    return processService;
}]);
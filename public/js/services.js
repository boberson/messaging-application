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
  var hostUrl = '/api/host'
  
  
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

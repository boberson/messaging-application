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
  var urlBase = '/api/messages';
  messageService.getMessages = function() {
    return $http.get(urlBase);
  };
  
  return messageService;
}]);

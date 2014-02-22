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
'use strict';

/* Services */

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
  messageService.getMessage = function(id) {
    return $http.get(messageUrl+"/"+id);
  };
  
  messageService.messageChanged = function(id, orig, unchanged, changed, error) {
    $http.get(messageUrl+"/"+id).success(function(data){
      var messages = data;
      if(messages.length > 0) {
        if(angular.equals(messages[0], orig)) {
          unchanged();
        } else {
          changed();
        }
      } else {
        changed();
      };
    }).error(function(data){
      error(data);
    });
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
  
  hostService.getHost = function(id) {
    return $http.get(hostUrl+"/"+id);
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
  
  varService.getVarSet = function(id) {
    return $http.get(varSvcUrl+"/"+id);
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
      return $http.post(getProcessUrl+"/kill/" + pid);
    };
    return processService;
}]);

services.factory('AlertService', ['$timeout', function($timeout) {
    var alertService = {};
    alertService.alerts = new Array();
    alertService.notify = true;
    
    // Alert type can be info, success, warning, or danger.
    alertService.addAlert = function(alertType, alertMessage) {
      if(alertService.notify) {
        var alt = {type: alertType, msg: alertMessage};
        alertService.alerts.push(alt);
        $timeout(function(){
          alertService.alerts.splice(alertService.alerts.lastIndexOf(alt), 1);
        },3500);
      };      
    };
    
    return alertService;
}]);


//This service provides misc utilities that various controllers will use.
services.factory('ControllerUtilities', [function(){
    var ctrlUtils = {};
    
    /**
     * this function will return an object that can be used to open a modal window.
     * It will be wrapped by a function in a controller such that a custom modal can be created.
     */
    ctrlUtils.newModalObject = function(modalTemplate, modalController, title, object, saveFunc) {
      var mo = {};
      mo.templateUrl = modalTemplate;
      mo.controller = modalController;      
      mo.resolve = {};
      mo.resolve.title = function() { return title; };
      mo.resolve.object = function() { return object; };
      mo.resolve.save = function() { return saveFunc; };
      return mo;
    };
    
    /*
     * takes data that is returned from the Metadata Service function getPLAs
     * returns the list of plain language addresses plaList sorted
     */
    ctrlUtils.sortPLAs = function(data) {
      var sorted = data.sort(function(a,b) {
        if(a.value >= b.value) {
          return -1;
        } else {
          return 1;
        }
      });
      var sortedPLAs = {};
      for (var p in sorted) {
        sortedPLAs[sorted[p]._id] = sorted[p].value;
      };
      var plaList = [];
      for (var p in sortedPLAs) {
        plaList.push(p);
      }
      return plaList;
    };
    
    /*
     * takes data that is returned from the Metadata Service function getRIs
     * returns the list of routing indicators riList sorted
     */
    ctrlUtils.sortRIs = function(data) {
      var sorted = data.sort(function(a,b) {
        if(a.value >= b.value) {
          return -1;
        } else {
          return 1;
        }
      });
      var sortedRIs = {};
      for (var p in sorted) {
        sortedRIs[sorted[p]._id] = sorted[p].value;
      };
      var riList = [];
      for (var p in sortedRIs) {
        riList.push(p);
      }
      return riList;
    };
    
    return ctrlUtils;
}]);
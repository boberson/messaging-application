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

/* Controllers */
/*
 * The header controller is used for the navigation bar.
 */
function HeaderCtrl($scope, $location) {
  /*
   * Checks it your current path is the same as ViewLocation and is used to highlight a navigation bar item.
   * @param {type} viewLocation this is a path you want to check
   * @returns {Boolean} returns true if the viewLocation variable is the same as your current path
   */
  $scope.isActive = function(viewLocation) {
        return viewLocation === $location.path();
  };
}

/*
 * the Alert Controller deals with displaying the alerts. Alerts are added via the Alert Service.
 */
function AlertCtrl($scope, AlertService) {
  $scope.alerts = AlertService.alerts;
  $scope.notify = AlertService.notify;
  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index,1);
  };
};
AlertCtrl.$inject = ['$scope', 'AlertService'];

/*
 * Message controller used for the message page
 */
function MessageCtrl($scope, MessageService, $modal, AlertService, $filter, ControllerUtilities) {
  $scope.message = {};
  $scope.message.messages = [];
  $scope.message.filteredMessages = [];
  $scope.message.searchText = "";
  $scope.message.searches = [];
  $scope.messageFields = [{id: "name", name: "Title"}, {id: "text", name: "Body"}, {id: "tags", name: "Tags"}, {id: "description", name: "Description"}];
  getMessages();
  /*
   * Function calls used in the view
   */
  
  // function called when refresh button is clicked.
  $scope.refresh = function() {
    getMessages();
  };
  
  //function that is called when the delete button is clicked on a message it in turn calls the deleteMessage Function with the messages id.
  $scope.delete = function(message) {
    var warning = "Are you sure you want to delete:\n"+message.name;
    var id = message._id;
    if(window.confirm(warning)) {
      deleteMessage(id);
    };    
  };
  
  // if called this function will sort the messages by their name.
  $scope.sortByName = function(){
    asc = !asc;
    $scope.message.messages.sort(sortByName);
  };
  
  // if called this function will sort the messages by the number of their tags.
  $scope.sortByTags = function(){
    asc = !asc;
    $scope.message.messages.sort(sortByTags);
  };
  
  //action to perform after the modal window closes.
  function afterModal() { getMessages(); }
  //template url for the modal window.
  var modalTemplateUrl = 'templates/edit-form.html';
  var acp128TemplateUrl = 'templates/acp128.html';
  
  
  // open a modal window with a new message object
  $scope.new = function () {
    //modal window title
    var title = "New Message";
    //passing in a blank new message object.
    var message = {};
    // create the modal object setting the template, controller and resolved variables.
    var modalObject = ControllerUtilities.newModalObject(modalTemplateUrl, MessageFormCtrl, title, message, createMessage);    
    var modalInstance = $modal.open(modalObject);    
    modalInstance.result.then(afterModal, afterModal);
  };
  
  // Open a copy of a message to edit it.
  $scope.copy = function(message) {
    var msg = {};
    msg.name = message.name;
    msg.text = message.text;
    msg.tags = message.tags;
    msg.description = message.description;
    var title = "New Message";
    var modalObject = ControllerUtilities.newModalObject(modalTemplateUrl, MessageFormCtrl, title, msg, createMessage);    
    var modalInstance = $modal.open(modalObject);    
    modalInstance.result.then(afterModal, afterModal);
  };
  
  
  // open the message modal window with the provide message object.
  $scope.edit = function (message) {
    var original = angular.copy(message);
    // the function that gets called to update the edited message in the database.
    function updateMessage(msg, cb) {
      //make sure that message is defined and has the _id attr.
      if(msg && msg._id) {
          //verify that the message hasn't changed since you started editing it.
          msg.text = original.text;
          MessageService.messageChanged(msg._id, original, function() {
            //update the message.
            MessageService.updateMessage(msg).success(function(data) {AlertService.addAlert("success", "Successfully Updated Message:\n"+msg.name); if(cb) {cb();};}).error(function(data) {AlertService.addAlert("danger", "Error:\n"+data.msg); if(cb) {cb();};});
          }, function() {
            //alert the user that the message has changed since they opened the edit window.
            alert("Error Message Changed while you were editing it you will need to reload the edit window before saving any changes.");
          }, function(data){
            //  there was an error saving the message.
            alert("Error Saving Message. "+data.status);
          });
      }
    };
    //modal window title
    var title = "Edit Message";
    // create the modal object setting the template, controller and resolved variables.
    var modalObject = ControllerUtilities.newModalObject(modalTemplateUrl, MessageFormCtrl, title, message, updateMessage);    
    var modalInstance = $modal.open(modalObject);    
    modalInstance.result.then(afterModal, afterModal);
  };
  
  // sort the messages when the page loads.  
  if($scope.message.messages) {
    $scope.message.messages.sort(sortByName);
  };
  var asc = true;
  // a function that will sort 2 messages by the number of tags
  function sortByTags(a, b) {
    var ascending = (asc) ? 1 : -1;
    if(a.tags.length > b.tags.length) {
      return ascending;
    } else {
      return ascending * -1; 
    }
  }
  
  // a function that will sort 2 messages by their name
  function sortByName(a, b) {
    var ascending = (asc) ? 1 : -1;
    if(a.name > b.name) {
      return ascending;
    } else {
      return ascending * -1; 
    }
  }
  
  // a call back that will send an alert to the alert service if an error occurs.
  var errorCb = function(data) {
    AlertService.addAlert("danger", "Error:\n" + data.message);
  };
  
  //Call the delete function of the message service with the message id that is provided.
  function deleteMessage(id) {
    MessageService.deleteMessage(id).
    success(function(data) {
      getMessages();
      AlertService.addAlert("warning", "Successfully Deleted Message\n" + message.name);
    }).
    error(errorCb);
  };
  
  //the getMessages function updates the scope variable message.messages to the value returned by MessageService.getMessages.
  function getMessages() {
    MessageService.getMessages().
    success(function(data) {
      $scope.message.messages = data.sort(sortByName);
    }).
    error(errorCb);
  };
  
  //the function used by the modal window to create a new message. it creates a new message using the MessageService.createMessage function
  function createMessage(msg, cb) {
    MessageService.createMessage(msg).
    success(function(data) {
      AlertService.addAlert("success", "Successfully Created Message:\n"+msg.name);
      if(cb) {
        cb();
      };
    }).
    error(function(data) {
      AlertService.addAlert("danger", "Error:\n"+data.msg);
      if(cb) {
        cb();
      };
    });
  }
  
  // returns true if the message hasn't changed since the edit window has been open.
  function notChanged(original) {
    if(original && original._id) {
      
    } else {
      return false;
    };    
  }  
}
MessageCtrl.$inject = ['$scope', 'MessageService', '$modal', 'AlertService', '$filter', 'ControllerUtilities'];

/*
 * The controller for the Modal Window with the message form.
 */
function MessageFormCtrl($scope, $modalInstance, MetadataService, object, title, save) {
  $scope.message = object;
  $scope.modalTitle = title;
  $scope.other = {};
  $scope.tagNames = new Array();
  var original = angular.copy(object);
 
  $scope.sortedTags = {};
  getTags();
  $scope.isEdit = function() {
    if(object._id) {
      return true;
    } else {
      return false;
    }
  };
  //returns false if the messages given "msg" is  the same as the original message.
  $scope.changed = function(msg) {
    return !angular.equals(msg, original);
  };
  
  //this function takes a tag name returns a size percentage between 100% to 300%
  $scope.getTagSize = function(name) {
    // size from 100 to 300 in increments of 20
    var count = $scope.sortedTags[name];
    if(count === 'undefined') {
      return "100%";
    }
    if(count === 1 ) {
      return "100%";
    } else if(count > 11) {
      return "300%";
    } else {
      var size = (20 * ( count - 1)) + 100;
      return size + "%";      
    };
  };
  
  // gets the list of tags existing tags on all messages for autocompletion.
  function getTags() {
    MetadataService.getTags().
    success(function(data) {
      var sorted = data.sort(function(a,b) {
        if(a.value >= b.value) {
          return -1;
        } else {
          return 1;
        }
      });
      
      for (var t in sorted) {
        $scope.sortedTags[sorted[t]._id] = sorted[t].value;
      };
      for (var t in $scope.sortedTags) {
        $scope.tagNames.push(t);
      }            
    }).
    error(function(data) {
      console.log("Error: "+data.message);
    });
  }
  
  // make sure that $scope.message.tags is not undefined if so create a new empty array.
  if(typeof $scope.message.tags === 'undefined') {
      $scope.message.tags = new Array();
  };
  // make sure that $scope.message.description is not undefined
  if(typeof $scope.message.description === 'undefined') {
      $scope.message.description = "";
  }; 
  
  //function that is called when the save button is pressed.
  $scope.save = function(msg) {
    msg.name = msg.name.toUpperCase();
    msg.text = msg.text.toUpperCase();
    msg.tags = msg.tags.map(function(single) {
      return single.toUpperCase();
    });
    save(msg, $modalInstance.close);  
  };
  
  //function that is called when the cancel button is pressed.
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
  //callback function that is invoked for key events in the tag input
  $scope.keypressed = function(event) {
    if(event.keyCode === 13) {
      $scope.addTag();
    };
  };
  
  //function that is called when the X is clicked on a tag.
  $scope.removeTag = function(tag) {
    var index = $scope.message.tags.indexOf(tag);
    if(index >= 0) {
      $scope.message.tags.splice(index, 1);
    };
  };
  
  /*
   * this function adds the $scope.other.newtag to the list of tags.
   * it gets called by the keypress function when the key event is equal to 13 (the enter key)   
   */
  $scope.addTag = function() {
    if($scope.message.tags.indexOf($scope.other.newtag) < 0 && $scope.other.newtag.trim() !== ""){
      $scope.message.tags.push($scope.other.newtag.trim().toUpperCase());
    };
    $scope.other.newtag = "";
  };
}
MessageFormCtrl.$inject = ['$scope', '$modalInstance', 'MetadataService', 'object', 'title', 'save'];

/*
 * This is the controller for the Variable Set Page.
 */
function VarCtrl($scope, $modal, VarService, AlertService, $filter, ControllerUtilities) {
  $scope.var = {};
  $scope.var.filteredVarsets;
  $scope.var.varsets;
  
  // Callback for async success
  var cbSuccess = function(data) { AlertService.addAlert("success", "Success:\n"+data.msg); getVarSets(); };
  
  // Callback for async failure
  var cbFailure = function(data) { AlertService.addAlert("danger", "Error:\n"+data.msg); };
  getVarSets();
  
  //function provided to the view to delete a variable set.
  $scope.delete = function(varset) {
    var warning = "Are you sure you want to delete Host:\n" + varset.name;
    var id = varset._id;
    if(window.confirm(warning)) {
      deleteVarSet(id);
    };
  };
  
  // function that the refresh button calls to make an async call for getting the varsets.
  $scope.refresh = function() {
    getVarSets();
  };
  
  // Call the Var service getvarsets function which will get the varsets in an async manner and set the scope variable var.varsets to the result. 
  function getVarSets() {
    VarService.getVarSets().success(function(data){ $scope.var.varsets = data;}).error(cbFailure);
  };
  
  //delete a varset with the provided id using the var service. this function gets called by the $scope.delete function.
  function deleteVarSet(id) {
    VarService.deleteVarSet(id).success(function(data) { AlertService.addAlert("success", "Success Deleting VarSet:\n"+data.msg); getVarSets(); }).error(cbFailure);
  };
  //function that will be used by the modal window to create a new message.
  function createVarSet(vs) {
    VarService.createVarSet(vs).success(function(data) { AlertService.addAlert("success", "Success Creating VarSet:\n"+data.msg); getVarSets(); }).error(cbFailure);
  };
  //function that will be used by the modal window to update an existing message.
  function updateVarSet(vs) {
    VarService.updateVarSet(vs).success(function(data) { AlertService.addAlert("success", "Success Updating VarSet:\n"+data.msg); getVarSets(); }).error(cbFailure);
  };
  
  //the url for the modal template.
  var modalTemplateUrl = 'templates/varset-form.html';
  //call back to perform after the modal window closes.
  var afterModal = function() { getVarSets(); };
  
  $scope.new = function () {
    //object to edit
    var object = {};
    // modal window title
    var title = "New Variable Set";
    //the object used to create the modal window.
    var modalObject = ControllerUtilities.newModalObject(modalTemplateUrl, VarFormCtrl, title, object, createVarSet);
    var modalInstance = $modal.open(modalObject);
    modalInstance.result.then(afterModal, afterModal);
  };
  
  $scope.edit = function (varSet) {    
    //object to edit
    var object = varSet;
    // modal window title
    var title = "Edit Variable Set";
    //the object used to create the modal window.
    var modalObject = ControllerUtilities.newModalObject(modalTemplateUrl, VarFormCtrl, title, object, updateVarSet);
    var modalInstance = $modal.open(modalObject);
    modalInstance.result.then(afterModal, afterModal);
  };
}
VarCtrl.$inject = ['$scope', '$modal', 'VarService', 'AlertService', '$filter', 'ControllerUtilities'];

/*
 * The controller for the Modal Window with the varset form.
 */
function VarFormCtrl($scope, $modalInstance, VarService, MetadataService, object, title, save, ControllerUtilities) {
  $scope.template = object;
  $scope.modalTitle = title;
  $scope.other = {};
  var original = angular.copy(object);
  $scope.plaList = new Array();
  $scope.riList = new Array();
  getRIs();
  getPLAs();
  
  /*
   * initialize dri, action and info if they are undefined.
   */
  if(!$scope.template.dri) {
    $scope.template.dri = new Array();
  }
  if(!$scope.template.action) {
    $scope.template.action = new Array();
  }
  if(!$scope.template.info) {
    $scope.template.info = new Array();
  }
  
  //Gets a sorted list of Plain Language Addresses for autocompletion.
  function getPLAs() {
    MetadataService.getPLAs().
    success(function(data) { $scope.plaList = ControllerUtilities.sortPLAs(data); }).
    error(function(data) { console.log("Error: "+data.message); });
  }
  
  //Gets a sorted list of Routing Indicators for autocompletion.
  function getRIs() {
    MetadataService.getRIs().
    success(function(data) { $scope.riList = ControllerUtilities.sortRIs(data); }).
    error(function(data) { console.log("Error: "+data.message); });
  }
  
  //returns true if the varset has changed from its original state.
  $scope.changed = function(vs) {
    return !angular.equals(vs, original);
  };
  
  //function used to add an object to a multi valued entry i.e. TO, INFO, or DRI
  $scope.add = function(item, list) {
    if(list.indexOf(item) < 0) {
      list.push(item);
    };    
  };
  
  //makes sure that none of the lists (DRI, TO, or INFO are empty)
  $scope.validLists = function() {
    return ($scope.template.dri.length > 0) && ($scope.template.action.length > 0) && ($scope.template.info.length > 0);
  };
  
  //function used to remove an object from a multi valued entry i.e. TO, INFO, or DRI
  $scope.remove = function(idx, list) {
    list.splice(idx, 1);
  };
  
  //save a variable set.
  $scope.save = function(vs) {
    save(vs);
    $modalInstance.close();
  };
  
  //leave the modal window without making changes to the varset
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');    
  };
  
  //DTG Datepicker stuff  
  $scope.open = function(event) {
    event.preventDefault();
    event.stopPropagation();
    $scope.other.opened = true;
  };
  
}
VarFormCtrl.$inject = ['$scope', '$modalInstance', 'VarService', 'MetadataService', 'object', 'title', 'save', 'ControllerUtilities'];

/*
 * This is the controller for the Host Database Page.
 */
function HostCtrl($scope, $location, HostService, $modal, AlertService, ControllerUtilities) {
  $scope.hostdb = {};
  $scope.hostdb.hosts = new Array();
  $scope.hostdb.filteredHosts = new Array();
  getHosts();
  // function called when refresh button is clicked.
  $scope.refresh = function() {
    getHosts();
  };
  //function that is called when the delete button is clicked on a host it in turn calls the deleteHost Function with the hosts id.
  $scope.delete = function(host) {
    var warning = "Are you sure you want to delete Host:\n"+host.Alias;
    var id = host._id;
    if(window.confirm(warning)) {
      deleteHost(id);
    };
  };
  //processes the error data from an async http call.
  function processErrorData(data) {
    var message = "";
    for(var i in data.status.errors) {
      message += i + " : " + data.status.errors[i].message+"\n";
    }
    return message;
  }
  //the callback used when an async http error occurs.
  function errorCb(data) { AlertService.addAlert("danger", "Error:\n" + data.message); };
  // This function gets the hosts and sets the scope variable hostdb.hosts to the result in an async manner.
  function getHosts() {
    HostService.getHosts().
    success(function(data) {
      $scope.hostdb.hosts = data;
    }).
    error(errorCb);
  };
  //Call the delete function of the host service with the host id that is provided.
  function deleteHost(id) {
    HostService.deleteHost(id).
    success(function(data) {
      getHosts();
      AlertService.addAlert("success", "Successfully Deleted Host: "+id);
    }).error(errorCb);
  };
  //the function used by the modal window to create a new host. it creates a new host using the HostService.createHost function
  function createHost(msg, cb) {
    HostService.createHost(msg).
    success(function(data) {
      AlertService.addAlert("success", "Successfully Created Host: "+msg.name);
      if(cb) {
        cb();
      };
    }).
    error(function(data) {
      console.log(data);
      AlertService.addAlert("danger", "Error:\n" + processErrorData(data));
      if(cb) {
        cb();
      };
    });
  }
  //the function used by the modal window to update a host. it updates the host using the HostService.updateHost function
  function updateHost(msg, cb) {
    HostService.updateHost(msg).
    success(function(data) {
      AlertService.addAlert("success", "Successfully Updated Host: "+msg.name);
      if(cb) {
        cb();
      };
    }).
    error(function(data) {
      AlertService.addAlert("danger", "Error:\n" + processErrorData(data));
      if(cb) {
        cb();
      };
    });
  };
  
  //callback to perform after the modal window closes.
  function afterModal() { getHosts(); };
  //the template url for the modal window.
  var modalTemplateUrl = 'templates/host-form.html';
  //this funtion is called when the user clicks the new host button
  $scope.new = function () {
    //object to edit
    var object = {};
    // modal window title
    var title = "New Host";
    //the object used to create the modal window.
    var modalObject = ControllerUtilities.newModalObject(modalTemplateUrl, HostFormCtrl, title, object, createHost);
    var modalInstance = $modal.open(modalObject);
    modalInstance.result.then(afterModal, afterModal);
  };
  // this function is called when the users clicks on a host to edit.
  $scope.edit = function (host) {
    //object to edit
    var object = host;
    // modal window title
    var title = "Edit Host";
    //the object used to create the modal window.
    var modalObject = ControllerUtilities.newModalObject(modalTemplateUrl, HostFormCtrl, title, object, updateHost);
    var modalInstance = $modal.open(modalObject);
    modalInstance.result.then(afterModal, afterModal);
  };
}
HostCtrl.$inject = ['$scope', '$location', 'HostService', '$modal', 'AlertService', 'ControllerUtilities'];

/*
 * The controller for the Modal Window with the host form.
 */
function HostFormCtrl($scope, HostService, $modalInstance, object, title, save) {
  $scope.hostform = {};
  $scope.hostform.host = object;
  $scope.modalTitle = title;
  var original = angular.copy(object);
  //returns true if the user has changed anything.
  $scope.changed = function(host) {
    return !angular.equals(host, original);
  };
  //save the host and close the modal window.
  $scope.save = function(h) {   
    save(h,$modalInstance.close);
  };
  //exit the modal without making changes.
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };  
}
HostFormCtrl.$inject = ['$scope', 'HostService', '$modalInstance', 'object', 'title', 'save'];

/*
 * This is the controller for the Generate Page.
 * This page allows a user to submit groups of messages with a variable sett used for addressal to be submitted for message generation.
 * The generated messages are either emailed to a host or can be downloaded.
 */
function GenerateCtrl($scope, $filter, $http, MessageService, HostService, VarService, AlertService, $window) {
  $scope.generate = {};
  $scope.generate.messages = new Array();
  $scope.generate.filteredMessages = new Array();
  $scope.generate.hosts = new Array();
  $scope.generate.filteredHosts = new Array();
  $scope.generate.varsets = new Array();
  $scope.generate.filteredVarsets = new Array();
  $scope.oneAtATime = true;
  $scope.isopen = {};
  $scope.isopen.var = false;
  $scope.isopen.msgs = false;
  $scope.isopen.host = false;
  $scope.generate.se = true;  
  $scope.hidedownload = true;
  $scope.generate.timeout = 1;
  $scope.messageFields = [{id: "name", name: "Title"}, {id: "text", name: "Body"}, {id: "tags", name: "Tags"}, {id: "description", name: "Description"}];
  getMessages();
  getHosts();
  getVarSets();
  /*
   *this function is a utility to check if the checkbox on a particular item has been checked. 
   *its main purpose is to help filter out the messages and hosts that haven't been selected. 
   */
  function isSelected(obj) {
    if(obj.selected === true) {
      return true;
    } else {
      return false;
    }
  }
  /*
   * this button only enables the email/generate button if all of the user has selected all of the necessary criteria to generate messages.
   */
  $scope.generateButtonEnabled = function() {
    if(($scope.generate.messages.filter(isSelected).length > 0) && ($scope.generate.varset)) {
      if($scope.generate.se) {
        return ($scope.generate.hosts.filter(isSelected).length > 0);
      } else {
        return true;
      };
    } else {
      return false;
    }
  };
  /*
   * This function watches the Email checkbox and if and changes the text of the generate button.
   * if email is checked it says Send Email else it says Generate.
   */
  $scope.$watch('generate.se', function(newvalue, oldvalue) {
    $scope.generateBtnText = newvalue ? 'Send Email' : 'Generate';
  });
  /*
   * This function watches the select all messages check box in the messages table header row.
   * if the user clicks this check box it changes the value of all of the filtered messages to match it.
   */
  $scope.$watch('generate.selectAllMsgs', function(newvalue, oldvalue) {
    alterFilteredSelect($scope.generate.filteredMessages, newvalue);
  });
  /*
   * This function watches the select all hosts check box in the hosts table header row.
   * if the user clicks this check box it changes the value of all of the filtered hosts to match it.
   */
  $scope.$watch('generate.selectAllHosts', function(newvalue, oldvalue) {
    alterFilteredSelect($scope.generate.filteredHosts, newvalue);
  });  
  /*
   * This is a helper function that is used by the select all hosts and select all messages check boxes.
   * It changes the value of all of the filtered items to match the clicked checkbox's value.
   */
  function alterFilteredSelect(items, value) {
    var f = $filter('filter'); 
    for(var i = 0; i < items.length; i++) {
      items[i].selected = value;
    }
  }
  //the getMessages function updates the scope variable generate.messages to the value returned by MessageService.getMessages.
  function getMessages() {
    MessageService.getMessages().
    success(function(data) {
      $scope.generate.messages = data;
    }).
    error(function(data) {
      AlertService.addAlert('warning', "Error getting messages: " + data.message);
    });
  };
  //the getHosts function updates the scope variable generate.hosts to the value returned by HostService.getHosts.
  function getHosts() {
    HostService.getHosts().
    success(function(data){
      $scope.generate.hosts = data;
    }).
    error(function(data){
      AlertService.addAlert('warning', "Error getting hosts: " + data.message);
    });
  };
  //the getVarSets function updates the scope variable generate.varsets to the value returned by VarService.getVarSets.
  function getVarSets() {
    VarService.getVarSets().
    success(function(data){
      $scope.generate.varsets = data;
    }).
    error(function(data){
      AlertService.addAlert('warning', "Error getting varsets: " + data.message);
    });
  };
  /**
   * TODO need to clean up this function
   * this function gets called when the generate button is pressed.
   * It handles submitting to the submit messages url.
   */
  $scope.generateAction = function() {
    var data = {};
    var submitUrl = "/api/submit";    
    data.messages = $scope.generate.messages.filter(isSelected);
    data.varset = $scope.generate.varset;
    
    if($scope.generate.se) {
      data.hosts = new Array();
      var url = submitUrl + "/email";
      data.hosts = $scope.generate.hosts.filter(isSelected);
      if($scope.generate.timeout && $scope.generate.timeout > 0) {
        data.timeout = $scope.generate.timeout;
      } else {
        data.timeout = 1;
      };
      $http({url: url, data: JSON.stringify(data), method: "POST"}).success(function(data, status, headers, config){
        AlertService.addAlert('success', "Success submitting messages to email. You can monitor the process on the processes tab.");
      }).error(function(data, status, headers, config){
        AlertService.addAlert('warning', "Error submitting messages\n"+status);
      });
    } else {
      // submit a post with the messages and varset then open a new window with the download url
      var url = submitUrl + "/download" ;
      var downloadUrl = "/api/download/";
      $http({url: url, data: JSON.stringify(data), method: "POST"}).success(function(data, status, headers, config){
        AlertService.addAlert('success', "Success submitting for download. Please click the 'Download Generated Messages' button to download them.");
        console.log(data);
        $scope.downloadLink = downloadUrl + data.filename;
        $scope.hidedownload = false;
      }).error(function(data, status, headers, config){
        AlertService.addAlert('warning', "Error submitting messages\n"+status);
      }); 
    };       
  };  
};
GenerateCtrl.$inject = ['$scope', '$filter', '$http', 'MessageService', 'HostService', 'VarService', 'AlertService', '$window'];

/*
 * This controller is for the process manager page.
 * It allows a user to manage email processes that were started.
 */
function ProcessCtrl($scope, $timeout, $location, ProcessService, AlertService) {
  $scope.processes = [];
  areProcesses();
  //returns true if there are any processes in the scope variable processes.
  function areProcesses() {
    $scope.processExists =  $scope.processes.length > 0;
  };
  //returns a percentage complete of the provided process proc.
  $scope.getPercentage = function(proc) {
    return 100 * (proc.completed / proc.total);
  };
  //this function uses the killProcess function to terminate a process running on the server.
  $scope.kill = function(process) {
    var warning = "Are you sure you want to stop sending to:\n"+process.to;
    var pid = process.pid;
    if(window.confirm(warning)) {
      killProcess(pid);
      AlertService.addAlert('warning', 'Process Stopped \n' + pid);
    };    
  };
  //This function kills a process with the provided pid using the ProcessService.killProcess function.
  function killProcess(pid) {
    ProcessService.killProcess(pid).
    success(function(data){
    }).
    error(function(data){
      AlertService.addAlert('warning', "Error Stopping Process\n"+pid);
    });
  }; 
  
  //register an event listener to /api/stats which will push server side events when a process is updated.
  var source = new EventSource('/api/stats');
  //log if there was an error registering an event listener with /api/stats
  source.onerror = function(data) {
    console.log("Error on sse listener: ");
  };
  //process data when an event is sent from the server with new process data.
  source.onmessage = function(e) {
    var data = JSON.parse(e.data);
    AlertService.addAlert("info", data.message);     
    $scope.$apply(function() {
      $scope.processes = data.processes; 
      areProcesses();
    });
  };
  //log that a event listener was opened.
  source.onopen =function(data) {
    console.log("Opened the listener to the server ready for updated events.");
  };
};
ProcessCtrl.$inject = ['$scope', '$timeout', '$location', 'ProcessService', 'AlertService'];

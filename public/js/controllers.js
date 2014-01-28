'use strict';

/* Controllers */
function ManageCtrl($scope, MessageService, Message) {
  $scope.manage = {};
  $scope.manage.messages;
  $scope.manage.status = MessageService.status;
  if($scope.manage.status.length > 0) {
    $scope.manage.displayStatus = "panel panel-lg panel-danger";
  } else {
    $scope.manage.displayStatus = "status-invisible";
  }
  
  
  $scope.edit = function(message) {
    Message.message = message;
  };
  
  $scope.delete = function(message) {
    var warning = "Are you sure you want to delete:\n"+message.name;
    var id = message._id;
    if(window.confirm(warning)) {
      deleteMessage(id);
    }
    
  };
  
  function deleteMessage(id) {
    MessageService.deleteMessage(id).
    success(function(data) {
      getMessages();
    }).
    error(function(data) {
      $scope.manage.status = "Error getting messages: " + data.message;
    });
  };
  
  getMessages();
  function getMessages() {
    MessageService.getMessages().
    success(function(data) {
      $scope.manage.messages = data;
    }).
    error(function(data) {
      $scope.Manage.status = "Error getting messages: " + data.message;
    });
  };
  
}
ManageCtrl.$inject = ['$scope', 'MessageService', 'Message' ];

function HeaderCtrl($scope, $location) {
  $scope.isActive = function(viewLocation) {
        return viewLocation === $location.path();
  };
}

function CreateCtrl($scope, $location, MessageService) {
  $scope.message = {};
  $scope.message.tags = new Array();
  $scope.keypressed = function(event) {
    if(event.keyCode === 13) {
      $scope.addTag();
    };
  };

  $scope.removeTag = function(tag) {
    var index = $scope.message.tags.indexOf(tag);
    if(index >= 0) {
      $scope.message.tags.splice(index, 1);
    };
  };

  $scope.addTag = function() {
    if($scope.message.tags.indexOf($scope.message.newtag) < 0 && $scope.message.newtag.trim() !== ""){
      $scope.message.tags.push($scope.message.newtag.trim());
    };
    $scope.message.newtag = "";
  };
  
  $scope.cancel = function() {
    $location.path('/manage');
  };

  $scope.save = function(msg) {
    createMessage(msg);
    $location.path('/manage');
  };
  
  function createMessage(msg) {
    MessageService.createMessage(msg).
    success(function(data) {
      MessageService.status = "Successfully Created Message: "+msg.name;
      $location.path('/manage');
    }).
    error(function(data) {
      $scope.status = "Error getting messages: " + data.message;
    });
  }
}
CreateCtrl.$inject = ['$scope', '$location', 'MessageService'];

function EditCtrl($scope, $location, Message, MessageService) {
  $scope.message = Message.message;
  $scope.status = MessageService.status;
  if(typeof $scope.message === 'undefined' || $scope.message === {}) {
      alert("No message selected to edit please click edit on the desired message!");
      $location.path('/manage');
  }     
  else if(typeof $scope.message.tags === 'undefined') {
      $scope.message.tags = new Array();
  };      

  $scope.keypressed = function(event) {
      if(event.keyCode === 13) {
        $scope.addTag();
      };
  };

  $scope.removeTag = function(tag) {
      var index = $scope.message.tags.indexOf(tag);
      if(index >= 0) {
          $scope.message.tags.splice(index, 1);
      };
  };

  $scope.addTag = function() {
      if($scope.message.tags.indexOf($scope.message.newtag) < 0 && $scope.message.newtag.trim() !== ""){
          $scope.message.tags.push($scope.message.newtag.trim());
      };
      $scope.message.newtag = "";
  };

  $scope.cancel = function() {
      $location.path('/manage');
  };

  $scope.save = function(msg) {
    var warning = "Are you sure you want to update:\n"+msg.name;
    if(window.confirm(warning)) {
      updateMessage(msg);
    }
    $location.path('/manage');
  };

  function updateMessage(msg) {
    MessageService.updateMessage(msg).
    success(function(data) {
      $scope.status = "Successfully Created Message: "+msg.name;
      $location.path('/manage');
    }).
    error(function(data) {
      $scope.status = "Error getting messages: " + data.message;
    });
  };
}
EditCtrl.$inject = ['$scope', '$location', 'Message', 'MessageService'];
function HostCtrl() {}
HostCtrl.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];

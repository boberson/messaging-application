'use strict';

/* Controllers */
function HeaderCtrl($scope, $location) {
  $scope.isActive = function(viewLocation) {
        return viewLocation === $location.path();
  };
}

function ManageCtrl($scope, MessageService, Message, $modal) {
  $scope.manage = {};
  $scope.manage.messages;
  $scope.manage.searchText = "";
  getMessages();
  updateStatus();
  
  function updateStatus() {
    $scope.manage.status = MessageService.status;  
    if($scope.manage.status.length > 0) {
      $scope.manage.displayStatus = "panel panel-lg panel-danger";
    } else {
      $scope.manage.displayStatus = "status-invisible";
    }
  }
  
   
  $scope.edit = function(message) {
    Message.message = message;
  };
  
  $scope.delete = function(message) {
    var warning = "Are you sure you want to delete:\n"+message.name;
    var id = message._id;
    if(window.confirm(warning)) {
      deleteMessage(id);
    };    
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
  
  function getMessages() {
    MessageService.getMessages().
    success(function(data) {
      $scope.manage.messages = data;
      console.log("got messages");
    }).
    error(function(data) {
      $scope.Manage.status = "Error getting messages: " + data.message;
      console.log("problem getting messages");
    });
  };
  
  $scope.newMessage = function (message) {
    var modalInstance = $modal.open({
      templateUrl: 'templates/edit-form.html',
      controller: CreateCtrl
    });

    modalInstance.result.then(function () {
      getMessages();  
    }, function () {
      getMessages();
    });
  };
  
  $scope.editMessage = function (message) {
    Message.message = message;
    var modalInstance = $modal.open({
      templateUrl: 'templates/edit-form.html',
      controller: EditCtrl,
      resolve: {
        message: function () {
          return message;
        }
      }
    });

    modalInstance.result.then(function () {
      getMessages();
    }, function () {
      getMessages();
    });
  };
  
}
ManageCtrl.$inject = ['$scope', 'MessageService', 'Message', '$modal'];

function CreateCtrl($scope, $location, MessageService, $modalInstance) {
  $scope.message = {};
  $scope.message.tags = new Array();
  $scope.modalTitle = "New Message";
  $scope.save = function(msg) {
    createMessage(msg);   
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
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
  
  function createMessage(msg, cb) {
    MessageService.createMessage(msg).
    success(function(data) {
      MessageService.status = "Successfully Created Message: "+msg.name;
      cb();
    }).
    error(function(data) {
      $scope.status = "Error getting messages: " + data.message;
      cb();
    });
  }
}
CreateCtrl.$inject = ['$scope', '$location', 'MessageService', '$modalInstance'];

function EditCtrl($scope, $location, Message, MessageService, $modalInstance) {
  $scope.message = Message.message;
  $scope.status = MessageService.status;
  $scope.modalTitle = "Edit Message";
     
  if(typeof $scope.message.tags === 'undefined') {
      $scope.message.tags = new Array();
  };      

  $scope.save = function(msg) {
    var warning = "Are you sure you want to update:\n"+msg.name;
    if(window.confirm(warning)) {
      updateMessage(msg, $modalInstance.close);
    }    
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
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

  function updateMessage(msg, cb) {
    MessageService.updateMessage(msg).
    success(function(data) {
      $scope.status = "Successfully Created Message: "+msg.name;
      cb();
    }).
    error(function(data) {
      $scope.status = "Error getting messages: " + data.message;
      cb();
    });
  };
}
EditCtrl.$inject = ['$scope', '$location', 'Message', 'MessageService', '$modalInstance'];

function HostCtrl($scope, $location, HostService) {
  $scope.hostdb = {};
  $scope.hostdb.hosts = new Array();
  $scope.hostdb.newhost = {};
  getHosts();
  function getHosts() {
    HostService.getHosts().
    success(function(data) {
      $scope.hostdb.hosts = data;
    }).
    error(function(data) {
      $scope.hostdb.status = "Error getting messages: " + data.message;
    });
  };
  
  $scope.setHost = function(host) {
    $scope.hostdb.newhost = host;
  };
  
  $scope.clear = function() {
    $scope.hostdb.newhost = {};
  };
}
HostCtrl.$inject = ['$scope', '$location', 'HostService'];

/*var ModalDemoCtrl = function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'templates/modal.html',
      controller: ModalInstanceCtrl,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};*/
/*var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};*/
/*function EditCtrl($scope, $location, Message, MessageService) {
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
EditCtrl.$inject = ['$scope', '$location', 'Message', 'MessageService'];*/
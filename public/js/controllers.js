'use strict';

/* Controllers */
function HeaderCtrl($scope, $location) {
  $scope.isActive = function(viewLocation) {
        return viewLocation === $location.path();
  };
}

function MessageCtrl($scope, MessageService, Message, $modal) {
  $scope.message = {};
  $scope.message.messages;
  $scope.message.searchText = "";
  getMessages();
  updateStatus();
  
  function updateStatus() {
    $scope.message.status = MessageService.status;  
    if($scope.message.status.length > 0) {
      $scope.message.displayStatus = "panel panel-lg panel-danger";
    } else {
      $scope.message.displayStatus = "status-invisible";
    }
  }
  
  $scope.refresh = function() {
    getMessages();
  }
  
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
      $scope.message.status = "Error getting messages: " + data.message;
    });
  };  
  
  function getMessages() {
    MessageService.getMessages().
    success(function(data) {
      $scope.message.messages = data;
    }).
    error(function(data) {
      $scope.message.status = "Error getting messages: " + data.message;
    });
  };
  
  function createMessage(msg, cb) {
    MessageService.createMessage(msg).
    success(function(data) {
      MessageService.status = "Successfully Created Message: "+msg.name;
      if(cb) {
        cb();
      };
    }).
    error(function(data) {
      $scope.status = "Error getting messages: " + data.message;
      if(cb) {
        cb();
      };
    });
  }
  
  function updateMessage(msg, cb) {
    MessageService.updateMessage(msg).
    success(function(data) {
      $scope.status = "Successfully Created Message: "+msg.name;
      if(cb) {
        cb();
      };
    }).
    error(function(data) {
      $scope.status = "Error getting messages: " + data.message;
      if(cb) {
        cb();
      };
    });
  };
  
  $scope.newMessage = function () {
    var modalInstance = $modal.open({
      templateUrl: 'templates/edit-form.html',
      controller: MessageFormCtrl,
      resolve: {
        message: function () {
          return {};
        },
        title: function () {
          return "New Message";
        },
        saveMessage: function() {
          return createMessage;
        }
      }
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
      controller: MessageFormCtrl,
      resolve: {
        message: function () {
          return message;
        },
        title: function () {
          return "Edit Message";
        },
        saveMessage: function() {
          return updateMessage;
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
MessageCtrl.$inject = ['$scope', 'MessageService', 'Message', '$modal'];

function MessageFormCtrl($scope, $modalInstance, message, title, saveMessage) {
  $scope.message = message;
  $scope.modalTitle = title;
  if(typeof $scope.message.tags === 'undefined') {
      $scope.message.tags = new Array();
  };  
  $scope.save = function(msg) {
    saveMessage(msg, $modalInstance.close);   
    
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
}
MessageFormCtrl.$inject = ['$scope', '$modalInstance', 'message', 'title', 'saveMessage'];

function HostCtrl($scope, $location, HostService, $modal) {
  $scope.hostdb = {};
  $scope.hostdb.hosts = new Array();
  getHosts();
  
  $scope.refresh = function() {
    getHosts();
  }
  
  $scope.delete = function(host) {
    var warning = "Are you sure you want to delete Host:\n"+host.Alias;
    var id = host._id;
    if(window.confirm(warning)) {
      deleteHost(id);
    };
  }
  
  function getHosts() {
    HostService.getHosts().
    success(function(data) {
      $scope.hostdb.hosts = data;
    }).
    error(function(data) {
      $scope.hostdb.status = "Error getting messages: " + data.message;
    });
  };
  
  function deleteHost(id) {
    HostService.deleteHost(id).
    success(function(data) {
      getHosts();
    }).
    error(function(data) {
      $scope.message.status = "Error getting messages: " + data.message;
    });
  };
  
  function createHost(msg, cb) {
    HostService.createHost(msg).
    success(function(data) {
      HostService.status = "Successfully Created Host: "+msg.name;
      if(cb) {
        cb();
      };
    }).
    error(function(data) {
      $scope.status = "Error getting Hosts: " + data.message;
      if(cb) {
        cb();
      };
    });
  }
  
  function updateHost(msg, cb) {
    HostService.updateHost(msg).
    success(function(data) {
      $scope.status = "Successfully Created Host: "+msg.name;
      if(cb) {
        cb();
      };
    }).
    error(function(data) {
      $scope.status = "Error getting messages: " + data.message;
      if(cb) {
        cb();
      };
    });
  };
  
  $scope.newHost = function () {
    var modalInstance = $modal.open({
      templateUrl: 'templates/host-form.html',
      controller: HostFormCtrl,
      resolve: {
        host: function() {
          return {};
        },
        title: function() {
          return "New Host";
        },
        save: function() {
          return createHost;
        }
      }
    });

    modalInstance.result.then(function () {
      getHosts();  
    }, function () {
      getHosts();
    });
  };
  
  $scope.editHost = function (host) {
    var modalInstance = $modal.open({
      templateUrl: 'templates/host-form.html',
      controller: HostFormCtrl,
      resolve: {
        host: function () {
          return host;
        },
        title: function() {
          return "Edit Host";
        },
        save: function() {
          return updateHost;
        }
      }
    });
    modalInstance.result.then(function () {
      getHosts();
    }, function () {
      getHosts();
    });
  };
}
HostCtrl.$inject = ['$scope', '$location', 'HostService', '$modal'];

function HostFormCtrl($scope, HostService, $modalInstance, host, title, save) {
  $scope.hostform = {};
  $scope.hostform.host = host;
  $scope.modalTitle = title;
  
  $scope.save = function(h) {   
    save(h,$modalInstance.close);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };  
}
HostFormCtrl.$inject = ['$scope', 'HostService', '$modalInstance', 'host', 'title', 'save'];
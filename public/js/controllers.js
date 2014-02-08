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
  
  $scope.refresh = function() {
    getMessages();
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

function MessageFormCtrl($scope, $modalInstance, MetadataService, message, title, saveMessage) {
  $scope.message = message;
  $scope.modalTitle = title;
  $scope.other = {};
  $scope.tagNames = new Array();
  var original = angular.copy(message);
 
  $scope.sortedTags = {};
  getTags();
 
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
      console.log($scope.tagNames);
      
    }).
    error(function(data) {
      console.log("Error: "+data.message);
    });
  }
  
  
  if(typeof $scope.message.tags === 'undefined') {
      $scope.message.tags = new Array();
  };  
  $scope.save = function(msg) {
    msg.name = msg.name.toUpperCase();
    msg.text = msg.text.toUpperCase();
    msg.tags = msg.tags.map(function(single) {
      return single.toUpperCase();
    });
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
    if($scope.message.tags.indexOf($scope.other.newtag) < 0 && $scope.other.newtag.trim() !== ""){
      $scope.message.tags.push($scope.other.newtag.trim().toUpperCase());
    };
    $scope.other.newtag = "";
  };
}
MessageFormCtrl.$inject = ['$scope', '$modalInstance', 'MetadataService', 'message', 'title', 'saveMessage'];

function VarCtrl($scope, $modal, VarService) {
  $scope.var = {};
  var cbSuccess = function(data) { getVarSets(); };
  var cbFailure = function(data) { console.log(data); };
  getVarSets();
  
  $scope.delete = function(varset) {
    var warning = "Are you sure you want to delete Host:\n" + varset.name;
    var id = varset._id;
    if(window.confirm(warning)) {
      deleteVarSet(id);
    };
  };
  
  $scope.refresh = function() {
    getVarSets();
  };
  
  function getVarSets() {
    VarService.getVarSets().success(function(data){ $scope.var.varsets = data; }).error(cbFailure);
  };
  
  function deleteVarSet(id) {
    VarService.deleteVarSet(id).success(cbSuccess).error(cbFailure);
  };
  
  function createVarSet(vs) {
    VarService.createVarSet(vs).success(cbSuccess).error(cbFailure);
  };
  
  function updateVarSet(vs) {
    VarService.updateVarSet(vs).success(cbSuccess).error(cbFailure);
  };
  
  $scope.new = function () {
    var modalInstance = $modal.open({
      templateUrl: 'templates/varset-form.html',
      controller: VarFormCtrl,
      resolve: {
        varSet: function () { return {}; },
        title: function () { return "New Variable Set"; },
        save: function() { return createVarSet; }
      }
    });

    modalInstance.result.then(function () { getVarSets(); }, function () { getVarSets(); });
  };
  
  $scope.edit = function (varSet) {
    var modalInstance = $modal.open({
      templateUrl: 'templates/varset-form.html',
      controller: VarFormCtrl,
      resolve: {
        varSet: function () { return varSet; }, 
        title: function () { return "Edit Variable Set"; }, 
        save: function() { return updateVarSet; }
      }
    });

    modalInstance.result.then(function () { getVarSets(); }, function () { getVarSets(); });
  };
}
VarCtrl.$inject = ['$scope', '$modal', 'VarService'];

function VarFormCtrl($scope, $modalInstance, VarService, MetadataService, varSet, title, save) {
  $scope.template = varSet;
  $scope.modalTitle = title;
  $scope.other = {};
  var original = angular.copy(varSet);
  $scope.plaList = new Array();
  $scope.riList = new Array();
  getRIs();
  getPLAs();
  if(!$scope.template.dri) {
    $scope.template.dri = new Array();
  }
  if(!$scope.template.action) {
    $scope.template.action = new Array();
  }
  if(!$scope.template.info) {
    $scope.template.info = new Array();
  }
  
  function getPLAs() {
    MetadataService.getPLAs().
    success(function(data) {
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
      for (var p in sortedPLAs) {
        $scope.plaList.push(p);
      }      
    }).
    error(function(data) {
      console.log("Error: "+data.message);
    });
  }
  
  function getRIs() {
    MetadataService.getRIs().
    success(function(data) {
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
      for (var p in sortedRIs) {
        $scope.riList.push(p);
      }      
    }).
    error(function(data) {
      console.log("Error: "+data.message);
    });
  }
  
  
  $scope.changed = function(vs) {
    return !angular.equals(vs, original);
  };
  
  $scope.add = function(item, list) {
    if(list.indexOf(item) < 0) {
      list.push(item);
    };    
  };
  
  $scope.validLists = function() {
    return ($scope.template.dri.length > 0) && ($scope.template.action.length > 0) && ($scope.template.info.length > 0);
  };
  
  $scope.remove = function(idx, list) {
    list.splice(idx, 1);
  };
  
  $scope.save = function(vs) {
    save(vs);
    $modalInstance.close();
  };
  
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
VarFormCtrl.$inject = ['$scope', '$modalInstance', 'VarService', 'MetadataService', 'varSet', 'title', 'save'];

function HostCtrl($scope, $location, HostService, $modal) {
  $scope.hostdb = {};
  $scope.hostdb.hosts = new Array();
  getHosts();
  
  $scope.refresh = function() {
    getHosts();
  };
  
  $scope.delete = function(host) {
    var warning = "Are you sure you want to delete Host:\n"+host.Alias;
    var id = host._id;
    if(window.confirm(warning)) {
      deleteHost(id);
    };
  };
  
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

function GenerateCtrl($scope, $filter, $http, MessageService, HostService, VarService) {
  $scope.generate = {};
  $scope.generate.messages = new Array();
  $scope.generate.hosts = new Array();
  $scope.generate.varsets = new Array();
  $scope.oneAtATime = true;
  $scope.isopen = {};
  $scope.isopen.var = false;
  $scope.isopen.msgs = false;
  $scope.isopen.host = false;
  $scope.generate.se = true;
  getMessages();
  getHosts();
  getVarSets();
  
  function isSelected(obj) {
    if(obj.selected === true) {
      return true;
    } else {
      return false;
    }
  }
  
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
  
  $scope.$watch('generate.se', function(newvalue, oldvalue) {
    $scope.generateBtnText = newvalue ? 'Send Email' : 'Download';
  });
  
  $scope.$watch('generate.selectAllMsgs', function(newvalue, oldvalue) {
    alterFilteredSelect($scope.generate.messages, $scope.generate.msgSearch, newvalue);
  });
  
  $scope.$watch('generate.selectAllHosts', function(newvalue, oldvalue) {
    alterFilteredSelect($scope.generate.hosts, $scope.generate.hostSearch, newvalue);
  });  
  
  function alterFilteredSelect(items, filter, value) {
    var f = $filter('filter'); 
    var selection = f(items,filter);
    for(var i = 0; i < selection.length; i++) {
      selection[i].selected = value;
    }
  }
  
  function getMessages() {
    MessageService.getMessages().
    success(function(data) {
      $scope.generate.messages = data;
    }).
    error(function(data) {
      $scope.generate.status = "Error getting messages: " + data.message;
    });
  };
  
  function getHosts() {
    HostService.getHosts().
    success(function(data){
      $scope.generate.hosts = data;
    }).
    error(function(data){
      $scope.generate.status = "Error getting hosts: " + data.message;
    });
  };
  
  function getVarSets() {
    VarService.getVarSets().
    success(function(data){
      $scope.generate.varsets = data;
    }).
    error(function(data){
      $scope.generate.status = "Error getting varsets: " + data.message;
    });
  };
  
  $scope.generateAction = function() {
    var data = {};
    var submitUrl = "/api/submit";
    data.email = $scope.generate.se;
    data.hosts = new Array();
    if(data.email) {
      data.hosts = $scope.generate.hosts.filter(isSelected);
      if($scope.generate.timeout && $scope.generate.timeout > 0) {
        data.timeout = $scope.generate.timeout;
      } else {
        data.timeout = 1;
      };

    }
    data.messages = $scope.generate.messages.filter(isSelected);
    data.varset = $scope.generate.varset;
    $http({url: submitUrl, data: JSON.stringify(data), method: "POST"}).success(function(data, status, headers, config){ }).error(function(data, status, headers, config){ });    
  };  
};
GenerateCtrl.$inject = ['$scope', '$filter', '$http', 'MessageService', 'HostService', 'VarService'];

function ProcessCtrl($scope, $timeout, $location, ProcessService) {
  $scope.processes = [];
  getProcesses();
  areProcesses();
  
  function areProcesses() {
    $scope.processExists =  $scope.processes.length > 0;
  };
  
  $scope.getPercentage = function(proc) {
    return 100 * (proc.completed / proc.total);
  };
  
  $scope.kill = function(process) {
    var warning = "Are you sure you want to stop sending to:\n"+process.to;
    var pid = process.pid;
    if(window.confirm(warning)) {
      killProcess(pid);
    };    
  };
  
  function killProcess(pid) {
    ProcessService.killProcess(pid).
    success(function(data){
    }).
    error(function(data){
      console.log(data);
    });
  }; 
  
  function getProcesses() {
    ProcessService.getProcesses().
    success(function(data){
      if(data) {
        $scope.processes = data;
      }
    }).
    error(function(data){
      console.log(data);
    });
  };
  function isActive() {
        return '/process' === $location.path();
  };
  function tick() {
    getProcesses();
    areProcesses();
    if(isActive()) {
      $timeout(tick, 1000);
    }
  };
  tick();
};
ProcessCtrl.$inject = ['$scope', '$timeout', '$location', 'ProcessService'];
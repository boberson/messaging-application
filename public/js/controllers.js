'use strict';

/* Controllers */
function ManageCtrl($scope, MessageService, Message) {
  $scope.manage = {};
  $scope.manage.messages;
  $scope.manage.status;
  
  $scope.edit = function(message) {
    Message.message = message;
  };
  
  getMessages();
  function getMessages() {
    MessageService.getMessages().
    success(function(data) {
      $scope.manage.messages = data;
    }).
    error(function(data) {
      $scope.status = "Error getting messages: " + data.message;
    });
  };
  
}
ManageCtrl.$inject = ['$scope', 'MessageService', 'Message' ];

function HeaderCtrl($scope, $location) {
  $scope.isActive = function(viewLocation) {
        return viewLocation === $location.path();
  };
}

function AppCtrl($scope, $http) {
  $http({method: 'GET', url: '/api/name'}).
  success(function(data, status, headers, config) {
    $scope.name = data.name;
  }).
  error(function(data, status, headers, config) {
    $scope.name = 'Error!';
  });
}

function CreateCtrl($scope, $location) {
  $scope.cancel = function() {
    $location.path('#/home');
  };

  $scope.save = function(msg) {
    $location.path('#/home');
  };
  
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
  
}

function EditCtrl($scope, $location, Message) {
  $scope.message = Message.message;
      if(typeof $scope.message === 'undefined' || $scope.message === {}) {
          alert("No message selected to edit please click edit on the desired message!");
          $location.path('#/home');
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
          $location.path('#/home');
      };
      
      $scope.save = function(msg) {
          $location.path('#/home');
      };
}
EditCtrl.$inject = ['$scope', '$location', 'Message'];
function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];

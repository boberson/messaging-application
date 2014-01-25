'use strict';

/* Controllers */
function ManageCtrl($scope, $http) {
  $scope.manage = {};
  $http({method: 'GET', url: '/api/messages'}).
  success(function(data, status, headers, config) {
    $scope.manage.messages = data;
    console.log(data);
  }).
  error(function(data, status, headers, config) {
    console.log("Error retrieving messages.");
  });
}

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

function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];

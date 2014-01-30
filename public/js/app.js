  'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives','ngRoute', 'ui.bootstrap']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/message', {templateUrl: 'partial/message', controller: MessageCtrl});
    $routeProvider.when('/host', {templateUrl: 'partial/hostdb', controller: HostCtrl});
    $routeProvider.otherwise({redirectTo: '/message'});
    $locationProvider.html5Mode(true);
  }]);
  'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives','ngRoute', 'ui.bootstrap']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/message', {templateUrl: 'partial/message', controller: MessageCtrl});
    $routeProvider.when('/var', {templateUrl: 'partial/var', controller: VarCtrl});
    $routeProvider.when('/host', {templateUrl: 'partial/hostdb', controller: HostCtrl});
    $routeProvider.when('/generate', {templateUrl: 'partial/generate', controller: GenerateCtrl});
    $routeProvider.otherwise({redirectTo: '/message'});
    $locationProvider.html5Mode(true);
  }]);
'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives','ngRoute']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/manage', {templateUrl: 'partial/manage', controller: ManageCtrl});
    $routeProvider.when('/create', {templateUrl: 'partial/create', controller: CreateCtrl});
    $routeProvider.otherwise({redirectTo: '/manage'});
    $locationProvider.html5Mode(true);
  }]);
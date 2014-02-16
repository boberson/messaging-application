'use strict';

/* Directives */


var directives = angular.module('myApp.directives', []);

directives.directive('capitalize', function() {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
           var capitalized = inputValue.toUpperCase();
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }         
            return capitalized;
         };
         modelCtrl.$parsers.push(capitalize);
     }
   };
});
directives.directive('rrSearchBar', function() {
  return {
    restrict: 'E',
    templateUrl: "templates/searchBarTemplate.html",
    scope: {
      original: '=',
      filtered: '='
    },
    controller: function($scope, $filter) {
      $scope.newSearchItem = "";
      $scope.filters = [];
      $scope.keyevent = function(event) {
        if(event.keyCode === 13) {
          addSI();
          $scope.newSearchItem = "";
        }
      };
      $scope.removeSI = function(index) {
        $scope.filters.splice(index, 1);
      };
      
      var addSI = function() {
        if($scope.filters.indexOf($scope.newSearchItem) < 0) {
          $scope.filters.push($scope.newSearchItem);
        }
      };
      
      $scope.$watchCollection('filters', function(newValue, oldValue) {
        filterCollection(newValue);
      });
      
      $scope.$watchCollection('original', function(newValue, oldValue){
        filterCollection($scope.filters);
      });
      
      function filterCollection(filters) {
        var f = $filter('filter');
        $scope.filtered = $scope.original;
        if(filters.length > 0) {
          for(var sIdx in filters) {
            $scope.filtered = f($scope.filtered, filters[sIdx]);
          };
        };    
      };
    }
  };
  
});

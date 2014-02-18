/* 
 * Copyright (c) 2014, rober_000
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
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

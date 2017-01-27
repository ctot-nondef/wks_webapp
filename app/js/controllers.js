'use strict';

/* Controllers */

var WKSControllers = angular.module('WKSControllers', ['MongoDBservices','GeoNamesServices']);
WKSControllers
.controller('WKSStart',['$scope','$http', '$state', '$stateParams', 'mongorest', function($scope, $http, $state, $stateParams, mongorest){
  $scope.Model = {};
}])
.controller('WKSNav', ['$scope', '$timeout', '$mdSidenav', '$http', '$log', function ($scope, $timeout, $mdSidenav, $http, $log) {
    $scope.Model = {};
    $http.get('static/menu.json').then(
      function(res){
        $scope.Model.Menu = res.data;
      },
      function(err){ console.log('err: ', err); }
    );
    $scope.toggleLeft = function () {
      if(!$mdSidenav('sidenav').isOpen()) {$('#sidebar').addClass('open');}
      else {$('#sidebar').removeClass('open');}
      $mdSidenav('sidenav').toggle();
    };
}])
.controller('WKSTypeList',['$scope','$http', '$state', '$stateParams', 'mongorest', function($scope, $http, $state, $stateParams, mongorest){
  //********* DECLARATIVE PART *********************************************
    $scope.Model = {};
    $scope.uiview = {"menuOpen":false};
    $scope.selected = [];
    $scope.Model.Page = 1;
  //********* END OF DECLARATIVE PART **************************************
    var Promise = mongorest.getColl('wkstest','schemas');
    Promise.then(function(res){
      $scope.schemas = res.data;
      console.log(res);
    })
}])
.controller('WKSSingleType',['$scope','$http', '$state', '$stateParams', 'mongorest', function($scope, $http, $state, $stateParams, mongorest){
  //********* DECLARATIVE PART *********************************************
    $scope.Model = {};
    $scope.uiview = {"menuOpen":false};
    $scope.isArray = angular.isArray;
  //********* END OF DECLARATIVE PART **************************************
    var Promise = mongorest.getDoc('wkstest','schemas',$stateParams.id);
    Promise.then(function(res){
      $scope.schema = res.data;
      console.log(res);
    })
}])

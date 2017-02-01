'use strict';

var mongooseTypes =  [
  'String',
  'Number',
  'Date',
  'Buffer',
  'Boolean',
  'Mixed',
  'ObjectID',
  'Array'
];

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
.controller('WKSSingleType',['$scope','$http', '$state', '$stateParams', 'mongorest', '$mdDialog', function($scope, $http, $state, $stateParams, mongorest, $mdDialog){
  //********* DECLARATIVE PART *********************************************
    $scope.Model = {};
    $scope.status = "";
    $scope.uiview = {"menuOpen":false};
    $scope.isArray = angular.isArray;
    $scope.arefs = [];
    $scope.atypes = mongooseTypes;
  //********* END OF DECLARATIVE PART **************************************
    var SPromise = mongorest.getDoc('wkstest','schemas',$stateParams.id);
    SPromise.then(function(res){
      $scope.checkProps(res.data.properties);
      $scope.schema = res.data;
      var TPromise = mongorest.getColl('wkstest','schemas');
      TPromise.then(function(res){
        res.data.forEach(function(t){
          if(t.title!=$scope.schema.title) $scope.arefs.push(t.title);
        });
      });
    });
  //********* Helper Functions *********************************************
    $scope.checkProps = function(res){
      for(var key in res){
        //simple property
        if(res[key].type) {
          console.log('simple', key);
        }
        //repeatable property
        else if($scope.isArray(res[key]) && res[key][0].type) {
          console.log('repeatable', key);
        }
        //nested object
        else if(!$scope.isArray(res[key]) && !res[key].type){
          console.log('simple object', key);
          $scope.checkProps(res[key]);
        }
        //repeatable nested object
        else if($scope.isArray(res[key]) && !res[key][0].type){
          console.log('repeatable object', key);
          $scope.checkProps(res[key][0]);
        }
      }
    };
  //********* Edit Functions *********************************************
    $scope.editName = function(ev, prop, value){
      console.log(value);
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.prompt()
        .title('Rename Property "' + prop + '"')
        .textContent('')
        .placeholder('Dog name')
        .ariaLabel('Dog name')
        .initialValue(prop)
        .targetEvent(ev)
        .ok('Submit')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function(result) {
        $scope.status = 'You decided to name your dog ' + result + '.';
      }, function() {
        $scope.status = 'You didn\'t name your dog.';
      });
    }
}])

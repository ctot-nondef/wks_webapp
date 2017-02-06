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
      $scope.schemaMap = $scope.mapSchema(res.data.properties);
      $scope.schema = res.data;
      console.log($scope.schemaMap);
      console.log($scope.parseObject($scope.schemaMap));
      var TPromise = mongorest.getColl('wkstest','schemas');
      TPromise.then(function(res){
        res.data.forEach(function(t){
          if(t.title!=$scope.schema.title) $scope.arefs.push(t.title);
        });
      });
    });
  //********* Helper Functions *********************************************
    $scope.mapSchema = function(res){
      var m = new Map();
      for(var key in res){
        //simple or repeatable property
        if(res[key].type || ($scope.isArray(res[key]) && res[key][0].type)) {
          m.set(key,res[key]);
        }
        //nested object
        else if(!$scope.isArray(res[key]) && !res[key].type){
          m.set(key,$scope.mapSchema(res[key]));
        }
        //repeatable nested object
        else if($scope.isArray(res[key]) && !res[key][0].type){
          m.set(key,[$scope.mapSchema(res[key][0])]);
        }
      }
      return m;
    };
    $scope.parseObject = function(map){
      var o = {}
      map.forEach(function(value, key, map){
        //simple or repeatable property
        if(value.type || ($scope.isArray(value) && value[0].type)) {
          o[key] = value;
        }
        //nested object
        else if(!$scope.isArray(value) && !value.type){
          o[key] = $scope.parseObject(value);
        }
        //repeatable nested object
        else if($scope.isArray(value) && !value[0].type){
          o[key] = [$scope.parseObject(value[0])];
        }
      });
      return o;
    }
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

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
.controller('WKSSingleType',['$scope','$http', '$state', '$stateParams', 'mongorest', '$mdDialog', 'mongoose', function($scope, $http, $state, $stateParams, mongorest, $mdDialog, mongoose){
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
      $scope.schemaMap = mongoose.mapSchema(res.data.properties);
      $scope.schema = res.data;
      console.log($scope.schemaMap);
      console.log(mongoose.parseObject($scope.schemaMap));
      var TPromise = mongorest.getColl('wkstest','schemas');
      TPromise.then(function(res){
        res.data.forEach(function(t){
          if(t.title!=$scope.schema.title) $scope.arefs.push(t.title);
        });
      });
    });
  //********* Helper Functions *********************************************
  //********* Edit Functions *********************************************
    $scope.editName = function(ev, prop, value, i){
      console.log(ev, prop, value, i);
      var path = $scope.fetchProp(ev.currentTarget);
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
        $scope.writeProp(path, result);
      }, function() {

      });
    }
    $scope.fetchProp = function(el){
      var path = [];
      var top = false;
      var cel = el;
      do {
        if(cel.id == "schema") top = true;
        else if(cel.id == "") cel = cel.parentElement;
        else {
          path.push(cel.id);
          cel = cel.parentElement;
        }
      } while (!top)
      return path.reverse();
    }
    $scope.writeProp = function(path, val){
      var i = 1;
      path.forEach(function(p){

        if(i=path.length){

        }
        i++;
      });
      $scope.schema = mongoose.parseObject($scope.schemaMap);
    }
}])

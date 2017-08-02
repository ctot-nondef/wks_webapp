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
<<<<<<< HEAD
    //********* Auth Functions *********************************************
    $scope.loginDialog = function($event) {
      $mdDialog.show({
      controller: function ($timeout, $q, $scope, $mdDialog, $rootScope) {
          var logon = this;
          $scope.answer = function() {
            console.log(logon);
            var a = mongorest.restLogin(logon.username, logon.password);
            a.then(function(res){
              console.log($scope.$parent);
              $rootScope.auth = mongorest.auth();
              console.log($scope.auth);
              $mdDialog.hide();
            },
            function(err){
              console.log(err);
            });
          };
          $scope.cancel = function() {
            $mdDialog.cancel();
          }
        },
        controllerAs: 'logon',
        templateUrl: 'partials/logonscreen.html',
        parent: angular.element(document.body),
        targetEvent: $event,
        clickOutsideToClose:true,
        locals: {parent: $scope},
      });
    };
    $scope.logout = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
            .title('Logout')
            .textContent('Really logout User '+mongorest.s.session.user +'?')
            .ariaLabel('logout')
            .targetEvent(ev)  
            .ok('Go Ahead!')
            .cancel('Stay here');
      $mdDialog.show(confirm).then(function() {
        mongorest.logout();
        $rootScope.auth = mongorest.auth();
        $state.go('start');
      }, function() {
      });
    };
    //********* SideMenu Functions *********************************************
=======
>>>>>>> master
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
    $scope.arefs = [];
    $scope.atypes = mongooseTypes;
  //********* END OF DECLARATIVE PART **************************************
    var SPromise = mongorest.getDoc('wkstest','schemas',$stateParams.id);
    SPromise.then(function(res){
      $scope.schema = res.data;
      var TPromise = mongorest.getColl('wkstest','schemas');
      TPromise.then(function(res){
        res.data.forEach(function(t){
          if(t.title!=$scope.schema.title) $scope.arefs.push(t.title);
        });
      });
    });
}])

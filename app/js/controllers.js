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
.controller('WKSNav', ['$scope', '$timeout', '$mdSidenav', '$http', '$log', 'mongorest','$mdDialog', '$rootScope', function ($scope, $timeout, $mdSidenav, $http, $log, mongorest, $mdDialog, $rootScope) {
    $scope.Model = {};
    $rootScope.auth = mongorest.auth();
    // we'll need to check for a valid token right away in order to load the right view and menu options
    $http.get('static/menu.json').then(
      function(res){
        $scope.Model.Menu = res.data;
      },
      function(err){ console.log('err: ', err); }
    );
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
      }, function() {
      });
    };
    //********* SideMenu Functions *********************************************
    $scope.toggleLeft = function () {
      if(!$mdSidenav('sidenav').isOpen()) {$('#sidebar').addClass('open');}
      else {$('#sidebar').removeClass('open');}
      $mdSidenav('sidenav').toggle();
    };
}])
.controller('WKSSettings',['$scope','$http', '$state', '$stateParams', 'mongorest', function($scope, $http, $state, $stateParams, mongorest){
  $scope.Model = {};
  $scope.selectedIndex = 0;
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
      $scope.schemaMap = mongoose.mapSchema(JSON.parse(JSON.stringify(res.data.properties)),[]);
      $scope.schema = JSON.parse(JSON.stringify(res.data));
      console.log($scope.schemaMap);
      var TPromise = mongorest.getColl('wkstest','schemas');
      TPromise.then(function(res){
        res.data.forEach(function(t){
          if(t.title!=$scope.schema.title) $scope.arefs.push(t.title);
        });
      });
    });
  //********* Helper Functions *********************************************
    $scope.fetchPath = function(el){
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
      } while (!top);
      return path.reverse();
    }
  //********* Edit Functions *********************************************
    $scope.editName = function(ev, prop, value, i){
      console.log(ev, prop, value, i);
      var path = $scope.fetchPath(ev.currentTarget);
      var confirm = $mdDialog.prompt()
        .title('Rename Property "' + prop + '"')
        .textContent('')
        .placeholder('property name')
        .ariaLabel('property name')
        .initialValue(prop)
        .targetEvent(ev)
        .ok('Submit')
        .cancel('Cancel');
      $mdDialog.show(confirm).then(function(result) {
        $scope.schemaMap = $scope.writeName($scope.schemaMap, path, result);
        $scope.typeForm.$setDirty();
      }, function() {

      });
    }
    $scope.writeName = function(map, path, val){
      var nm = {};
      if(path.length == 1) {
        for(var p in map){
          if(p == path[0]) nm[val] = map[p];
          else if(p != path[0]) nm[p] = map[p];
        };
      }
      else {
        var s = path.slice(1);
        for(var p in map){
          if(p == path[0]) nm[p] = $scope.writeName(map[path[0]],s,val);
          else if(p != path[0]) nm[p] = map[p];
        };
      }
      return nm;
    }
    $scope.reset = function(){
      $state.reload();
    }
    $scope.save = function(){
      console.log(schemaMap);
    }
}])
.controller('WKSUsers',['$scope','$http', '$state', '$stateParams', 'mongorest', '$mdDialog', 'mongoose', function($scope, $http, $state, $stateParams, mongorest, $mdDialog, mongoose){
  //********* DECLARATIVE PART *********************************************
    $scope.Model = {};
    $scope.uiview = {"menuOpen":false};
    $scope.selected = [];
    $scope.Model.Page = 1;
  //********* END OF DECLARATIVE PART **************************************
    var Promise = mongorest.getColl('auth','users');
    Promise.then(function(res){
      $scope.users = res.data;
      console.log(res);
    })
}])
.controller('WKSSingleUser',['$scope','$http', '$state', '$stateParams', 'mongorest', '$mdDialog', 'mongoose', function($scope, $http, $state, $stateParams, mongorest, $mdDialog, mongoose){
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
      $scope.schemaMap = mongoose.mapSchema(JSON.parse(JSON.stringify(res.data.properties)),[]);
      $scope.schema = JSON.parse(JSON.stringify(res.data));
      console.log($scope.schemaMap);
      var TPromise = mongorest.getColl('wkstest','schemas');
      TPromise.then(function(res){
        res.data.forEach(function(t){
          if(t.title!=$scope.schema.title) $scope.arefs.push(t.title);
        });
      });
    });
}])

'use strict';

var ssFields = {
  "Object Number":"object_number",
  "Translation Text":"inscription.translation",
  "Language":"inscription.language",
  "Archeological Site":"production.place"
}

/* Controllers */

var WKSControllers = angular.module('WKSControllers', ['MongoDBservices','GeoNamesServices']);

WKSControllers
.controller('WKSStart',['$scope','$http', '$state', '$stateParams', 'mongorest', function($scope, $http, $state, $stateParams, mongorest){
  $scope.Model = {};
  var test = mongorest.getColl('wkstest','schemas');
  console.log(test);
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
.controller('WKSTypes',['$scope','$http', '$state', '$stateParams', 'wksrest', function($scope, $http, $state, $stateParams, wksrest){
  //********* DECLARATIVE PART *********************************************
    $scope.Model = {};
    $scope.uiview = {"menuOpen":false};
    $scope.selected = [];
    $scope.uiview.currentView = Config.currentView;
    $scope.Model.Pagesize = wksrest.pagesize;
    $scope.Model.Page = 1;
    //************************************************************************
    // when pageing
    $scope.getPage = function(a,b) {
      if (opacsearch.pagesize != b) {
        opacsearch.updateSize(b);
        $scope.promise = opacsearch.getRecordsbyIndex('collect.inf', opacsearch.history.query[$stateParams.queryID-1],"AND",undefined,[],$stateParams.pageNo);
        opacsearch.updatePage($stateParams.queryID-1, $stateParams.pageNo, $scope.promise);
        $scope.promise.then($scope.update);
      }
      else $state.go('gl.results', {queryID: $stateParams.queryID, pageNo: a});
    };
    //************************************************************************
    // when sorting
    $scope.getNewOrder = function(a) {
      if(a.slice(0,1) == "-") opacsearch.updateSorting('descending',a.slice(1));
      else if(a.slice(0,1) != "-") opacsearch.updateSorting('ascending',a);
      $scope.promise = opacsearch.getRecordsbyIndex('collect.inf', opacsearch.history.query[$stateParams.queryID-1],"AND",undefined,[],$stateParams.pageNo);
      opacsearch.updatePage($stateParams.queryID-1, $stateParams.pageNo, $scope.promise);
      $scope.promise.then($scope.update);
    };
    //************************************************************************
    // generic page update
    $scope.update = function(res) {
      console.log(res);
      $scope.Model.Total = res.data.adlibJSON.diagnostic.hits;
      $scope.Model.Page = $stateParams.pageNo;
      $scope.Model.Pagesize = opacsearch.pagesize;
      $scope.Model.Result = res.data.adlibJSON.recordList.record;
      console.log($scope.Model.Result);
    };
    //************************************************************************
    // UI-switching
    $scope.onList = function(){
      $scope.uiview.currentView = 'list';
      Config.currentView = 'list';
    };
    $scope.onGrid = function(){
      $scope.uiview.currentView = 'grid';
      Config.currentView = 'grid';
    };
    $scope.vmToggle = function(){
      console.log($scope.uiview.menuOpen);
      if($scope.uiview.menuOpen) $scope.uiview.menuOpen=false;
      else $scope.uiview.menuOpen=true;
    }
  //********* END OF DECLARATIVE PART **************************************
  //************************************************************************
  // if the url is fucked up, go back to search
  if (!$stateParams.queryID || !$stateParams.pageNo) $state.go('wks.start');
  //************************************************************************
  // if we got the page in question already in the history, take it, otherwise go get it and cache it
  if(opacsearch.history.result[$stateParams.queryID-1] && opacsearch.history.result[$stateParams.queryID-1][$stateParams.pageNo] && opacsearch.history.result[$stateParams.queryID-1][$stateParams.pageNo]['$$state'] && opacsearch.history.result[$stateParams.queryID-1][$stateParams.pageNo]['$$state']['status'] == 1) {
    console.log(opacsearch.history.result[$stateParams.queryID-1]);
    $scope.promise = opacsearch.history.result[$stateParams.queryID-1][$stateParams.pageNo];
  }
  else {
    $scope.promise = opacsearch.getRecordsbyIndex('collect.inf', opacsearch.history.query[$stateParams.queryID-1],"AND",undefined,[],$stateParams.pageNo);
    opacsearch.updatePage($stateParams.queryID-1, $stateParams.pageNo, $scope.promise);
  }
  $scope.promise.then($scope.update);
}])

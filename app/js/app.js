'use strict';

/* App Module */

var WKSApp = angular.module('WKSApp', [
  'ui.router',
  'ngAnimate',
  'ngSanitize',
  'ngMaterial',
  'WKSControllers',
  'WKSFilters',
  'md.data.table',
  'ui-leaflet'
]);


WKSApp.config(config);
function config($stateProvider, $urlRouterProvider, $locationProvider, $compileProvider,$logProvider,$mdThemingProvider, $httpProvider){
  $compileProvider.debugInfoEnabled(true);
  $logProvider.debugEnabled(true);
  $urlRouterProvider.otherwise('/');
    $stateProvider
    /////////////////
    // start state //
    /////////////////
    .state('start',{
        url: '/',
        views: {
            'navbar': {
                templateUrl: 'partials/navbar.html',
                controller: 'WKSNav'
            },
            'content@': {
                templateUrl: 'partials/start.html',
                controller: 'WKSStart'
            }
        }
    })
    ////////////////////////////////////////////
    // root  state - only invokes navbar      //
    ////////////////////////////////////////////
    .state('wks',{
        url: '/wks',
        views: {
            'navbar': {
                templateUrl: 'partials/navbar.html',
                controller: 'WKSNav'
            }
        }
    })
    ////////////////////////////////////////////////////////
    // various content states, views ref to index.html    //
    ////////////////////////////////////////////////////////
    .state('wks.types',{
        url: '/types',
        views: {
            'content@': {
                templateUrl: 'partials/types.html',
                controller: 'WKSTypeList'
            }
        }
    })
    .state('wks.singletype',{
        url: '/stype/:id',
        views: {
            'content@': {
                templateUrl: 'partials/stype.html',
                controller: 'WKSSingleType'
            }
        }
    })
    $locationProvider.html5Mode(true);
    $mdThemingProvider.theme('default')
        .primaryPalette('blue', {
          'default': '800',
          'hue-1': '600',
          'hue-2': '700',
          'hue-3': 'A200'
        })
        .accentPalette('red', {
          'default': '800'
        });
    $mdThemingProvider.theme('docs-dark')
     .primaryPalette('yellow')
     .dark();
     //Reset headers to avoid OPTIONS request (aka preflight)
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
}
WKSApp.run(['$rootScope', '$state', '$stateParams', 'mongorest', function($rootScope, $state, $stateParams, mongorest){
  $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams){
    $rootScope.toState = toState;
    $rootScope.toStateParams = toStateParams;
    console.log(toState);
  });
}]);

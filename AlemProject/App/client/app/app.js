'use strict';

angular.module('appApp', [
  'appApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'nvd3',
  'smart-table',
  'ui.bootstrap.datepicker',
  'ui.bootstrap.timepicker',
])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });

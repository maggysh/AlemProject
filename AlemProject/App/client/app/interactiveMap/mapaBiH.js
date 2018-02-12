/**
 * Created by Amela on 20/12/2015.
 */
'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('interactiveMap', {
        url: '/interactiveMap',
        templateUrl: 'app/interactiveMap/mapaBiH.html',
        controller: 'interactiveMapCtrl'
      });
  });

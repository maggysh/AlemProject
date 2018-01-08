/**
 * Created by Amela on 20/12/2015.
 */
'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mapa', {
        url: '/mapa',
        templateUrl: 'app/mapa/mapaBiH.html',
        controller: 'mapaCtrl'
      });
  });

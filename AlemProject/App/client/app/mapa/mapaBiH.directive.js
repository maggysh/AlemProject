'use strict';

angular.module('appApp')
  .directive('mapa', () => ({
  templateUrl: 'app/mapa/mapaBiH.html',
  restrict: 'E',
  controller: 'mapaCtrl',
  controllerAs: 'mapa'
}));


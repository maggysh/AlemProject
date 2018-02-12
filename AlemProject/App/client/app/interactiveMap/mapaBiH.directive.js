'use strict';

angular.module('appApp')
  .directive('interactivemap', () => ({
  templateUrl: 'app/interactiveMap/mapaBiH.html',
  restrict: 'E',
  controller: 'interactiveMapCtrl',
  controllerAs: 'interactivemap'
}));


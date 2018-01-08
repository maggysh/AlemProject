'use strict';

angular.module('appApp')
  .directive('graph', () => ({
  templateUrl: 'app/graph_box/graph.html',
  restrict: 'E',
  controller: 'graphController',
}));


'use strict';

angular.module('appApp')
  .directive('navbarAdmin', () => ({
  templateUrl: 'components/navbar/navbarAdmin.html',
  restrict: 'E',
  controller: 'NavbarController',
  controllerAs: 'nav'
}));

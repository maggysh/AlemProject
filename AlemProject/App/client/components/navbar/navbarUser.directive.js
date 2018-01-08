'use strict';

angular.module('appApp')
  .directive('navbarUser', () => ({
  templateUrl: 'components/navbar/navbarUser.html',
  restrict: 'E',
  controller: 'NavbarController',
  controllerAs: 'nav'
}));

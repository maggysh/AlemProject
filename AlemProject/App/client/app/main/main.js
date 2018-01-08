'use strict';

angular.module('appApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main',
        resolve:
        { "check":function($http,$location){
          $http.get('/loggedin').then(function (response) {
            if (response.data.logged == true){
              if(response.data.user.username != "admin") $location.path('/home');
              else $location.path('/admin');
            }

          });}}

      });
  });

'use strict';

angular.module('appApp')
  .controller('loggedController', function ($scope, $http, $location, $window) {

    $scope.info = [];
    //-----------------------------------------------------------------------------------------
    $scope.userInit = function(){
        $http.get('/loggedin').then(function (response) {
          $scope.info.id = response.data.user.id;
          $scope.info.name = response.data.user.ime_prezime;
      });
    };
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
  });



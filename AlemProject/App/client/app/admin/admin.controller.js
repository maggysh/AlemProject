/**
 * Created by Velid Aljic on 28.12.2015..
 */
'use strict';

angular.module('appApp')
  .controller('adminController', function ($scope, $http, $location, $window) {

    $scope.info = [];

//-----------------------------------------------------------------------------------------------------------
    $scope.addUser = function(){

      $http.post('/create/user',{name: $scope.info.name, user: $scope.info.username, pw: $scope.info.password,
      mail: $scope.info.mail, firm: $scope.info.firma})
        .then(function(response){
          // NAPISATI PORUKU DA LI JE UNOS USPJESAN ILI NE
      })

    };
//-----------------------------------------------------------------------------------------------------------
    $scope.clearAddUserForm = function(){
      $scope.info.name = '';
      $scope.info.username = '';
      $scope.info.password = '';
      $scope.info.mail = '';
      $scope.info.firma = '';
    };
//-----------------------------------------------------------------------------------------------------------

  });




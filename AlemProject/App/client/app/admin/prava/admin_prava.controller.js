/**
 * Created by Amela on 28/12/2015.
 */
'use strict';

angular.module('appApp')
  .controller('adminPravaController', function ($scope, $http, $location, $window) {

    $scope.checkbox = [];
    //--------------------------------------------------------
    $scope.popuni = function(){
      $http.get('/stanica').then(function(data){
        $scope.checkbox.stanica = data.data;
        $http.get('/api/user').then(function(user){
          $scope.checkbox.user = user.data;
        });
      });

    };
    //--------------------------------------------------------
    $scope.dajPrava = function(){

      $http.post('/api/admin/prava', {user: $scope.prava.user, stanica: $scope.prava.stanica})
        .then(function(response){
          /* NAPISATI PORUKU DA JE UNOS USPJESAN ILI NE !!!!
           */
        })
    };
    //--------------------------------------------------------


  });



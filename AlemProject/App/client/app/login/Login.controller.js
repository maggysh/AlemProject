'use strict';

angular.module('appApp')
  .controller('loginController', function ($scope, $http, $location, $window) {

    $scope.formData = {};

    //-----------------------------------------------------------------
    $scope.login = function () {

      $http.post('/login', $scope.formData).then(function (response) {

        $http.get('/loggedin').then(function (response) {
          if(!response.data.logged){
            $scope.formData.username = "";
            $scope.formData.password = "";
            $scope.errorMsg = true;
          }
          else{
            if(!response.data.logged && response.data.user.username != 'admin') {
              $location.path('/home');
            }
            else{
              $location.path('/admin');
            }
          }
        });
      });

    };
    //-----------------------------------------------------------------

});

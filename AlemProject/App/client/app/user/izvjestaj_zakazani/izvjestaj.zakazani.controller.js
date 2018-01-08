'use strict';

angular.module('appApp')
  .controller('izvjestajZakazaniController', function ($scope, $http, $location, $window, $filter) {

    $scope.pregled = [];
    $scope.pregled.stanice = [];
    $scope.pregled.id = '';
    $scope.info = [];
    //---------------------------------------------------------------------------------------------
    $scope.Init = function(){
      $http.get('/loggedin').then(function (response) {
        //$scope.info.name = response.data.user.ime_prezime;
        $scope.info.id = response.data.user.id;
        $http.get('/api/user/izvjestaj/automatski/' + $scope.info.id).then(function(data){
          $scope.pregled.stanice = data.data;
          console.log($scope.pregled.stanice);
        })
      });
    };
    $scope.Init();
    //---------------------------------------------------------------------------------------------
    $scope.novoStanje = function(value){
      //var temp = $scope.pregled.stanice[pregled.id].id;
      $http.put('/update/izvjestaj', {dnevni: $scope.dnevni, sedmicni: $scope.sedmicni,  mjesecni: $scope.mjesecni,
        user: $scope.info.id, stanica: value}).then(function(response){
        console.log(response);
      });
    }
    //---------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------



  });

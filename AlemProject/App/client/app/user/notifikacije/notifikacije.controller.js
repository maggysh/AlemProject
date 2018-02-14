'use strict';

angular.module('appApp')
  .controller('notifikacijeController', function ($scope, $http, $location, $window, $filter) {

    $scope.info = [];
    $scope.data = [];
    $scope.notifikacije = [];
    $scope.notifikacije.stanica = [];
    $scope.notifikacije.senzori = [];
    $scope.notifikacije.indeks = [];
    //-----------------------------------------------------------------------------------------
    $scope.Init = function(){

      $http.get('/loggedin').then(function (response) {
        //$scope.info.name = response.data.user.ime_prezime;
        $scope.info.id = response.data.user.id;
        var jsonObj = [];
        $http.get('/api/notifikacije/' + $scope.info.id).then(function(data){

          angular.forEach(data.data, function(value, key){
            //console.log(value);
            $scope.notifikacije.stanica[key] = {
              "id": value.stanica.id,
              "Naziv": value.stanica.Naziv,
              "Kod_stanice": value.stanica.Kod_stanice
            };
            jsonObj.push(value.senzori);
            console.log($scope.notifikacije.senzori[key]);
           /* $scope.notifikacije.senzori[key] = {
              "id": value.senzori.id,
              "Kod_senzora": value.senzori.Kod_senzora
            };*/
            console.log($scope.notifikacije.stanica);
            console.log($scope.notifikacije.senzori);
            console.log("-------------------------")
          });

        });
        $scope.notifikacije.senzori = jsonObj;
      });

    };
    //-----------------------------------------------------------------------------------------
    /////////////
    $scope.Init();
    //////////////
    //-----------------------------------------------------------------------------------------
    $scope.noviMaxMin = function(){
      $http.put('/update/notifikacije', {max: $scope.max, min: $scope.min,
      user: $scope.info.id, senzor: $scope.notifikacije.senzori[$scope.notifikacije.indeks.stanica][$scope.notifikacije.indeks.senzor].id}).then(function(response){
      });
      alert("Uspješno dodano!");
    }
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------

    //---------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------

  });

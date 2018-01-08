/**
 * Created by Amela on 28/12/2015.
 */
'use strict';

angular.module('appApp')
  .controller('StanicaDodavanjeCtrl', function ($scope, $http, $location, $window) {

    $scope.StanicaDodavanje = [];

    //--------------------------------------------------------
    $scope.initStanicaDodavanje = function(){
      $http.get('/tip_stanice').then(function(data){
        $scope.StanicaDodavanjeData = data.data;
      });
    };
    //--------------------------------------------------------
    $scope.addStanicaDodavanje = function(){
      $http.post('/create/stanica', {naziv: $scope.StanicaDodavanje.naziv, kod: $scope.StanicaDodavanje.kod,
        sirina: $scope.StanicaDodavanje.sirina,
        duzina: $scope.StanicaDodavanje.duzina, stanicatip: $scope.StanicaDodavanje.Stip}).then(function(response){
        //PORUKA O USPJESNOSI DODAVANJA
      });
    };
    //--------------------------------------------------------
    $scope.clearStanicaDodavanje = function(){
      $scope.StanicaDodavanje.naziv = '';
      $scope.StanicaDodavanje.kod = '';
      $scope.StanicaDodavanje.sirina = '';
      $scope.StanicaDodavanje.duzina = '';
      $scope.StanicaDodavanje.Stip = '';
    };
    //-----------------------------------------------------------------------------------------------------------

  });



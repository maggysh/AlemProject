/**
 * Created by Amela on 28/12/2015.
 */
'use strict';

angular.module('appApp')
  .controller('StanicaBrisanjeCtrl', function ($scope, $http, $location, $window) {


    //--------------------------------------------------------
    $scope.initStanicaBrisanje = function(){
      $http.get('/stanica').then(function(data){
        $scope.StanicaBrisanjeData = data.data;
      });
    };
    //--------------------------------------------------------
    $scope.deleteStanicaBrisanje = function(idStanice){
      $http.delete('/delete/stanica/' + idStanice).then(function(response){
      });
    };
    //--------------------------------------------------------
    $scope.removeItemStanica = function removeItem(row) {
      var index = $scope.StanicaBrisanjeData.indexOf(row);
      if (index !== -1) {
        $scope.StanicaBrisanjeData.splice(index, 1);
      }
    };
    //--------------------------------------------------------
    $scope.updateStanica = function(stanica){
      $http.put('/update/stanica', {id: stanica.id, naziv: stanica.Naziv, kod: stanica.Kod_stanice,
      sirina: stanica.Geo_sirina, duzina: stanica.Geo_duzina}).then(function(response){
      });
    };
    //--------------------------------------------------------

  });



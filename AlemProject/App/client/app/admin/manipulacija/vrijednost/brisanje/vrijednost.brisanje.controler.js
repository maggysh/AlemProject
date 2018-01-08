/**
 * Created by Amela on 28/12/2015.
 */
'use strict';

angular.module('appApp')
  .controller('VrijednostBrisanjeCtrl', function ($scope, $http, $location, $window) {

    /*$scope.VrijednostBrisanje =[];
    $scope.VrijednostBrisanje.vrijednosti = [];
    $scope.VrijednostBrisanje.senzori = [];
    $scope.VrijednostBrisanje.stanice = [];
    $scope.VrijednostBrisanje.indeks = [];*/
    $scope.rowCollection = [];
    $scope.displayedCollection = [];

    //--------------------------------------------------------
    $scope.initVrijednostBrisanje = function(){

      $http.get('/api/admin/brisanje/vrijednost/data').then(function(data){

        angular.forEach(data.data, function(value, key){

          $scope.rowCollection.push({
            "id": value.id,
            "Vrijednost": value.Vrijednost,
            "Datum": value.Datum,
            "Kod_senzora": value.Senzor.Kod_senzora,
            "Tip_senzora": value.Senzor.Tip_senzora.Tip_Senzora,
            "Naziv": value.Senzor.Stanica.Naziv,
            "Kod_stanice": value.Senzor.Stanica.Kod_stanice
          });

        });
          //onsole.log($scope.VrijednostBrisanje.vrijednosti);
      });
        $scope.displayedCollection = [].concat($scope.rowCollection);
    };

    //--------------------------------------------------------
    $scope.deleteVrijednostBrisanje = function(idVrijednosti){
      $http.delete('/delete/vrijednost/' + idVrijednosti).then(function(response){
      });
    };
    //--------------------------------------------------------
    $scope.removeItemVrijednost = function removeItemVrijednost(row) {
      /*var index = $scope.rowCollection.indexOf(row);
      if (index !== -1) {
        $scope.rowCollection.splice(index, 1);
      }*/

      var index = $scope.displayedCollection.indexOf(row);
      if (index !== -1) {
        $scope.displayedCollection.splice(index, 1);
      }
    };
    //--------------------------------------------------------
    $scope.updateVrijednost = function(row){
      $http.put('/update/vrijednost', {id: row.id, vrijednost: row.Vrijednost}).then(function(response){
      });
    }
    //--------------------------------------------------------

  });



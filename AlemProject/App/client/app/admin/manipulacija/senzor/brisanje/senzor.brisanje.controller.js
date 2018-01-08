/**
 * Created by Amela on 28/12/2015.
 */
'use strict';

angular.module('appApp')
  .controller('SenzorBrisanjeCtrl', function ($scope, $http, $location, $window) {

    $scope.rowCollection = [];
    $scope.displayedCollection = [];
    $scope.proba = [];

    //--------------------------------------------------------
    $scope.initSenzorBrisanje = function(){


      $http.get('/api/admin/brisanje/senzor/data').then(function(data){

         angular.forEach(data.data, function(value, key){

           angular.forEach(value.senzori, function(entry){

             $scope.rowCollection.push({
               "id": entry.id,
               "Naziv": value.stanica,
               "Kod_senzora": entry.Kod_senzora
             });

            });

         });

      });
      //console.log($scope.rowCollection);
      $scope.displayedCollection = [].concat($scope.rowCollection);
    };

    //--------------------------------------------------------
    $scope.deleteSenzorBrisanje = function(idSenzora){
      $http.delete('/delete/senzor/' + idSenzora).then(function(response){
      });
    };
    //--------------------------------------------------------
    $scope.removeItemSenzor = function removeItemSenzor(row) {
      var index = $scope.displayedCollection.indexOf(row);
      if (index !== -1) {
        $scope.displayedCollection.splice(index, 1);
      }

    };
      /*var index = $scope.displayedCollection.indexOf(row);
      if (index !== -1) {
        $scope.displayedCollection.splice(index, 1);
      }
    };*/
    //--------------------------------------------------------
    $scope.updateSenzor = function(row){
      $http.put('/update/senzor', {id: row.id, kod: row.Kod_senzora}).then(function(response){
      });
    }
    //--------------------------------------------------------

  });




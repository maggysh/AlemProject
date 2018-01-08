/**
 * Created by Amela on 28/12/2015.
 */
'use strict';

angular.module('appApp')
  .controller('SenzorDodavanjeCtrl', function ($scope, $http, $location, $window) {

    $scope.SenzorDodavanje = [];

    //--------------------------------------------------------
    $scope.initSenzorDodavanje = function(){

      $http.get('/api/admin/dodavanje/senzor').then(function(data){
        $scope.SenzorDodavanje = data.data;
      });

    };
    //--------------------------------------------------------
    $scope.addSenzorDodavanje = function(){
      $http.post('/create/senzor', {stanica: $scope.SenzorDodavanje.stanica,
      kod: $scope.SenzorDodavanje.kod, senzor: $scope.SenzorDodavanje.senzor}).then(function(response){
          //RESPONSE
      });
    };
    //--------------------------------------------------------
    $scope.clearSenzorDodavanje = function() {

      if(angular.isDefined($scope.SenzorDodavanje.stanica)){
        delete $scope.SenzorDodavanje.stanica;
      }

      if(angular.isDefined($scope.SenzorDodavanje.senzor)){
        delete $scope.SenzorDodavanje.senzor;
      }

      $scope.SenzorDodavanje.kod = '';

    };
    //-----------------------------------------------------------------------------------------------------------

  });



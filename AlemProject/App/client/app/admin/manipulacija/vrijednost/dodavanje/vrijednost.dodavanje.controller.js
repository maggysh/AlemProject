/**
 * Created by Amela on 28/12/2015.
 */
'use strict';

angular.module('appApp')
  .controller('VrijednostDodavanjeCtrl', function ($scope, $http, $location, $window, $filter) {

    /* U VrijednostDodavanje.stanica se čuvaju podaci o stanici, u VrijednostDodavanje.senzori podaci o senzoru
    zajedno sa podacima o tipu senzora. U VrijednostDodavanje.indeks se čuvaju podaci o indeksu senzora i stanice
    u comboboxovima.
    Potrebno doraditi primanje datuma.
     */


    $scope.VrijednostDodavanje =[];
    $scope.VrijednostDodavanje.stanica = [];
    $scope.VrijednostDodavanje.senzori = [];
    $scope.VrijednostDodavanje.indeks = [];

    //--------------------------------------------------------

    //--------------------------------------------------------
    $scope.initVrijednostDodavanje = function(){

      $http.get('/api/admin/dodavanje/vrijednost').then(function(data){

          angular.forEach(data.data, function(value, key){

              $scope.VrijednostDodavanje.stanica[key] = {
                "id": value.id,
                "Naziv": value.Naziv,
                "Kod_stanice": value.Kod_stanice
              };
              $scope.VrijednostDodavanje.senzori[key] = value.Senzors;
          });


      });

    };
    //--------------------------------------------------------
    $scope.addVrijednostDodavanje = function(){

      $scope.VrijednostDodavanje.datum =  $filter('date')($scope.dt, "yyyy-MM-dd") + ' ' + $filter('date')($scope.tt, "HH:mm:ss");
      //console.log($scope.VrijednostDodavanje.datum);

      $http.post('/create/vrijednost', {vrijednost: $scope.VrijednostDodavanje.vrijednost,
        datum: $scope.VrijednostDodavanje.datum,
        senzorId: $scope.VrijednostDodavanje.indeks.senzor})
        .success(function(response){
        //PORUKA O USPJESNOSI DODAVANJA
         })
        .error(function(err){
        })


    };
    //--------------------------------------------------------
    $scope.resetDropDown = function() {

      if(angular.isDefined($scope.VrijednostDodavanje.indeks.senzor)){
        delete $scope.VrijednostDodavanje.indeks.senzor;
      }

      if(angular.isDefined($scope.VrijednostDodavanje.indeks.stanica)){
        delete $scope.VrijednostDodavanje.indeks.stanica;
      }

      $scope.VrijednostDodavanje.vrijednost = '';
      //$scope.VrijednostDodavanje.datum = ''

    };
    //---------------------------------------------------------

    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
      $scope.dt = null;
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();
    $scope.maxDate = new Date(2020, 5, 22);

    $scope.open = function($event) {
      $scope.status.opened = true;
    };

    $scope.setDate = function(year, month, day) {
      $scope.dt = new Date(year, month, day);
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['yyyy-MM-dd'];
    $scope.format = $scope.formats[0];

    $scope.status = {
      opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);
    $scope.events =
      [
        {
          date: tomorrow,
          status: 'full'
        },
        {
          date: afterTomorrow,
          status: 'partially'
        }
      ];

    $scope.getDayClass = function(date, mode) {
      if (mode === 'day') {
        var dayToCheck = new Date(date).setHours(0,0,0,0);

        for (var i=0;i<$scope.events.length;i++){
          var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

          if (dayToCheck === currentDay) {
            return $scope.events[i].status;
          }
        }
      }

      return '';
    };

    //---------------------------------------------------------


  });



'use strict';
//Kontroler će se koristiti za prikazivanje svih vrijednosti na odabranoj stancii u protekla 24 sata
//Moguće je podesiti da prikaže onoliko vrijednosti koliko se unese u nekoj formi i sl.
//Zamišljen je kao graf koji bi prikazivao nedavne podatke i ne bi vukao previše podataka iz baze.
angular.module('appApp')
  .controller('pregledController', function ($scope, $http, $location, $window, $filter) {

    $scope.pregled = [];
    $scope.info = [];
    $scope.dataDnevni = [];
    //-----------------------------------------------------------------------------------------
    $scope.pregledInit = function(){
      $http.get('/loggedin').then(function (response) {
        //$scope.info.name = response.data.user.ime_prezime;
        $scope.info.id = response.data.user.id;
        $http.get('/api/user/link/' + $scope.info.id).then(function(data){
          $scope.pregled.stanice = data.data;
        })
      });
    }
    //-----------------------------------------------------------------------------------------
    $scope.osvjezi = function(id){

      //Uzimanje svih vrijednosti za svaki senzor u stanici
      var time = '';
      var jsonObj = [];
      var jsonObjValue = [];
      var color = ["#5799C7", "#FFA658", "#5E659D","#B4045F", "#5F6E72"];
      var i = 0;
      $http.get('/api/user/pregled/dnevni/' + id).then(function(data){
        $scope.pregled.dnevni = data.data;
        angular.forEach($scope.pregled.dnevni, function(value) {
          jsonObjValue = [];
          angular.forEach(value.vrijednosti, function(entry, key) {
            //temp = $filter('date')(entry.Datum, "dd.MM.yyyy") + ' ' + $filter('date')(entry.Datum, "HH:mm:ss")
            time = '';
            time = new Date(entry.Datum);
            //time = new Date($filter('date')(entry.Datum, "dd/MM/yyyy"+ ' ' + $filter('date')(entry.Datum, "HH:mm:ss")));
            if(time>$scope.pocetniDatum && time<$scope.krajnjiDatum) {
              time = time.getTime();
              jsonObjValue.push({x: time, y: entry.Vrijednost});
            }
          });
          if(jsonObjValue.length != 0){
            jsonObj.push({"key": value.senzor.Tip_senzora.Tip_Senzora, values:jsonObjValue, "color": color[i]});
            i++;
          }

        });
        $scope.pregled.dnevni=jsonObj;
      });
    };
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    $scope.options = {

      "chart": {
        "type": "lineWithFocusChart",
        "height": 650,
        //"brushExtent": [50,20],
        "margin": {
          "top": 20,
          "right": 20,
          "bottom": 40,
          "left": 35
        },
        "useInteractiveGuideline": true,
        "dispatch": {},
        "xAxis": {
          //"axisLabel": "Datum",
          tickFormat: function(d) {
            return d3.time.format('%d.%m-%H:%M')(new Date(d-3600000));
            // return d3.time.format('%d.%m.%Y - %H:%m')(new Date(new Date()+ d));
          },
          //zooming: true,
          //zoomTo:[0,15]
        },
        "x2Axis": {
          //"axisLabel": "Datum",
          tickFormat: function(d) {
            return d3.time.format('%d.%m')(new Date(d));
            // return d3.time.format('%d.%m.%Y - %H:%m')(new Date(new Date()+ d));
          },
          //x:'85%'
        },
        "yAxis": {
          //"axisLabel": "Vrijednost"
          //"axisLabelDistance": -20
        },
        "y2Axis": {
          //showMaxMin: false,
          //height: 50,
          //"axisLabel": "Vrijednost"
          // "axisLabelDistance": -20
        }
      }

    };
    //---------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    $scope.open_prije = function($event) {
      $scope.status_prije.opened = true;
    };
    $scope.open_poslije = function($event) {
      $scope.status_poslije.opened = true;
    };

    $scope.setDate = function(year, month, day) {
      $scope.dt = new Date(year, month, day);
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd/MM/yyyy'];
    $scope.format = $scope.formats[0];

    $scope.status_prije = {
      opened: false
    };
    $scope.status_poslije = {
      opened: false
    };
  });

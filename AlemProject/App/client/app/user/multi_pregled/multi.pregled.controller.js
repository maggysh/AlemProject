'use strict';

angular.module('appApp')
  .controller('multiPregledController', function ($scope, $http, $location, $window, $filter) {

    $scope.idTipSenzora = '';
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
                  $http.get('/tip_senzora').then(function(response){
                     $scope.pregled.tip_senzora = response.data;
                  });
                })
             });
    }
    //-----------------------------------------------------------------------------------------
    $scope.osvjezi = function(){

        var time = '';
        var jsonObj = [];
        var jsonObjValue = [];
        var color = ["#FFA658", "#5799C7", "#5E659D","#B4045F", "#5F6E72"];
        var i = 0;

        angular.forEach($scope.pregled, function(entry, key) {

            $http.get('/api/user/pregled/dnevni/' + entry + '/' + $scope.idTipSenzora).then(function(data){

                    jsonObjValue = [];
                    angular.forEach(data.data[0].vrijednosti, function(entry, key){
                       //temp = $filter('date')(entry.Datum, "dd.MM.yyyy") + ' ' + $filter('date')(entry.Datum, "HH:mm:ss")
                       time = '';
                       time = new Date(entry.Datum);
                       time = time.getTime();
                       jsonObjValue.push({x: time, y: entry.Vrijednost});
                    });
                    if(jsonObjValue.length != 0) {
                      jsonObj.push({
                        "key": data.data[0].senzor.Stanica.Naziv,
                        "values": jsonObjValue,
                        "color": color[i]
                      });
                      i++;
                    }
            });
        });
        $scope.pregled.dnevni=jsonObj;
    };
    //-----------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------
    $scope.options = {

      "chart": {
        "type": "lineWithFocusChart",
        "height": 650,
        "margin": {
          "top": 20,
          "right": 20,
          "bottom": 40,
          "left": 35
        },
        "useInteractiveGuideline": true,
        "dispatch": {},
        "xAxis": {
        //  "axisLabel": "Datum",
          tickFormat: function(d) {
            return d3.time.format('%d.%m-%H:%M')(new Date(d-3600000));
            // return d3.time.format('%d.%m.%Y - %H:%m')(new Date(new Date()+ d));
          }
        },
        "x2Axis": {
       //   "axisLabel": "Datum",
          tickFormat: function(d) {
            return d3.time.format('%d.%m')(new Date(d));
            // return d3.time.format('%d.%m.%Y - %H:%m')(new Date(new Date()+ d));
          }
        },
        "yAxis": {
          //"axisLabel": "Vrijednost"
          //"axisLabelDistance": -10
        },
        "y2Axis": {
          showMaxMin: false,
          height: 300
          //"axisLabel": "Vrijednost"
          //"axisLabelDistance": -10
        }
      }

    };
    //---------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------

  });

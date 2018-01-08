'use strict';

angular.module('appApp')
  .controller('graphController', function ($scope, $http, $location, $window) {

    /* Kontoler za crtanje boxova na glavnoj stranici.
       DataT, DataV, DataP redom čuvaju podatke o temperaturi, vodostaju i padavinama u JSON-u kao {"label": x, "value": y}
       formatiranom za NVD3 plugin koji crta grafove.
       Potrebno da tipovi senzora temperature, vodostaja i padavina imaju redom id-eve 1, 2 i 3.
     */

    $scope.param = [];
    $scope.height=[];
    $scope.height.temperatura = 0;
    $scope.height.padavine = 0;
    $scope.height.vodostaj = 0;
    $scope.height_const = 15;
    // Postavke za izgled i ponasanje charta
    // -------------------------------------
    $scope.options = {
      chart: {
          margin:{
              left: 140
          },
        stacked: true,
        type: 'multiBarHorizontalChart',
        //height: 300,
        x: function(d){return d.label;},
        y: function(d){return d.value;},
        showControls: false,
        showValues: true,
        showLegend: false,
        duration: 500,
        xAxis: {
          showMaxMin: false
        },
        yAxis: {
            axisLabel: '',
            tickFormat: function(d){
                return d3.format(',.2f')(d);
          }
        }
      }
    };
    //---------------------------------------------------------------------------------------
    $scope.graphInit = function(){
      $scope.temperatura();
      $scope.vodostaj();
      $scope.padavine();
    };
    //---------------------------------------------------------------------------------------
    $scope.temperatura = function(){

        $http.get('/api/home/graph/1').then(function(data){
        $scope.height.temperatura=data.data.length*$scope.height_const+120;
            console.log($scope.height.temperatura);
        $scope.dataT = [
          {
            "key": "Temperatura",
            "color": "#1f77b4",
            "values": data.data,
          }
        ];
            $scope.optionsT = {
                chart: {
                    margin:{
                        left: 140
                    },
                    stacked: true,
                    type: 'multiBarHorizontalChart',
                    height: 200,
                    //height: $scope.height.temperatura,
                    x: function(d){return d.label;},
                    y: function(d){return d.value;},
                    showControls: false,
                    showValues: true,
                    showLegend: false,
                    duration: 500,
                    xAxis: {
                        showMaxMin: false
                    },
                    yAxis: {
                        axisLabel: '',
                        tickFormat: function(d){
                            return d3.format(',.2f')(d);
                        }
                    }
                }
            };
      });

    };
    //---------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------
    $scope.vodostaj = function(){

      $http.get('/api/home/graph/3').then(function(data){
        $scope.height.vodostaj = data.data.length*$scope.height_const+120;
          console.log($scope.height.vodostaj);
        $scope.dataV = [
          {
            "key": "Vodostaj",
            "color": "#29327C",
            "values": data.data,
          }
        ];
          $scope.optionsV = {
              chart: {
                  margin:{
                      left: 140
                  },
                  stacked: true,
                  type: 'multiBarHorizontalChart',
                  height: $scope.height.vodostaj,
                  x: function(d){return d.label;},
                  y: function(d){return d.value;},
                  showControls: false,
                  showValues: true,
                  showLegend: false,
                  duration: 500,
                  xAxis: {
                      showMaxMin: false
                  },
                  yAxis: {
                      axisLabel: '',
                      tickFormat: function(d){
                          return d3.format(',.2f')(d);
                      }
                  }
              }
          };
      });

    };
    //---------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------
    $scope.padavine = function(){

      $http.get('/api/home/graph/2').then(function(data){
        $scope.height.padavine=data.data.length*$scope.height_const+120;
          console.log($scope.height.padavine);
        $scope.dataP = [
          {
            "key": "Padavine",
            "color": "#2A3E43",
            "values": data.data,
          }
        ];
          $scope.optionsP = {
              chart: {
                  margin:{
                      left: 140
                  },
                  stacked: true,
                  type: 'multiBarHorizontalChart',
                  height: $scope.height.padavine,
                  x: function(d){return d.label;},
                  y: function(d){return d.value;},
                  showControls: false,
                  showValues: true,
                  showLegend: false,
                  duration: 500,
                  xAxis: {
                      showMaxMin: false
                  },
                  yAxis: {
                      axisLabel: '',
                      tickFormat: function(d){
                          return d3.format(',.2f')(d);
                      }
                  }
              }
          };
      });

    };
    //---------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------

  });

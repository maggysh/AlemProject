'use strict';



angular.module('appApp')
  .controller('multiPregledController', function ($scope, $http, $location, $window, $filter) {

    $scope.idTipSenzora = '';
    $scope.pregled = [];
    $scope.info = [];
    $scope.dataDnevni = [];
    $scope.odabraniSenzor='';
    $scope.odabranaStanica='';
    $scope.obrisiSenzor='';
    $scope.obrisiStanicu='';
    $scope.senzori= [];
    $scope.stanice= [];
    $scope.pocetniDatum='';
    $scope.krajnjiDatum='';

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
      //  console.log($scope.idTipSenzora);

      angular.forEach($scope.senzori, function(entry,key){
        var jedanSenzor=entry.id;
        var tipSenzora=entry.tip_senzora;
        angular.forEach($scope.stanice, function(entry, key) {
          $http.get('/api/user/pregled/dnevni/' + entry.id + '/' + jedanSenzor).then(function(data){

            jsonObjValue = [];
            angular.forEach(data.data[0].vrijednosti, function(entry, key){
              //temp = $filter('date')(entry.Datum, "dd.MM.yyyy") + ' ' + $filter('date')(entry.Datum, "HH:mm:ss")
              time = '';
              time = new Date(entry.Datum);

              if(time>$scope.pocetniDatum && time<$scope.krajnjiDatum) {
                time = time.getTime();
                jsonObjValue.push({x: time, y: entry.Vrijednost});
              }
            });
            if(jsonObjValue.length != 0) {
              jsonObj.push({
                "key": data.data[0].senzor.Stanica.Naziv + ' '+tipSenzora,
                "values": jsonObjValue,
                "color": color[i]
              });
              i++;
            }
          });
        });
      });

      $scope.pregled.dnevni=jsonObj;
    };
    //-----------------------------------------------------------------------------------------
    $scope.dodajStanicu = function(){

      var postoji=false;
      var values = $scope.odabranaStanica[0].split(',');

      for(var i=0; i<$scope.stanice.length; i++){
        if($scope.stanice[i].id==values[0]) postoji=true;
      }

      if(!postoji){
        $scope.stanice.push({id:values[0],naziv:values[1]});
      }
    };
    //-----------------------------------------------------------------------------------------
    $scope.dodajSenzor = function(){

      var postoji=false;
      var values = $scope.odabraniSenzor[0].split(',');

      for(var i=0; i<$scope.senzori.length; i++){
        if($scope.senzori[i].id==values[0]) postoji=true;
      }

      if(!postoji){
        $scope.senzori.push({id:values[0],tip_senzora:values[1]});
      }
      console.log($scope.senzori);

    };
    //-----------------------------------------------------------------------------------------
    $scope.odstraniStanicu = function(){

      for(var i=0; i<$scope.stanice.length; i++){
        if($scope.stanice[i].id==$scope.obrisiStanicu[0])$scope.stanice.splice(i,1);
      }
      /* if( $scope.stanice.indexOf({id:values[0],naziv:values[1]})!=-1){
         $scope.stanice.splice($scope.stanice.indexOf({id:values[0],naziv:values[1]}),1);
       }
       console.log($scope.stanice);*/
    };
    //-----------------------------------------------------------------------------------------
    $scope.odstraniSenzor = function(){

      for(var i=0; i<$scope.senzori.length; i++){
        if($scope.senzori[i].id==$scope.obrisiSenzor[0])$scope.senzori.splice(i,1);
      }

    };
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

    $scope.formats = ['yyyy-MM-dd'];
    $scope.format = $scope.formats[0];

    $scope.status_prije = {
      opened: false
    };
    $scope.status_poslije = {
      opened: false
    };



    //-----------------------------------------------------------------------------------------
    $scope.options = {

      "chart": {
        "type": "lineWithFocusChart",
        //   "type": "multiBarChart",
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
    $scope.callback = function(scope,element){
      $scope.myChartScope = scope;
    }
    //---------------------------------------------------------------------------------------------

    $scope.PNG = function () {
      console.log($scope.myChartScope.svg);
      console.log($scope.myChartScope.chart);
      saveSvgAsPng($scope.myChartScope.svg[0][0], "diagram.png", {backgroundColor: "white"});
    };
    $scope.JPG = function () {

    }
    $scope.BMP = function () {

    }
    //-----------------------------------------------------------------------------------------

  });

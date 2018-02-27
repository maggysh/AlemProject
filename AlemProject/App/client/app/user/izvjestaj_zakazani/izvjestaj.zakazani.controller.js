'use strict';

angular.module('appApp')
  .controller('izvjestajZakazaniController', function ($scope, $http, $location, $window, $filter) {

    $scope.pregled = [];
    $scope.pregled.stanice = [];
    $scope.pregled.id = '';
    $scope.info = [];

    $scope.dani = ["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak","Subota","Nedjelja"];
   
    $scope.weekDays = [{broj:1,dan:"Ponedjeljak"},{broj:2,dan:"Utorak"},{broj:3,dan:"Srijeda"},
                      {broj:4,dan:"Četvrtak"},{broj:5,dan:"Petak"},{broj:6,dan:"Subota"},{broj:0,dan:"Nedjelja"}];
    $scope.monthDays = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    $scope.i=0;

    $scope.DnevniTime="";
    $scope.SedmicniTime="";
    $scope.MjesecniTime="";
    $scope.SedmicniDan="";
    $scope.MjesecniDan="";

    $scope.SedmicniPodaci="U pet ppopodne";
    
    //---------------------------------------------------------------------------------------------
    $scope.Init = function(){
      $http.get('/loggedin').then(function (response) {
        //$scope.info.name = response.data.user.ime_prezime;
        $scope.info.id = response.data.user.id;
        $http.get('/api/user/izvjestaj/automatski/' + $scope.info.id).then(function(data){
          $scope.pregled.stanice = data.data;
          console.log($scope.pregled.stanice);
        })
      });
    };
    $scope.Init();
    //---------------------------------------------------------------------------------------------
    $scope.novoStanje = function(value){
      //var temp = $scope.pregled.stanice[pregled.id].id;
      var vrijednost={Da:1,Ne:0};
      $scope.dnevni=vrijednost[$scope.pregled.stanice[$scope.pregled.id].Dnevni];
      $scope.sedmicni=vrijednost[$scope.pregled.stanice[$scope.pregled.id].Sedmicni];
      $scope.mjesecni=vrijednost[$scope.pregled.stanice[$scope.pregled.id].Mjesecni];

      if($scope.dnevni==0){
        $scope.DnevniTime='';
      }
      if($scope.sedmicni==0){
        $scope.SedmicniTime='';
        $scope.SedmicniDan=0;

      }
      if($scope.sedmicni==0){
        $scope.MjesecniTime='';
        $scope.MjesecniDan=0;
      }
      console.log($scope.DnevniTime);
      console.log($scope.SedmicniTime);
      console.log($scope.MjesecniTime);
      console.log($scope.SedmicniDan);
      console.log($scope.MjesecniDan);

      $http.put('/update/izvjestaj', {dnevni: $scope.dnevni, sedmicni: $scope.sedmicni,  mjesecni: $scope.mjesecni,
        user: $scope.info.id, stanica: value, DnevniTime: $scope.DnevniTime, SedmicniTime:$scope.SedmicniTime,
        MjesecniTime: $scope.MjesecniTime, SedmicniDan:$scope.SedmicniDan, MjesecniDan:$scope.MjesecniDan }).then(function(response){
        console.log(response);
      });
      
   
    }
    //---------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------

    $scope.checkboxModel = {
      dnevniValue : true,
      sedmicniValue : true,
      mjesecniValue : true
    };
    $scope.odabranaStanica = function(){
      console.log($scope.SedmicniDan);
      if($scope.i==0) $scope.i++;
      else if($scope.i==1){
        $scope.clicked=true;
        document.getElementById("saveButton").style.visibility="visible";
        document.getElementById("izvjestajDetails").style.visibility="visible";
        $scope.SedmicniDan=$scope.pregled.stanice[$scope.pregled.id].SedmicniDan;
        $scope.MjesecniDan=$scope.pregled.stanice[$scope.pregled.id].MjesecniDan;
        $scope.DnevniTime=$scope.pregled.stanice[$scope.pregled.id].DnevniTime;
        $scope.SedmicniTime=$scope.pregled.stanice[$scope.pregled.id].SedmicniTime;
        $scope.MjesecniTime=$scope.pregled.stanice[$scope.pregled.id].MjesecniTime;

        $scope.dnevniClick();
        $scope.sedmicniClick();
        $scope.mjesecniClick();
      
      }else{

      $scope.SedmicniDan=$scope.pregled.stanice[$scope.pregled.id].SedmicniDan;
      $scope.MjesecniDan=$scope.pregled.stanice[$scope.pregled.id].MjesecniDan;
      $scope.DnevniTime=$scope.pregled.stanice[$scope.pregled.id].DnevniTime;
      $scope.SedmicniTime=$scope.pregled.stanice[$scope.pregled.id].SedmicniTime;
      $scope.MjesecniTime=$scope.pregled.stanice[$scope.pregled.id].MjesecniTime;

      $scope.dnevniClick();
      $scope.sedmicniClick();
      $scope.mjesecniClick();
      }
    }

    $scope.dnevniClick = function(){
     if($scope.pregled.id!=null){
        if($scope.pregled.stanice[$scope.pregled.id].Dnevni=='Da'){
          document.getElementById("dnevniDetails").style.visibility="visible";
        }else{
          document.getElementById("dnevniDetails").style.visibility="hidden";
        }
      }
    }
    $scope.sedmicniClick = function(){
      if($scope.pregled.id!=null){
        if($scope.pregled.stanice[$scope.pregled.id].Sedmicni=='Da'){
          document.getElementById("sedmicniDetails").style.visibility="visible";
        }else{
          document.getElementById("sedmicniDetails").style.visibility="hidden";
        }
      }
    }
    $scope.mjesecniClick = function(){
      if($scope.pregled.id!=null){
        if($scope.pregled.stanice[$scope.pregled.id].Mjesecni=='Da'){
          document.getElementById("mjesecniDetails").style.visibility="visible";
        }else{
          document.getElementById("mjesecniDetails").style.visibility="hidden";
        }
      }
    }

  });

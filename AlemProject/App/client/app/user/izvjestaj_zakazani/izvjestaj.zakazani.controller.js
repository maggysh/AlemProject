'use strict';

angular.module('appApp')
  .controller('izvjestajZakazaniController', function ($scope, $http, $location, $window, $filter) {

    $scope.pregled = [];
    $scope.pregled.stanice = [];
    $scope.pregled.id = '';
    $scope.info = [];

    $scope.dani = ["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak","Subota","Nedjelja"];
   
    $scope.weekDays = [{broj:2,dan:"Ponedjeljak"},{broj:3,dan:"Utorak"},{broj:4,dan:"Srijeda"},
                      {broj:5,dan:"Četvrtak"},{broj:6,dan:"Petak"},{broj:7,dan:"Subota"},{broj:1,dan:"Nedjelja"}];
    $scope.monthDays = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    $scope.i=0;

    $scope.DnevniTime="";
    $scope.SedmicniTime="";
    $scope.MjesecniTime="";
    $scope.SedmicniDan="";
    $scope.MjesecniDan="";

    $scope.TrenutniDnevni="";
    $scope.TrenutniSedmicni="";
    $scope.TrenutniMjesecni="";

    $scope.ButtonDnevni="";
    $scope.ButtonSedmicni="";
    $scope.ButtonMjesecni="";
    $scope.user="";

    $scope.userEmail="";
    var DaNe=["Ne","Da"];
    
    //---------------------------------------------------------------------------------------------
    $scope.Init = function(){
      $http.get('/loggedin').then(function (response) {
        $scope.user=response.data.user;
        $scope.userEmail=response.data.user.email;
        //$scope.info.name = response.data.user.ime_prezime;
        $scope.info.id = response.data.user.id;
        $http.get('/api/user/izvjestaj/automatski/' + $scope.info.id).then(function(data){
          $scope.pregled.stanice = data.data;
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


      if($scope.ButtonDnevni=="Odustani" && $scope.DnevniTime.length==5){
        $scope.dnevni=1;
      }

      if($scope.ButtonSedmicni=="Odustani" && $scope.SedmicniTime.length==5 && $scope.SedmicniDan!=0){
        $scope.sedmicni=1;
        $scope.SedmicniDan--;
      }

      if($scope.ButtonMjesecni=="Odustani" && $scope.MjesecniTime.length==5 && $scope.MjesecniDan!=0){
        $scope.mjesecni=1;
      }

      if($scope.dnevni==0){
        $scope.DnevniTime='';
      }
      if($scope.sedmicni==0){
        $scope.SedmicniTime='';
        $scope.SedmicniDan='';

      }
      if($scope.mjesecni==0){
        $scope.MjesecniTime='';
        $scope.MjesecniDan='';
      }
      console.log("dnevni: ");
      console.log($scope.dnevni);
      console.log($scope.DnevniTime);

      console.log("sedmicni: ");
      console.log($scope.sedmicni);
      console.log($scope.SedmicniTime);
      console.log($scope.SedmicniDan);

      console.log("mjesecni: ");
      console.log($scope.mjesecni);
      console.log($scope.MjesecniTime);
      console.log($scope.MjesecniDan)

      $http.put('/update/izvjestaj', {dnevni: $scope.dnevni, sedmicni: $scope.sedmicni,  mjesecni: $scope.mjesecni,
        user: $scope.info.id, stanica: value, DnevniTime: $scope.DnevniTime, SedmicniTime:$scope.SedmicniTime,
        MjesecniTime: $scope.MjesecniTime, SedmicniDan:$scope.SedmicniDan, MjesecniDan:$scope.MjesecniDan }).then(function(response){
        console.log(response);
      });
      
      $scope.pregled.stanice[$scope.pregled.id].Dnevni=DaNe[$scope.dnevni];
      $scope.pregled.stanice[$scope.pregled.id].Sedmicni=DaNe[$scope.sedmicni];
      $scope.pregled.stanice[$scope.pregled.id].Mjesecni=DaNe[$scope.mjesecni];
      $scope.pregled.stanice[$scope.pregled.id].SedmicniDan=$scope.SedmicniDan;
      $scope.pregled.stanice[$scope.pregled.id].MjesecniDan=$scope.MjesecniDan;
      $scope.pregled.stanice[$scope.pregled.id].DnevniTime=$scope.DnevniTime;
      $scope.pregled.stanice[$scope.pregled.id].SedmicniTime=$scope.SedmicniTime;
      $scope.pregled.stanice[$scope.pregled.id].MjesecniTime=$scope.MjesecniTime;
      $scope.SedmicniDan++

      $scope.odabranaStanica();
    }
    //---------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------

    $scope.checkboxModel = {
      dnevniValue : true,
      sedmicniValue : true,
      mjesecniValue : true
    };
    $scope.odabranaStanica = function(){


      if($scope.i==0) $scope.i++;
      else if($scope.i==1){
        
        $scope.clicked=true;
        document.getElementById("saveButton").style.visibility="visible";
        document.getElementById("izvjestajDetails").style.visibility="visible";

        $scope.i++;
      }
      if($scope.i >1){

        
        $scope.SedmicniDan=$scope.pregled.stanice[$scope.pregled.id].SedmicniDan;
        $scope.MjesecniDan=$scope.pregled.stanice[$scope.pregled.id].MjesecniDan;
        $scope.DnevniTime=$scope.pregled.stanice[$scope.pregled.id].DnevniTime;
        $scope.SedmicniTime=$scope.pregled.stanice[$scope.pregled.id].SedmicniTime;
        $scope.MjesecniTime=$scope.pregled.stanice[$scope.pregled.id].MjesecniTime;

        if($scope.pregled.stanice[$scope.pregled.id].Dnevni=='Da'){ 
          $scope.TrenutniDnevni="Trenutno izvještaj dolazi svakog dana u "+$scope.DnevniTime;
          $scope.ButtonDnevni="Izmijeni postavke";
          document.getElementById("ukloniDnevniButton").style.display="block";
        }else{
          $scope.TrenutniDnevni="Dnevni izvještaj nije odabran.";
          $scope.ButtonDnevni="Dodaj izvještaj";
          document.getElementById("ukloniDnevniButton").style.display="none";
        }

        if($scope.pregled.stanice[$scope.pregled.id].Sedmicni=='Da'){
          var dan = $scope.weekDays.filter(function( day ) {
            if(day.broj ==$scope.SedmicniDan +1)
            return day.dan;
          });
          $scope.TrenutniSedmicni="Trenutno izvještaj dolazi svake sedmice u "+$scope.SedmicniTime + " (" + (dan[0].dan)+")";
          $scope.ButtonSedmicni="Izmijeni postavke";
          document.getElementById("ukloniSedmicniButton").style.display="block";
        }else{
          $scope.TrenutniSedmicni="Sedmični izvještaj nije odabran.";
          $scope.ButtonSedmicni="Dodaj izvještaj";
          document.getElementById("ukloniSedmicniButton").style.display="none";
        }

        if($scope.pregled.stanice[$scope.pregled.id].Mjesecni=='Da') {
          $scope.TrenutniMjesecni="Trenutno izvještaj dolazi svakog "+$scope.MjesecniDan + ". u mjesecu u " + $scope.MjesecniTime;
          $scope.ButtonMjesecni="Izmijeni postavke";
          document.getElementById("ukloniMjesecniButton").style.display="block";
        }else{
          $scope.TrenutniMjesecni="Mjesečni izvještaj nije odabran.";
          $scope.ButtonMjesecni="Dodaj izvještaj";
          document.getElementById("ukloniMjesecniButton").style.display="none";
        }
        document.getElementById("dnevniDetails").style.visibility="hidden";

        document.getElementById("sedmicniDetails").style.visibility="hidden";

        document.getElementById("mjesecniDetails").style.visibility="hidden";
      }
    }


    $scope.buttonDnevni_clicked = function(){
      if($scope.ButtonDnevni=="Izmijeni postavke"){
        $scope.ButtonDnevni="Odustani";
        document.getElementById("dnevniDetails").style.visibility="visible"; 
        document.getElementById("ukloniDnevniButton").style.display="none";

      }else if($scope.ButtonDnevni=="Dodaj izvještaj"){
        $scope.ButtonDnevni="Odustani";
        document.getElementById("dnevniDetails").style.visibility="visible"; 
        document.getElementById("ukloniDnevniButton").style.display="none";

      }else{
        if($scope.pregled.stanice[$scope.pregled.id].Dnevni=='Da'){
          $scope.ButtonDnevni="Izmijeni postavke";
        }else{
          $scope.ButtonDnevni="Dodaj izvještaj";
        }

        if($scope.pregled.stanice[$scope.pregled.id].Dnevni=='Da')document.getElementById("ukloniDnevniButton").style.display="block";
        document.getElementById("dnevniDetails").style.visibility="hidden"; 
      }
    }

    $scope.buttonSedmicni_clicked = function(){
      if($scope.ButtonSedmicni=="Izmijeni postavke"){
        $scope.ButtonSedmicni="Odustani";
        document.getElementById("sedmicniDetails").style.visibility="visible"; 
        document.getElementById("ukloniSedmicniButton").style.display="none";

      }else if($scope.ButtonSedmicni=="Dodaj izvještaj"){
        $scope.ButtonSedmicni="Odustani";
        document.getElementById("sedmicniDetails").style.visibility="visible";  
        document.getElementById("ukloniSedmicniButton").style.display="none";

      }else{
        if($scope.pregled.stanice[$scope.pregled.id].Sedmicni=='Da'){
          $scope.ButtonSedmicni="Izmijeni postavke";
        }else{
          $scope.ButtonSedmicni="Dodaj izvještaj";
        }
        if($scope.pregled.stanice[$scope.pregled.id].Sedmicni=='Da')document.getElementById("ukloniSedmicniButton").style.display="block";
        document.getElementById("sedmicniDetails").style.visibility="hidden"; 
      }
    }

    $scope.buttonMjesecni_clicked = function(){
      if($scope.ButtonMjesecni=="Izmijeni postavke"){
        $scope.ButtonMjesecni="Odustani";
        document.getElementById("mjesecniDetails").style.visibility="visible";  
        document.getElementById("ukloniMjesecniButton").style.display="none";

      }else if($scope.ButtonMjesecni=="Dodaj izvještaj"){
        $scope.ButtonMjesecni="Odustani";
        document.getElementById("mjesecniDetails").style.visibility="visible"; 
        document.getElementById("ukloniMjesecniButton").style.display="none";

      }else{
        if($scope.pregled.stanice[$scope.pregled.id].Mjesecni=='Da'){
          $scope.ButtonMjesecni="Izmijeni postavke";
        }else{
          $scope.ButtonMjesecni="Dodaj izvještaj";
        }
        if($scope.pregled.stanice[$scope.pregled.id].Mjesecni=='Da')document.getElementById("ukloniMjesecniButton").style.display="block";
        document.getElementById("mjesecniDetails").style.visibility="hidden"; 
      }
    }

    $scope.button_ukloniDnevni_clicked = function(){

      $scope.dnevni=0;
      $scope.DnevniTime="";
      $scope.pregled.stanice[$scope.pregled.id].Dnevni=DaNe[$scope.dnevni];
      $scope.pregled.stanice[$scope.pregled.id].DnevniTime=$scope.DnevniTime;

      $scope.TrenutniDnevni="Dnevni izvještaj nije odabran.";
      $scope.ButtonDnevni="Dodaj izvještaj";
      document.getElementById("ukloniDnevniButton").style.display="none";
      $scope.novoStanje($scope.pregled.stanice[$scope.pregled.id].id);
      
    }

    $scope.button_ukloniSedmicni_clicked = function(){
      $scope.sedmicni=0;
      $scope.SedmicniTime="";
      $scope.pregled.stanice[$scope.pregled.id].Sedmicni=DaNe[$scope.sedmicni];
      $scope.pregled.stanice[$scope.pregled.id].SedmicniTime=$scope.SedmicniTime;

      $scope.TrenutniSedmicni="Dnevni izvještaj nije odabran.";
      $scope.ButtonSedmicni="Dodaj izvještaj";
      document.getElementById("ukloniSedmicniButton").style.display="none";
      $scope.novoStanje($scope.pregled.stanice[$scope.pregled.id].id);
    }

    $scope.button_ukloniMjesecni_clicked = function(){
      $scope.mjesecni=0;
      $scope.MjesecniTime="";
      $scope.pregled.stanice[$scope.pregled.id].Mjesecni=DaNe[$scope.mjesecni];
      $scope.pregled.stanice[$scope.pregled.id].MjesecniTime=$scope.MjesecniTime;

      $scope.TrenutniMjesecni="Dnevni izvještaj nije odabran.";
      $scope.ButtonMjesecni="Dodaj izvještaj";
      document.getElementById("ukloniMjesecniButton").style.display="none";
      $scope.novoStanje($scope.pregled.stanice[$scope.pregled.id].id);
    }

    $scope.button_changeEmail_clicked = function (){
      var paragraph = document.getElementById("emailParagraph");
      var input = document.getElementById("emailInput");
      var button = document.getElementById("emailButton");
      var cancelButton = document.getElementById("cancelEditEmail");

      if(button.innerText=="Promijeni e-mail"){
        input.style.display="block";
        paragraph.style.display="none";
        button.innerText="Spasi izmjene";
        cancelButton.style.display="block";
      }else{
        $scope.userEmail=$scope.user.email;
        input.style.display="none";
        paragraph.style.display="block";
        button.innerText="Promijeni e-mail";
        cancelButton.style.display="none";
        $http.post('/edit/user/email', {email: $scope.user.email, id:$scope.user.id}).then(function(response){});
      }

      $scope.button_cancelEditEmail_clicked = function(){
        $scope.user.email=$scope.userEmail;
        input.style.display="none";
        paragraph.style.display="block";
        button.innerText="Promijeni e-mail";
        cancelButton.style.display="none";
      }
    }
  });

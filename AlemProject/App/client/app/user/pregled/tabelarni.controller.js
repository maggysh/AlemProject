'use strict';

angular.module('appApp')
  .controller('tabelarniPrikazCtrl', function ($scope, $http, $filter) {

    $scope.collection = [];
    $scope.displayed = [];
    $scope.info = [];
    $scope.pregled = [];
    $scope.max = 0;
    $scope.min = 0;
    $scope.avg = 0;

    //novo
    $scope.filteri = {stanice:[], kodoviSenzora:[], naziviSenzora:[]};
    $scope.selektovani = {stanice:[], kodoviSenzora:[], naziviSenzora:[]};
    $scope.pocetniDatum='';
    $scope.krajnjiDatum='';
    $scope.vrijednostOd='';
    $scope.vrijednostDo='';
    $scope.displayedVrijednosti=[];
    $scope.itemsCount=0;
    $scope.itemsPerPage=15;
    $scope.currentPage='';
    $scope.maxSize=5;

    $scope.tableDisplayed=0;
    
    $scope.pageChanged = function(){
      $http.get('/api/tabela/batch', 
      {params: {selektovani: ($scope.selektovani), 
       pocetniDatum:($scope.pocetniDatum),
       krajnjiDatum:($scope.krajnjiDatum),
       vrijednostOd:$scope.vrijednostOd,
       vrijednostDo:$scope.vrijednostDo,
       UserId: $scope.info.id,
       pageNumber: $scope.currentPage-1
     }}).then(function(vrijednosti){
       console.log("vrijednosti",vrijednosti);
       $scope.displayedVrijednosti = vrijednosti.data.vrijednosti;
       $scope.itemsCount = vrijednosti.data.count;
     });
    }

    $scope.pregledInit = function() {
      $http.get('/loggedin').then(function (response) {
        $scope.info.id = response.data.user.id;
        $http.get('/api/user/link/' + $scope.info.id).then(function (data) {
          
           angular.forEach(data.data, function(value) {
             $scope.filteri.stanice.push(value[0].Naziv);
             $http.get('/api/home/filteri/' + value[0].id).then(function(kodovi_nazivi){
              
              for(var i=0; i<kodovi_nazivi.data.kodoviSenzora.length; i++){
                console.log($scope.filteri.naziviSenzora);
                console.log(kodovi_nazivi.data.naziviSenzora[i]);
                console.log(" ");
                if($scope.filteri.naziviSenzora.indexOf(kodovi_nazivi.data.naziviSenzora[i])==-1){
                  $scope.filteri.naziviSenzora.push(kodovi_nazivi.data.naziviSenzora[i]);
                }
                if($scope.filteri.kodoviSenzora.indexOf(kodovi_nazivi.data.kodoviSenzora[i])==-1){
                  $scope.filteri.kodoviSenzora.push(kodovi_nazivi.data.kodoviSenzora[i]);
                }
              }
             });
           });
        });
        $scope.displayed = [].concat($scope.collection);
      });
      
    }

    //-----------------------------------------------------------------------------------------------------
    //ucitavanje vrijednosti za stanicu
    $scope.ucitajVrijednosti = function(id) {

      $http.get('/api/user/pregled/tabela/' + id).then(function(data){
        angular.forEach(data.data, function(value, key){
          angular.forEach(value.vrijednosti, function(entry, key){
            //console.log(new Date(entry.Datum));
            $scope.collection.push({
              "Vrijednost": entry.Vrijednost,
              //"Datum": new Date(entry.Datum),
              "Datum": $filter('date')(entry.Datum, "dd/MM/yyyy")+ ' ' + $filter('date')(entry.Datum, "HH:mm:ss"),
              "Kod_senzora": value.senzor.Kod_senzora,
              "Tip_senzora": value.senzor.Tip_senzora.Tip_Senzora,
              "Naziv": value.senzor.Stanica.Naziv
            });
          });
        });
      });

    };
    //---------------------------------------------------------------------------------------------
    //DATE TIME PICKER
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
    //---------------------------------------------------------------------------------------------
    $scope.toggleSelectionStanice = function(stanica){
      
      if($scope.selektovani.stanice.indexOf(stanica)==-1)$scope.selektovani.stanice.push(stanica);
      else $scope.selektovani.stanice.splice($scope.selektovani.stanice.indexOf(stanica),1);
    }
    //---------------------------------------------------------------------------------------------
    $scope.toggleSelectionKodoviSenzora = function(kodSenzora){
      
      if($scope.selektovani.kodoviSenzora.indexOf(kodSenzora)==-1) $scope.selektovani.kodoviSenzora.push(kodSenzora);
      else $scope.selektovani.kodoviSenzora.splice($scope.selektovani.kodoviSenzora.indexOf(kodSenzora),1);
    }    
    //---------------------------------------------------------------------------------------------
    $scope.toggleSelectionNazivSenzora = function(nazivSenzora){
      
      if($scope.selektovani.naziviSenzora.indexOf(nazivSenzora)==-1) $scope.selektovani.naziviSenzora.push(nazivSenzora);
      else $scope.selektovani.naziviSenzora.splice($scope.selektovani.naziviSenzora.indexOf(nazivSenzora),1);
    }
    //---------------------------------------------------------------------------------------------
    $scope.osvjezi = function(){
     console.log($scope.selektovani);
     console.log($scope.pocetniDatum);
     console.log($scope.krajnjiDatum);
     console.log($scope.vrijednostOd);
     console.log($scope.vrijednostDo);
     $scope.tableDisplayed=1;
     $scope.currentPage=1;
     $http.get('/api/tabela/batch', 
      {params: {selektovani: ($scope.selektovani), 
        pocetniDatum:($scope.pocetniDatum),
        krajnjiDatum:($scope.krajnjiDatum),
        vrijednostOd:$scope.vrijednostOd,
        vrijednostDo:$scope.vrijednostDo,
        UserId: $scope.info.id,
        pageNumber: 0
      }}).then(function(vrijednosti){
        console.log("vrijednosti",vrijednosti);
        $scope.displayedVrijednosti = vrijednosti.data.vrijednosti;
        $scope.itemsCount = vrijednosti.data.count;
      });
    }
  });


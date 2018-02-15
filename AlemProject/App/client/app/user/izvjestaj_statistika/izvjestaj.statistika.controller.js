'use strict';

angular.module('appApp')
  .controller('izvjestajStatistikaController', function ($scope, $http, $location, $window, $filter) {

    $scope.pregled = [];
    $scope.pregled.id = '';
    $scope.info = [];
    $scope.collection = [];
    $scope.displayed = [];
    $scope.distinctTipSenzora = [];
    $scope.distinctDatum = [];
    $scope.pocetniDatum='';
    $scope.krajnjiDatum='';
    $scope.textOption="";
    //---------------------------------------------------------------------------------------------
    $scope.Init = function(){
      $http.get('/loggedin').then(function (response) {
        //$scope.info.name = response.data.user.ime_prezime;
        $scope.info.id = response.data.user.id;
        $http.get('/api/user/link/' + $scope.info.id).then(function(data){
          $scope.pregled.stanice = data.data;
        });
      });
    };
    $scope.Init();
    //---------------------------------------------------------------------------------------------
    //Uzimanje svih tipova senzora
    $scope.tipoviSenzora = function(){
      $scope.distinctTipSenzora = [];
      $scope.distinctDatum = [];
      $scope.distinctDatum.datumi = [];
      $scope.temp=[];
      $scope.distinctDatum.vrijednosti = [];
      var i = 0;
      angular.forEach($scope.collection, function(item) {
        var value = item.Tip_senzora;
        var date = item.Datum.slice(0, 10);
        //var date = $filter('date')(new Date(datex._i), "MM/dd/yyyy");
        if (value && value.trim().length > 0 && $scope.distinctTipSenzora.indexOf(value) === -1) {
          $scope.distinctTipSenzora.push(value);
        };
        if (date && date.trim().length > 0 && $scope.temp.indexOf(date) === -1) {
          $scope.temp.push(date);
          $scope.distinctDatum.datumi[i] = [];
          //$scope.distinctDatum.datumi[i].push(date);
          $scope.distinctDatum.datumi[i][0] = date;
          i++;
        };
      });

      for(var b = 0; b < $scope.distinctDatum.datumi.length; b++){
        for(var a = 0; a < $scope.distinctTipSenzora.length; a++)
          $scope.distinctDatum.datumi[b][a+1] = [];
      };

      angular.forEach($scope.collection, function(item, key) {
        var k = 0;
        var t = -1;
        var date = item.Datum.slice(0, 10);
        //var date = $filter('date')(new Date(item.Datum), "dd/MM/yyyy");
        while(t == -1){
          t = $scope.distinctDatum.datumi[k][0].indexOf(date);
          k++;
        }
        var indeks_tipSenzora = $scope.distinctTipSenzora.indexOf(item.Tip_senzora);
        $scope.distinctDatum.datumi[k-1][indeks_tipSenzora+1].push(item.Vrijednost);
      });

      angular.forEach($scope.distinctDatum.datumi, function(item, key){
        for(var a = 0; a < $scope.distinctTipSenzora.length; a++){
          var avg = 0; var max = 0; var min = 0; var b = 0;
          angular.forEach(item[a+1], function(value, keyy){
            avg = avg + value;
            b++;
          });
          avg = avg/b;
          max = Math.max.apply(Math, item[a+1]);
          min = Math.min.apply(Math, item[a+1]);
          $scope.distinctDatum.datumi[key][a+1] = "";
          $scope.distinctDatum.datumi[key][a+1] = "AVG: " + avg.toFixed(2) + " " + "MAX: " + max + " " + "MIN: " + min;
        };
      });

      $scope.collection = $scope.distinctDatum.datumi;
      $scope.displayed = [].concat($scope.collection);
    };
    //---------------------------------------------------------------------------------------------
    $scope.Osvjezi = function(){
      $scope.collection = [];
      $scope.displayed = [];
      $http.get('/api/user/izvjestaj/' + $scope.pregled.id).then(function (data) {
        angular.forEach(data.data, function(value) {
          angular.forEach(value.vrijednosti, function(entry, key){
            var time = '';
            time = new Date(entry.Datum);
            if(time>$scope.pocetniDatum && time<$scope.krajnjiDatum) {
              time = time.getTime();
              $scope.collection.push({
                "Vrijednost": entry.Vrijednost,
                "Datum": $filter('date')(entry.Datum, "dd/MM/yyyy"+ ' ' + $filter('date')(entry.Datum, "HH:mm:ss")),
                "Kod_senzora": value.senzor.Kod_senzora,
                "Tip_senzora": value.senzor.Tip_senzora.Tip_Senzora,
              });
            }
          });
        });
        $scope.tipoviSenzora();
      });

      $scope.displayed = [].concat($scope.collection);
    };
    //---------------------------------------------------------------------------------------------
    $scope.printIt = function(){

      var data = [];
      //var data = $scope.collection.slice();
      angular.forEach($scope.collection, function(entry, key){
        var temp = {};
        angular.forEach(entry, function(value, keyy){
          if(keyy == 0){
            temp["Datum"] = value;
          }
          else{
            temp[$scope.distinctTipSenzora[keyy-1]]=value;
            //console.log("dnevni value",value);
          };
        });
        data.push(temp);
      });
      var fontSize = 9;
      var height = 0;
      var doc = new jsPDF('l', 'pt', 'a4');
      doc.setFont("courier", "normal");
      doc.setFontSize(fontSize);
      doc.text(50,100,"");
      //doc.cell(leftMargin, topMargin, cellWidth, rowHeight);
      height = doc.drawTable(data, {xstart:10,ystart:10,tablestart:20,marginleft:20});
      doc.save("dnevni-izvjestaj.pdf");
    };
    $scope.printItCSV = function(){
      console.log("scope ",$scope.collection);
      var data = [];
      //var data = $scope.collection.slice();
      // var data =$scope.collection.join(';');
      console.log("data",data);
      var temp={};
      console.log("scople colleciton",$scope.collection);
      var csvTemp={};
      var  csvContent= 'data:text/csv;charset=utf-8,';
      angular.forEach($scope.collection, function(entry, key){
        angular.forEach(entry, function(value, keyy){
          //if(keyy < entry.length ){
          for(var i=0;i<entry.length;i++) {
            //var res=entry.split(' ')
            if(i==entry.length-1)
              csvContent+=entry[i]+'\r\n';
            else
              csvContent += entry[i] + ',';
          }
        });
      });
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "my_data.csv");
      // document.body.appendChild(link); // Required for FF

      link.click();



      //  var temp = {};
    };   //

    $scope.printIt3 = function(){
      
        console.log("scope ",$scope.collection);
        var data = [];
        console.log("data",data);
        var temp={};
        console.log("scople colleciton",$scope.collection);
        
        var xmltext="<data>";
        angular.forEach($scope.collection, function(entry, key){
          var podatak="<entry>";
  
  
          for(var i=0; i<entry.length; i++){
           var tag = "Datum"
           if(i>0)tag=($scope.distinctTipSenzora[i-1]).replace(/ž/g, "z");
           tag=(tag).replace(/ /g,"");
           var input = entry[i];
           if(input==undefined) input="";
           var p ="<"+tag+">"+input+"</"+tag+">";
           podatak+=p;
          }
          podatak+="</entry>";
          xmltext+=podatak;
        });
        xmltext+="</data>";
        var pom = document.createElement('a');
        
        var filename = "file.xml";
        var pom = document.createElement('a');
        var bb = new Blob([xmltext], {type: 'text/plain'});
        
        pom.setAttribute('href', window.URL.createObjectURL(bb));
        pom.setAttribute('download', filename);
        
        pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
        pom.click();
  
    };

    $scope.printIt4 = function(){
      
      console.log("scope ",$scope.collection);
      var data = [];
      console.log("data",data);
      var temp={};
      console.log("scople colleciton",$scope.collection);
      
      var filename="file.txt";
      angular.forEach($scope.pregled.stanice, function(entry,key){
        if(entry[0].id==$scope.pregled.id) filename = entry[0].Naziv.replace(/ /g,"");
      });
      var text = ""

      if($scope.textOption=="svi"){
        angular.forEach($scope.collection, function(entry, key){
          var date=entry[0];
          var line=date.replace(/\//g, ".") + ';';
          for(var i=1; i<entry.length-1; i++){
            if(entry[i]==undefined)line+=';';
            else line+=entry[i]+';';
          }
          if(key<$scope.collection.length-1){
            if(entry[entry.length-1]==undefined)line+=+'\r\n';
            else line+=entry[entry.length-1]+'\r\n';
          }else{
            if(entry[entry.length-1]!=undefined) line+=entry[entry.length-1];
          }
            text+=line;
        });
        filename+='_svi_senzori.txt';
      }else{
        var index=1;
        for(var i=0; i<$scope.distinctTipSenzora.length; i++){
          if($scope.textOption == $scope.distinctTipSenzora[i]) index=i;
        }

        angular.forEach($scope.collection, function(entry, key){
          var date=entry[0];
          var line=date.replace(/\//g, ".") + ';';
        
         if(entry[index+1]==undefined){
          if(key<$scope.collection.length-1)line+='\r\n';
         }else{
          if(key<$scope.collection.length-1)line+=entry[index+1]+'\r\n';
          else line+=entry[index+1];
         }
          text+=line;
        });
        filename+='_'+$scope.textOption+'.txt';
      }
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
    
      element.click();
    
      document.body.removeChild(element);
  };
    //temp[$scope.distinctTipSenzora[keyy-1]]=value;
    //    csvTemp=$scope.convertArrayOfObjectsToCSV();
    console.log("csv");
    // };
    // });
    //data.push(csvTemp);
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

  });

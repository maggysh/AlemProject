'use strict';

angular.module('appApp')
  .controller('detaljnoStanicaController', function ($scope, $http, $location, $window, $filter) {
    $scope.pregled = [];
    $scope.info = [];
    $scope.dataDnevni = [];
 

    $scope.idStanice='';
    //---------------------------------------------------------------------------------------------
    $scope.Init = function(){

      console.log($location.$$path);
      $scope.idStanice = ($location.$$path).substring(18);

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


      var time = '';
      var jsonObj = [];
      var jsonObjValue = [];
      var color = ["#5799C7", "#FFA658", "#5E659D","#B4045F", "#5F6E72"];
      var i = 0;
      $http.get('/api/user/pregled/dnevni/' +$scope.idStanice).then(function(data){
        $scope.pregled.dnevni = data.data;
        angular.forEach($scope.pregled.dnevni, function(value) {
          jsonObjValue = [];
          angular.forEach(value.vrijednosti, function(entry, key) {
            //temp = $filter('date')(entry.Datum, "dd.MM.yyyy") + ' ' + $filter('date')(entry.Datum, "HH:mm:ss")
            time = '';
            time = new Date(entry.Datum);
            //time = new Date($filter('date')(entry.Datum, "dd/MM/yyyy"+ ' ' + $filter('date')(entry.Datum, "HH:mm:ss")));
            var date = new Date();
            var dan = new Date(date.getTime());
            dan.setDate(date.getDate() - 1);
            if(time>dan) {              
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
        
        var container = document.getElementById("graphsContainer");  
        console.log($scope.pregled.dnevni);
        var s1 ="<div id='chart";
        var s2="' class='panel panel-default' style='width: 99%'>"+
        "<div class='panel-heading'><label id='graphLabel";
        var s3="'></label></div>"+
        "<nvd3 options='options' data='pregled.dnevni' on-ready='callback'><svg style='height:300px' width=100%></svg></nvd3></div>";
        var string="";
        for(var i=0; i<$scope.pregled.dnevni.length; i++){
          string+=s1+i+s2+i+s3;
        }

        container.innerHTML=(string);
        
        for(var i=0; i<$scope.pregled.dnevni.length; i++){
          var chart = nv.models.multiBarChart()
         //.useInteractiveGuideline(true)
          ;
        
         chart.xAxis
           .tickFormat(function(d) {
            return d3.time.format('%d.%m-%H:%M')(new Date(d-3600000));})
           ;
        /* chart.x2Axis
         .tickFormat(function(d) { return d3.time.format('%d.%m')(new Date(d));})
         ;
         chart.y2Axis
         .showMaxMin(false)
         .height(300)
         ;
          chart.options=$scope.options;*/
        d3.select('#chart'+i+' svg')
          .datum([$scope.pregled.dnevni[i]])
          .transition()
          .call(chart)
          ;
            document.getElementById("graphLabel"+i).innerText="Senzor za "+$scope.pregled.dnevni[i].key;
        nv.utils.windowResize(chart.update);

        }
        

        /*for(var i=0; i<$scope.pregled.dnevni.length; i++){

          console.log($scope.pregled.dnevni[i]);
          var panel_container = document.createElement("div");
          panel_container.setAttribute("class","panel panel-default");
          panel_container.style.width="99%";
          var panel_heading = document.createElement("div");
          panel_heading.setAttribute("class","panel-heading");
          var label = document.createElement("label");
          label.innerText="Pregled senzora";
  
          var graf = document.createElement("nvd3");
          graf.setAttribute("options","options");
          graf.setAttribute("data","pregled.dnevni");


          var svg = graf.append('svg')
          .attr('width', 650 )
          .attr('height', 650)
          .append('g')
          .attr('transform', 'translate(' +10 + ',' +
          10 + ')');
          panel_heading.appendChild(label);
          panel_container.appendChild(panel_heading);
          panel_container.appendChild(graf);
          container.appendChild(panel_container);
        }*/

       
        
      });

      
      
      //console.log($scope.pregled.dnevni);
//----------------------------------------------------------------
      //Ucitani podaci, sada crtanje grafa
//----------------------------------------------------------------

      
    //----------------------------------------------------------------
      //crtanje
    //----------------------------------------------------------------
 
    };


    $scope.Init();
    //---------------------------------------------------------------------------------------------
    /*$scope.novoStanje = function(value){
      //var temp = $scope.pregled.stanice[pregled.id].id;
      $http.put('/update/izvjestaj', {dnevni: $scope.dnevni, sedmicni: $scope.sedmicni,  mjesecni: $scope.mjesecni,
        user: $scope.info.id, stanica: value}).then(function(response){
        console.log(response);
      });
    }*/
    //---------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------



  });

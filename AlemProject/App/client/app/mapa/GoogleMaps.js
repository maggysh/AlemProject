/**
 * Created by Amela on 27/12/2015.
 */
function initMap() {

  function pinColor(color){
    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 12, //velicina
      strokeColor: "black", //boja okvira
      strokeWeight: 1, //debljina okvira
      fillColor: color, //boja unutrasnjosti
      strokeOpacity: 1, //providljivost okvira
      fillOpacity: 1 // providljivost unutrasnjosti
    };
  }

  //opcije za mapu
  var myOptions =
  {
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    draggable: true,
    minZoom: 8, //zabrana  zumiranja
    maxZoom: 12,
    disableDefaultUI: true, //brisanje ikona za zumiranje
  };


  //podesavanje vizuelnog prikaza mape
  var styles = [
   {"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},
   {"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"color":"#7B7979"},
   {"weight":"2"},{"saturation":"0"},{"gamma":"1.00"},{"lightness":"0"}]},
   {"featureType":"administrative.country","elementType":"labels","stylers":[{"visibility":"off"}, {"hue":"#ff0000"}]},
   {"featureType":"administrative.country","elementType":"labels.text","stylers":[{"visibility":"off"}]},
   {"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},
   {"featureType":"administrative.country","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},
   {"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"off"}]},
   {"featureType":"administrative.province","elementType":"labels","stylers":[{"visibility":"off"}]},
   {"featureType":"administrative.locality","elementType":"all","stylers":[{"visibility":"off"}]},
   {"featureType":"administrative.locality","elementType":"geometry","stylers":[{"visibility":"off"}]},
   {"featureType":"administrative.locality","elementType":"labels","stylers":[{"visibility":"off"}]},
   {"featureType":"administrative.neighborhood","elementType":"labels","stylers":[{"visibility":"off"}]},
   {"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"visibility":"off"}]},
   {"featureType":"administrative.land_parcel","elementType":"geometry","stylers":[{"visibility":"off"}]},
   {"featureType":"administrative.land_parcel","elementType":"labels","stylers":[{"visibility":"off"}]},
   {"featureType":"landscape","elementType":"all","stylers":[{"color":"#45b099"},{"visibility":"on"}]},
   {"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#fdfdfd"},{"gamma":"1.09"},{"lightness":"23"}]},
   {"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"},{"color":"#000000"}]},
   {"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"visibility":"off"}]},
   {"featureType":"landscape.man_made","elementType":"labels","stylers":[{"visibility":"off"}]},
   {"featureType":"landscape.man_made","elementType":"labels.text","stylers":[{"visibility":"off"}]},
   {"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"simplified"}]},
   {"featureType":"landscape.natural","elementType":"labels","stylers":[{"visibility":"off"}]},
   {"featureType":"landscape.natural.terrain","elementType":"all","stylers":[{"visibility":"off"}]},
   {"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},
   {"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"off"}]},
   {"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"off"}]},
   {"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},
   {"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},
   {"featureType":"transit","elementType":"geometry","stylers":[{"visibility":"off"}]},
   {"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]},
   {"featureType":"transit.station","elementType":"all","stylers":[{"visibility":"off"}]},
   {"featureType":"transit.station.bus","elementType":"all","stylers":[{"visibility":"off"}]},
   {"featureType":"transit.station.rail","elementType":"all","stylers":[{"visibility":"off"}]},
   {"featureType":"water","elementType":"all","stylers":[{"color":"#ffffff"},{"visibility":"on"}]},
   {"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#e9e9e9"}]},
   {"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":"44"}]}
   ];

  //iscrtavanje mape
  var map = new google.maps.Map(document.getElementById('map'), myOptions);
  var infoWindow = new google.maps.InfoWindow();

  map.setOptions({styles: styles});
  var geocoder = new google.maps.Geocoder;
  geocoder.geocode({
    componentRestrictions: {
      country: 'BA' //ogranicavanje regije na bosnu
    }
  }, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
    } else {
      window.alert('Geocode was not successful for the following reason: ' +
        status);
    }
  });

  //funkcije za crtanje markera na osnovu zadanog grada
  function lokacija(geoLat, geoLng, tipStanice, grad, idStanice) {
    var geocoder2 = new google.maps.Geocoder;
    var LatLng = {lat: parseFloat(geoLat), lng: parseFloat(geoLng)};
    geocoder2.geocode({
      'location': LatLng
    }, function(results, status){
      var color;
      //definisanje boje markera na osnovu tipa stanice
      //console.log(tipStanice);
      if(tipStanice === 1) color = "#2C4992"; //HS
      if(tipStanice === 2) color = "#B4045F"; //MS
      if(tipStanice === 3) color = "#E4E133"; //PS

      var mark = new google.maps.Marker({
        title: grad,
        icon: pinColor(color), //pozivanje funkcije za boju markera
        map: map,
        //position: results[0].geometry.location
        position: LatLng
      });

      mark.addListener('click', function(){
          var string = '<b>' + grad + '</b>' + '<br>';
          $.getJSON('/senzor/' + idStanice, function(senzori){
            senzori.forEach(function (senzor) {
              //tip senzora na osnovu id-a senzora
              $.getJSON('/tipSenzora/' + senzor.TipSenzoraId, function(tip){
                //vrijednost senzora na osnovu id-a senzora
                $.getJSON('/api/home/vrijednost/' + senzor.id, function(vrijednost){
                  string += tip.Tip_Senzora + ": ";
                  string += vrijednost.Vrijednost + '<br>';
                  infoWindow.setContent(string);
                  infoWindow.open(map, mark);
                });
              });
            });
        });
      });
    });
  };

  $.getJSON('/stanica', function(stanica){
      stanica.forEach(function(value){
        lokacija(value.Geo_sirina, value.Geo_duzina, value.TipStaniceId, value.Naziv, value.id);
      })
  });

};

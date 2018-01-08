'use strict';



angular.module('appApp')
  .controller('MainController', function ($http) {
    this.$http = $http;
    //this.awesomeThings = [];
    this.awesomeThings = [
      //{name : "", info: ""},
    ];

    $http.get('/api/things').then(response => {
      //this.awesomeThings = response.data;
    });
  });

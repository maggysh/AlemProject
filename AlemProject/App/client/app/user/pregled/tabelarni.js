/**
 * Created by Amela on 28/01/2016.
 */
'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('tabelarni', {
        url: '/tabela',
        templateUrl: 'app/user/pregled/tabelarni.html',
        controller: 'tabelarniPrikazCtrl',
        resolve:
        {
          "check":function($http,$location){
          $http.get('/loggedin').then(function (response) {
            if (response.data.logged == false) $location.path('/login');
            else if(response.data.user.username == "admin") $location.path('/admin');
          });}}
      });
  });

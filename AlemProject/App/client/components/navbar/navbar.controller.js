'use strict';


angular.module('appApp')
  .controller('NavbarController', function () {
    //start-non-standard
    this.menu = [
      { 'title': 'Home', 'state': 'main'},
      { 'title': 'Login', 'state': 'login'},

    ];

    this.menuAdmin = [
      { 'title': 'Logout', 'state': 'logout'},
      { 'title': 'Dodaj korisnika', 'state': 'admin'},
      { 'title': 'Dodaj prava', 'state': 'prava'},
    ];

    this.menuUser =[
      { 'title': 'Logout', 'state': 'logout'},
      { 'title': 'Mapa', 'state': 'main'},
      { 'title': 'Tabela', 'state': 'tabelarni'},
      { 'title': 'Notifikacije', 'state': 'notifikacije'},

    ];

    this.isCollapsed = true;
    //end-non-standard
});

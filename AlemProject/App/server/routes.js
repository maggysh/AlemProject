/**
 * Main application routes
 */

'use strict';
var errors = require('./components/errors');
var path = require('path');
var models = require('./models');
var async = require('async');
var async_ForEach = require('async');
var fs = require('fs');
var pdf = require('html-pdf');
var mailer2 = require("nodemailer");
var path = require('path');
var CronJob = require('cron').CronJob;
var svi_izvjestaji = {dnevni:[],sedmicni:[],mjesecni:[]};
var user_emails = [];
var Sequelize = require('sequelize');


module.exports = function(app, passport){

  //app.post('/proba',function(req, res){
    models.user_stanica.findAll()
    .then(function(raspored_izvjestaja){
      models.user.findAll().then(function(users){
        
        users.forEach(user => {
          user_emails.push({id:user.id, email:user.email });
        });
        raspored_izvjestaja.forEach(instanca => {
          var email = user_emails.filter(function( obj ) {
            if(obj.id == instanca.UserId)
            return obj.email;
          });
          if(instanca.Dnevni==true){
            var cronTime = "00 "+instanca.DnevniTime.split(':')[1]+" "+instanca.DnevniTime.split(':')[0] + " * * *";
            var job=new CronJob({
              //sekunde minute sati dan_u_mjesecu(1-31) mjesec(0-11) dan_u_sedmici(0-6)(Sun-Sat)
              cronTime: cronTime,
              onTick: function() {   
                send_email(email,instanca.UserId,stanicaID,'d');        
              },
              start: false,
              timeZone: 'Europe/Berlin'
            });
            job.start();
            svi_izvjestaji.dnevni.push({cronJob:job,cronTime:cronTime, userID: instanca.UserId, email:email, stanicaID: instanca.StanicaId});
          }
          if(instanca.Sedmicni==true){
            var cronTime = "00 "+instanca.SedmicniTime.split(':')[1]+" "+instanca.SedmicniTime.split(':')[0] + " * * "+instanca.SedmicniDan;
            var job=new CronJob({
              //sekunde minute sati dan_u_mjesecu(1-31) mjesec(0-11) dan_u_sedmici(0-6)(Sun-Sat)
              cronTime: cronTime,
              onTick: function() {   
                send_email(email,instanca.UserId,stanicaID,'s');        
              },
              start: false,
              timeZone: 'Europe/Berlin'
            });
            job.start();
            svi_izvjestaji.sedmicni.push({cronJob:job,cronTime:cronTime, userID: instanca.UserId, email:email, stanicaID: instanca.StanicaId});
          }
          if(instanca.Mjesecni==true){
            var cronTime = "00 "+instanca.MjesecniTime.split(':')[1]+" "+instanca.MjesecniTime.split(':')[0] + " "+ instanca.MjesecniDan +" * *";
            var job=new CronJob({
              //sekunde minute sati dan_u_mjesecu(1-31) mjesec(0-11) dan_u_sedmici(0-6)(Sun-Sat)
              cronTime: cronTime,
              onTick: function() {   
                send_email(email,instanca.UserId,stanicaID,'m');        
              },
              start: false,
              timeZone: 'Europe/Berlin'
            });
            job.start();
            svi_izvjestaji.mjesecni.push({cronJob:job,cronTime:cronTime, userID: instanca.UserId, email:email, stanicaID: instanca.StanicaId});
          }
        });

        //send_email("brgulja.lejla@gmail.com", 13,42,'s');     
        //send_email("brgulja.lejla@gmail.com", 13,42,'m'); 
        //send_email("brgulja.lejla@gmail.com", 13,42,'d');  
    
      });
    });
    
   // res.end();
 // });


  //===========================================================================================================
  // Rute za login/logout. Passport rute.
  //===========================================================================================================
  app.get('/loggedin', function (req, res) {
    res.json({logged: req.isAuthenticated(), user: req.user});
  });

  app.post('/login', passport.authenticate('local-login', {
      successRedirect: '/logged',
      failureRedirect: '/loginfailed',
      failureFlash: true
    })
  );

  app.get('/loginsucces', function (req, res) {
    res.json({success: true, message: 'Successufly logged in'});
  });

  app.get('/loginfailed', function (req, res) {
    res.json({success: false, message: 'Failed to log in'});
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  //===========================================================================================================
  // Update user_stanice na osnovu proslijeđenih podataka (automatsko generisanje izvjestaja)
  //===========================================================================================================

  app.put('/update/izvjestaj', function(req,res){
    console.log("prije update: ");
    console.log(svi_izvjestaji);
    svi_izvjestaji.dnevni.forEach(izvjestaj => {
      console.log('job status: ', izvjestaj.cronJob.running);
    });
    svi_izvjestaji.sedmicni.forEach(izvjestaj => {
      console.log('job status: ', izvjestaj.cronJob.running);
    });
    svi_izvjestaji.mjesecni.forEach(izvjestaj => {
      console.log('job status: ', izvjestaj.cronJob.running);
    });
   /* console.log({
      Dnevni: req.body.dnevni,
      Sedmicni: req.body.sedmicni,
      Mjesecni: req.body.mjesecni,
      DnevniTime: req.body.DnevniTime,
      SedmicniTime: req.body.SedmicniTime,
      MjesecniTime: req.body.MjesecniTime,
      SedmicniDan: req.body.SedmicniDan,
      MjesecniDan: req.body.MjesecniDan
    });*/
    var email = user_emails.filter(function( obj ) {
      if(obj.id == req.body.user)
      return obj.email;
    });

    var dnevniPostoji=false;
    svi_izvjestaji.dnevni.forEach(izvjestaj => {
      if(izvjestaj.userID==req.body.user && izvjestaj.stanicaID==req.body.stanica){
        if(req.body.dnevni==1 && izvjestaj.cronTime!="00 "+req.body.DnevniTime.split(':')[1]+" "+req.body.DnevniTime.split(':')[0] + " * * *"){
          izvjestaj.cronJob.stop();
          izvjestaj.cronTime="00 "+req.body.DnevniTime.split(':')[1]+" "+req.body.DnevniTime.split(':')[0] + " * * *";
          var job=new CronJob({
            //sekunde minute sati dan_u_mjesecu(1-31) mjesec(0-11) dan_u_sedmici(0-6)(Sun-Sat)
            cronTime: izvjestaj.cronTime,
            onTick: function() {   
              send_email(email,req.body.user,izvjestaj.stanicaID,'d');          
            },
            start: false,
            timeZone: 'Europe/Berlin'
          });
          izvjestaj.cronJob=job;
          izvjestaj.cronJob.start();
        }else if(req.body.dnevni==0){
          izvjestaj.cronJob.stop();
          izvjestaj.cronJob=null;
          var index = svi_izvjestaji.dnevni.indexOf(izvjestaj);
          svi_izvjestaji.dnevni.splice(index, 1);
        }
        dnevniPostoji=true;
      }
    });
    if(dnevniPostoji==false && req.body.dnevni==1){
      var cronTime =cronTime="00 "+req.body.DnevniTime.split(':')[1]+" "+req.body.DnevniTime.split(':')[0] + " * * *";
      var job=new CronJob({
        //sekunde minute sati dan_u_mjesecu(1-31) mjesec(0-11) dan_u_sedmici(0-6)(Sun-Sat)
        cronTime: cronTime,
        onTick: function() {   
          send_email(email,req.body.user,izvjestaj.stanicaID,'d');        
        },
        start: false,
        timeZone: 'Europe/Berlin'
      });

      job.start();
      svi_izvjestaji.dnevni.push({cronJob:job,cronTime:cronTime, userID: req.body.user, email:email, stanicaID: req.body.stanica});
    }

    var sedmicniPostoji=false;
    svi_izvjestaji.sedmicni.forEach(izvjestaj => {

      if(izvjestaj.userID==req.body.user && izvjestaj.stanicaID==req.body.stanica){
        if(req.body.sedmicni==1 && izvjestaj.cronTime!="00 "+req.body.SedmicniTime.split(':')[1]+" "+req.body.SedmicniTime.split(':')[0] + " * * "+req.body.SedmicniDan){
          izvjestaj.cronJob.stop();
          izvjestaj.cronTime="00 "+req.body.SedmicniTime.split(':')[1]+" "+req.body.SedmicniTime.split(':')[0] + " * * "+req.body.SedmicniDan;
          var job=new CronJob({
            //sekunde minute sati dan_u_mjesecu(1-31) mjesec(0-11) dan_u_sedmici(0-6)(Sun-Sat)
            cronTime: izvjestaj.cronTime,
            onTick: function() {   
              send_email(email,req.body.user,izvjestaj.stanicaID,'s');        
            },
            start: false,
            timeZone: 'Europe/Berlin'
          });
          izvjestaj.cronJob=job;
          izvjestaj.cronJob.start();
        }else if(req.body.sedmicni==0){
          izvjestaj.cronJob.stop();
          izvjestaj.cronJob=null;
          var index = svi_izvjestaji.sedmicni.indexOf(izvjestaj);
          svi_izvjestaji.sedmicni.splice(index, 1);
        }
        sedmicniPostoji=true;
      }
    });

    if(sedmicniPostoji==false && req.body.sedmicni==1){
      var cronTime ="00 "+req.body.SedmicniTime.split(':')[1]+" "+req.body.SedmicniTime.split(':')[0] + " * * "+req.body.SedmicniDan;
      var job=new CronJob({
        //sekunde minute sati dan_u_mjesecu(1-31) mjesec(0-11) dan_u_sedmici(0-6)(Sun-Sat)
        cronTime: cronTime,
        onTick: function() {   
          send_email(email,req.body.user,izvjestaj.stanicaID,'s');        
        },
        start: false,
        timeZone: 'Europe/Berlin'
      });
      job.start();
      svi_izvjestaji.sedmicni.push({cronJob:job,cronTime:cronTime, userID: req.body.user, email:email, stanicaID: req.body.stanica});
    
    }

    var mjesecniPostoji = false;
    svi_izvjestaji.mjesecni.forEach(izvjestaj => {
      if(izvjestaj.userID==req.body.user && izvjestaj.stanicaID==req.body.stanica){
        if(req.body.mjesecni==1 && izvjestaj.cronTime!="00 "+req.body.MjesecniTime.split(':')[1]+" "+req.body.MjesecniTime.split(':')[0] + " "+ req.body.MjesecniDan +" * *"){
          izvjestaj.cronJob.stop();
          izvjestaj.cronTime="00 "+req.body.MjesecniTime.split(':')[1]+" "+req.body.MjesecniTime.split(':')[0] + " "+ req.body.MjesecniDan +" * *";
          var job=new CronJob({
            //sekunde minute sati dan_u_mjesecu(1-31) mjesec(0-11) dan_u_sedmici(0-6)(Sun-Sat)
            cronTime: izvjestaj.cronTime,
            onTick: function() {   
              send_email(email,req.body.user,izvjestaj.stanicaID,'m');        
            },
            start: false,
            timeZone: 'Europe/Berlin'
          });
          izvjestaj.cronJob=job;
          izvjestaj.cronJob.start();
        }else if(req.body.mjesecni==0){
          izvjestaj.cronJob.stop();
          izvjestaj.cronJob=null;
          var index = svi_izvjestaji.mjesecni.indexOf(izvjestaj);
          svi_izvjestaji.mjesecni.splice(index, 1);
        }
      mjesecniPostoji=true;
      }
    });

    if(mjesecniPostoji==false && req.body.mjesecni==1){

      var cronTime ="00 "+req.body.MjesecniTime.split(':')[1]+" "+req.body.MjesecniTime.split(':')[0] + " "+ req.body.MjesecniDan +" * *";
        var job=new CronJob({
          //sekunde minute sati dan_u_mjesecu(1-31) mjesec(0-11) dan_u_sedmici(0-6)(Sun-Sat)
          cronTime: cronTime,
          onTick: function() {   
            send_email(email,req.body.user,izvjestaj.stanicaID,'m');        
          },
          start: false,
          timeZone: 'Europe/Berlin'
        });
        job.start();
        svi_izvjestaji.mjesecni.push({cronJob:job,cronTime:cronTime, userID: req.body.user, email:email, stanicaID: req.body.stanica});
    }

    console.log("nakon update: ");
    console.log(svi_izvjestaji);
    svi_izvjestaji.dnevni.forEach(izvjestaj => {
      console.log('job status: ', izvjestaj.cronJob.running);
    });
    svi_izvjestaji.sedmicni.forEach(izvjestaj => {
      console.log('job status: ', izvjestaj.cronJob.running);
    });
    svi_izvjestaji.mjesecni.forEach(izvjestaj => {
      console.log('job status: ', izvjestaj.cronJob.running);
    });

    models.user_stanica.find({where:{UserId: req.body.user, StanicaId: req.body.stanica}}).then(function(response){
      return response.updateAttributes({
        Dnevni: req.body.dnevni,
        Sedmicni: req.body.sedmicni,
        Mjesecni: req.body.mjesecni,
        DnevniTime: req.body.DnevniTime,
        SedmicniTime: req.body.SedmicniTime,
        MjesecniTime: req.body.MjesecniTime,
        SedmicniDan: req.body.SedmicniDan,
        MjesecniDan: req.body.MjesecniDan
      });
    })

  });
  //===========================================================================================================
  // Update user_senzora na osnovu proslijeđenih podataka
  //===========================================================================================================

  app.put('/update/notifikacije', function(req,res){

    models.user_senzor.find({where:{UserId: req.body.user, SenzorId: req.body.senzor}}).then(function(response){
      return response.updateAttributes({
        Max: req.body.max,
        Min: req.body.min,
      });
    })

  });
  //===========================================================================================================
  // Update stanice na osnovu proslijeđenih podataka
  //===========================================================================================================

  app.put('/update/stanica', function(req,res){

      models.stanica.find({where:{id: req.body.id}}).then(function(stanicaZU){
          return stanicaZU.updateAttributes({
            Naziv: req.body.naziv,
            Kod_stanice: req.body.kod,
            Geo_sirina: req.body.sirina,
            Geo_duzina: req.body.duzina
         });
      })

  });
  //===========================================================================================================
  // Update senzora na osnovu proslijeđenih podataka
  //===========================================================================================================

  app.put('/update/senzor', function(req,res){

    models.senzor.find({where:{id: req.body.id}}).then(function(senzorZU){
        return senzorZU.updateAttributes({
              Kod_senzora: req.body.kod
        });
    })

  });

  //===========================================================================================================
  // Update vrijednosti na osnovu proslijeđenih podataka
  //===========================================================================================================

  app.put('/update/vrijednost', function(req,res){

    models.vrijednost.find({where:{id: req.body.id}}).then(function(vrijednostZU){
      return vrijednostZU.updateAttributes({
          Vrijednost: req.body.vrijednost
      });
    })

  });

  //===========================================================================================================
  // Ruta koja kreira novu stanicu u bazi
  //===========================================================================================================
  app.post('/create/stanica', function(req, res){

    models.stanica.sync().then(function() {
      return models.stanica.create({
        Naziv: req.body.naziv,
        Kod_stanice: req.body.kod,
        Geo_sirina: req.body.sirina,
        Geo_duzina: req.body.duzina,
        TipStaniceId: req.body.stanicatip,
      }).then(function(){
        res.end();
      })
    })

  });

  //===========================================================================================================
  // Ruta koja kreira novi senzor za odredjenu stanicu
  //===========================================================================================================
  app.post('/create/senzor', function(req, res){

    models.senzor.sync().then(function() {
      return models.senzor.create({
        Kod_senzora: req.body.kod,
        StanicaId: req.body.stanica,
        TipSenzoraId: req.body.senzor
      }).then(function(){
        res.end;
      })
    })

  });

  //===========================================================================================================
  // Ruta koja briše stanicu na osnovu njenog id-a
  //===========================================================================================================
  app.delete('/delete/stanica/:id', function(req, res){

    models.stanica.sync().then(function() {
      models.stanica.find({where:{id: req.params.id}}).then(function(stanicaZB){
          stanicaZB.destroy().then(function(){
            res.end;
          })
      })
    });

  });

  //===========================================================================================================
  // Ruta koja briše vrijednost na osnovu njenog id-a
  //===========================================================================================================
  app.delete('/delete/vrijednost/:id', function(req, res){

    models.vrijednost.sync().then(function() {
      models.vrijednost.find({where:{id: req.params.id}}).then(function(vrijednostZB){
         vrijednostZB.destroy().then(function(){
           res.end;
         })
      })
    });

  });

  //===========================================================================================================
  // Ruta koja briše senzor na osnovu njegovog id-a
  //===========================================================================================================
  app.delete('/delete/senzor/:id', function(req, res){

    async.waterfall([

        function(callback){
          models.vrijednost.sync().then(function() {
            models.vrijednost.findAll({where:{SenzorId: req.params.id}}).then(function(vrijednostZB){
              async.forEachOf(vrijednostZB, function(entry, key, callback){
                entry.destroy();
                callback();
              }, function(err){
                callback(null);
              });
            })
          });
        },

        function(callback){
          models.senzor.sync().then(function(){
            models.senzor.find({where:{id: req.params.id}}).then(function(stanicaZB){
               stanicaZB.destroy().then(function(){
                 res.end;
               })
               callback(null);
            });
          });
        }
      ],
      function(err){
          return
      });


  });

  //===========================================================================================================
  // Ruta koja kreira novog korisnika u bazi
  //===========================================================================================================
  app.post('/create/user', function(req, res){

    models.user.sync().then(function() {
      return models.user.create({
        ime_prezime: req.body.name,
        username: req.body.user,
        password: req.body.pw,
        email: req.body.mail,
        firma: req.body.firm
      }).then(function(){
        res.end;
      })
    })

  });

  //===========================================================================================================
  // Ruta kooja mijenja e-mail korisnika u bazi
  //===========================================================================================================
  app.post('/edit/user/email', function(req, res){
    models.user.update(
      { email: req.body.email }, 
      { where: { id: req.body.id }}
    );
    res.end();
  });
  //===========================================================================================================
  // Ruta koja kreira unos u tabeli user_stanica. Omogućava da korisnik ima pristup stanici.
  //===========================================================================================================
  app.post('/api/admin/prava', function(req, res){

    async.waterfall([
        function(callback){

          models.user_stanica.sync().then(function() {
              models.user_stanica.create({  //return
                 UserId: req.body.user,
                 StanicaId: req.body.stanica,
             });
                callback(null);
          });

        },
      function(callback){

        models.senzor.findAll({where: {StanicaId: req.body.stanica }}).then(function(data){
          async.forEachOf(data, function(entry, key, callback){
            models.user_senzor.sync().then(function(){
              models.user_senzor.create({
                UserId : req.body.user,
                SenzorId: entry.dataValues.id
              }).then(function(){
                res.end;
              })
            });
            callback(null);
          }, function(err){
            callback(null);
          });
        });

      },
      function(arg1, callback){

        }

      ],
      function(err, result){
        return;
      });

  });

  //===========================================================================================================
  // Ruta koja kreira unos u tabeli vrijednosti za proslijeđene parametre senzora
  //===========================================================================================================
  app.post('/create/vrijednost', function(req, res){

    models.vrijednost.sync().then(function() {
      return models.vrijednost.create({
        Vrijednost: req.body.vrijednost,
        Datum: req.body.datum,
        SenzorId: req.body.senzorId
      }).then(function(){
        res.end;
      })
    })

  });
  //===========================================================================================================
  //=============== UZIMANJE PODATAKA NA OSNOVU ID-a ==========================================================
  //===========================================================================================================
  app.get('/senzor/:id', function(req, res){
    models.senzor.findAll({ where: { StanicaId: req.params.id } }).then(function(senzor){
   //   console.log(senzor);//*********************************OBRISAIT
      res.json(senzor);
    })
  });

  //Ruta se ponavlja potrebno je obrisati !!!!
  app.get('/stanica/:id', function(req, res){
    models.stanica.findAll({ where: { id: req.params.id } }).then(function(stanica){
      res.json(stanica);
    })
  });

  app.get('/tipSenzora/:id', function(req, res){
    models.tip_senzora.find({ where: {id: req.params.id } }).then(function(tipSenzora){
      res.json(tipSenzora);
    })
  });

  app.get('/api/home/stanica/:id', function(req, res){
    models.stanica.find({ where: { id: req.params.id } }).then(function(stanica){
      res.json(stanica);
    })
  });

  app.get('/api/home/vrijednost/:id', function(req,res){
    models.vrijednost.find({ where: { SenzorId: req.params.id }, order: 'id DESC' }).then(function(vrijednost){
      res.json(vrijednost);
    });
  });

  //===========================================================================================================
  // Ruta za dobijanje svih potrebnih podataka za popunjavanje forme za ručno dodavanje senzora
  //===========================================================================================================

  app.get('/api/admin/dodavanje/senzor', function(req, res) {

    async.waterfall([

      function(callback){
        models.stanica.findAll().then(function(data){
          callback(null, data);
        });
      },

      function(arg1, callback){
        models.tip_senzora.findAll().then(function(value){
            var jsonObj = {"stanice": arg1, "tip_senzora": value};
            callback(null,jsonObj);
        });
      },

    ],
    function(err, result){
      res.json(result);
    });

});

  //===========================================================================================================
  // Ruta za dobijanje svih potrebnih podataka za popunjavanje forme za ručno dodavanje vrijednosti
  //===========================================================================================================

  app.get('/api/admin/dodavanje/vrijednost', function(req, res){

    async.waterfall([

      function(callback){
        models.stanica.findAll({
          include: [
            {
              model: models.senzor,
              include:[{model: models.tip_senzora}]
            }
          ]
        }).then(function(data){
          callback(null, data);
        });
      },
    ],
    function(err, result){
      res.json(result);
    });

  });

  //===========================================================================================================
  // Ruta za dobijanje svih potrebnih podataka za popunjavanje forme za ručno brisanje vrijednosti
  //===========================================================================================================

  app.get('/api/admin/brisanje/vrijednost/data', function(req, res){

    async.waterfall([

      function(callback){
        models.vrijednost.findAll({
          include: [
            {
              model: models.senzor,
              include:[{model: models.stanica}, {model: models.tip_senzora}]
            }
          ]
        }).then(function(data){
          callback(null, data);
        });
      },
    ],
    function(err, result){
      res.json(result);
    });

});

  //===========================================================================================================
  // Ruta za dobijanje svih potrebnih podataka za popunjavanje forme za ručno brisanje senzora
  //===========================================================================================================

  app.get('/api/admin/brisanje/senzor/data', function(req, res){

    async.waterfall([

      function(callback){
        models.stanica.findAll().then(function(data){
          callback(null, data);
        });
      },

      function(arg1, callback){

        var jsonObj = [];

        async.forEachOf(arg1, function(entry, key, callback){
          models.senzor.findAll({where: {StanicaId: entry.dataValues.id}}).then(function(data){

              jsonObj.push({"stanica": entry.dataValues.Naziv, "senzori": data});
              callback(null, jsonObj);
          });
        }, function(err){
          callback(null, jsonObj);
        });

        //callback(null, "done");

      },

    ],
    function(err, result){
      res.json(result);
    });

});

  //===========================================================================================================
  // Ruta za dobijanje zadnje vrijednosti i imena stanice svih senzora kojima id tipa senzora odgovara parametru
  // koji se prosljedjuje. Ruta se koristi za prosljedjivanje podataka graph kontroleru. Podaci su sortiranu po
  // imenu stanice.
  //===========================================================================================================

  app.get('/api/home/graph/:id', function(req, res){

    async.waterfall([
          function(callback){
            models.senzor.findAll({where: {TipSenzoraId: req.params.id }, include: [{model: models.stanica}]}).then(function(data){
              callback(null, data);
            });
          },
          function(arg1, callback){
            var jsonObj = [];
            async.forEachOf(arg1, function(entry, key, callback){
                    models.vrijednost.find({where: {SenzorId: entry.id}, order: 'id DESC'}).then(function(value){
                      if( value != null)
                        jsonObj.push({"label": entry.Stanica.Naziv, "value": value.dataValues.Vrijednost});
                      callback(null);

                    });
              }, function(err){
                  callback(null, jsonObj);
              });
          },

          function(arg2, callback){
            arg2.sort(function(a,b){
             return ((a.label == b.label) ? 0 : ((a.label > b.label) ? 1 : -1 ));
            });
            callback(null, arg2);
            },
      ],
          function(err, results){
            res.json(results);
          });

});

  //===========================================================================================================
  // Ruta za uzimanje podataka o dozvoljenim stanicama za korisnika
  //===========================================================================================================
  app.get('/api/user/link/:id', function(req, res){

    async.waterfall([

        function(callback){
          models.user_stanica.findAll({where: {UserId: req.params.id}}).then(function(userstanica){
            callback(null, userstanica);
          })
        },
        function(arg1, callback){

          var jsonObj = [];

          async.forEachOf(arg1, function(entry, key, callback){
            models.stanica.findAll({where: {id: entry.dataValues.StanicaId}}).then(function(data){

              jsonObj.push(data);
              callback(null, jsonObj);
            });
          }, function(err){
            callback(null, jsonObj);
          });
          //callback(null, "done");
        },
      ],
      function(err, result){
        res.json(result);
      });

  });
  //===========================================================================================================
  // Ruta za podesavanje automatski generisanih izvjestaja
  //===========================================================================================================
  app.get('/api/user/izvjestaj/automatski/:id', function(req, res){

    async.waterfall([

        function(callback){
          models.user_stanica.findAll({where: {UserId: req.params.id}}).then(function(userstanica){
            callback(null, userstanica);
          })
        },
        function(arg1, callback){

          var jsonObj = [];

          function odredi(value){
            if(value) return 'Da';
            else return 'Ne';
          }

          async.forEachOf(arg1, function(entry, key, callback){
            models.stanica.findAll({where: {id: entry.dataValues.StanicaId}}).then(function(data){
                //console.log(data);
              var a = odredi(entry.dataValues.Dnevni);
              var b = odredi(entry.dataValues.Sedmicni);
              var c = odredi(entry.dataValues.Mjesecni);
              jsonObj.push({
                'id': data[0].dataValues.id,
                'Naziv': data[0].dataValues.Naziv,
                'Kod_stanice': data[0].dataValues.Kod_stanice,
                'Dnevni':  a,//entry.dataValues.Dnevni,
                'Sedmicni': b,
                'Mjesecni': c,
                'DnevniTime':entry.dataValues.DnevniTime,
                'SedmicniTime':entry.dataValues.SedmicniTime,
                'MjesecniTime':entry.dataValues.MjesecniTime,
                'SedmicniDan':entry.dataValues.SedmicniDan,
                'MjesecniDan':entry.dataValues.MjesecniDan 
              })
              callback(null, jsonObj);
            });
          }, function(err){
            callback(null, jsonObj);
          });
          //callback(null, "done");
        },
      ],
      function(err, result){
        res.json(result);
      });

  });
  //===========================================================================================================
  // Ruta za uzimanje svih vrijednosti za svaki senzor u stanici. Ruta je privremeno za uzimanje svih vrijednosti
  // i bit će modifikovana da uzima samo vrijednosti u protekla 24 sata
  //===========================================================================================================
  app.get('/api/user/pregled/dnevni/:id', function(req, res){

    async.waterfall([

        function(callback){
          models.senzor.findAll({where: {StanicaId: req.params.id}, include: [
            {
              model: models.tip_senzora,
            }
          ]}).then(function(senzor){
            callback(null, senzor);
          })
        },
        function(arg1, callback){

          var jsonObj = [];

          async.forEachOf(arg1, function(entry, key, callback){
            models.vrijednost.findAll({where: {SenzorId: entry.dataValues.id}, order:[['Datum', 'ASC']]}).then(function(data){
              if(data!=null)
                jsonObj.push({"senzor": entry, "vrijednosti": data});
              callback(null, jsonObj);
            });
          }, function(err){
            callback(null, jsonObj);
          });
        },
      ],
      function(err, result){
        res.json(result);
      });

  });

  //===========================================================================================================
  // RUTA KOJA SE KORISTI ZA DOBIJANEJ PODATAKA U TABU NOTIFIKACIJE
  //===========================================================================================================
  app.get('/api/notifikacije/:id', function(req, res){

    async.waterfall([

        function(callback){
          models.user_senzor.findAll({where: {UserId: req.params.id}}).then(function(data){
            callback(null, data);
          })
        },
        function(arg1, callback){

          var jsonObj = [];

          async.forEachOf(arg1, function(entry, key, callback){
            models.senzor.findAll({where: {id: entry.dataValues.SenzorId}, include: [{model: models.stanica}]}).then(function(data){
              if(jsonObj.indexOf(data[0].dataValues.Stanica.dataValues.id) === -1){
                jsonObj.push(data[0].dataValues.Stanica.dataValues.id);
              }
              callback(null, jsonObj, arg1);
            });
          }, function(err){
            callback(null, jsonObj, arg1);
          });

        },

        function(arg2, arg3, callback){

          var jsonObj=[];

          async.forEachOf(arg2, function(entry, key, callback){
            models.stanica.findAll({where: {id: entry}}).then(function(data){
                models.senzor.findAll({where: {StanicaId: entry}, include: [{model: models.tip_senzora}]}).then(function(values){

                  var obj = [];

                  async.forEachOf(values, function(entry, key, callback){
                      //console.log(entry);
                      models.user_senzor.findAll({where: {UserId: req.params.id, SenzorId: entry.dataValues.id}}).then(function(result){
                        //var temp = entry.dataValues.Tip_senzora;
                        //var tempTemp = temp.dataValues.Tip_Senzora;
                        obj.push({
                          "id": entry.dataValues.id,
                          "Kod_senzora": entry.dataValues.Kod_senzora,
                          //"Tip_senzora": entry.dataValues.TipSenzoraId, slucajno ovo
                          "Max": result[0].dataValues.Max,
                          "Min": result[0].dataValues.Min,
                          "Tip_senzora": entry.dataValues.Tip_senzora.dataValues.Tip_Senzora
                          //"Tip_senzora": "a"
                        });
                        callback(null, obj);
                      });

                  }, function(err){
                    jsonObj.push({"stanica": data[0].dataValues, "senzori": obj});
                    callback(null, jsonObj);
                  });

                })
            });
          }, function(err){
            callback(null, jsonObj);
          });

        },

      ],
      function(err, result){
        res.json(result);
      });

  });

  //===========================================================================================================
    // Ruta za uzimanje svih vrijednosti za odredjeni senzor u stanici. Ruta je privremeno za uzimanje svih
    // vrijednosti i bit će modifikovana
    //===========================================================================================================
    app.get('/api/user/pregled/dnevni/:id/:tip', function(req, res){

      async.waterfall([

          function(callback){
            models.senzor.findAll({where: {StanicaId: req.params.id, TipSenzoraId: req.params.tip}, include: [
              {
                model: models.stanica,
              }
            ]}).then(function(senzor){
              callback(null, senzor);
            })
          },
          function(arg1, callback){

            var jsonObj = [];

            async.forEachOf(arg1, function(entry, key, callback){
              models.vrijednost.findAll({where: {SenzorId: entry.dataValues.id}, order:[['Datum', 'ASC']]}).then(function(data){

                jsonObj.push({"senzor": entry, "vrijednosti": data});
                callback(null, jsonObj);
              });
            }, function(err){
              callback(null, jsonObj);
            });
          },
        ],
        function(err, result){
          res.json(result);
        });

    });

    //===========================================================================================================
        //RUTA_IZVJESTAJ Pronalazi sve vrijednosti za odabranu stanicu koje su u okviru odabranih datuma
        //===========================================================================================================
        app.get('/api/user/izvjestaj/:id', function(req, res){

          async.waterfall([

              function(callback){
                models.senzor.findAll({where: {StanicaId: req.params.id}, include: [{model: models.tip_senzora}]}).then(function(senzor){
                  callback(null, senzor);
                })
              },

              function(arg1, callback){
                var jsonObj = [];
                async.forEachOf(arg1, function(entry, key, callback){
                  models.vrijednost.findAll({where: {SenzorId: entry.dataValues.id}}).then(function(data){

                    jsonObj.push({"senzor": entry, "vrijednosti": data});
                    callback(null, jsonObj);
                  });
                }, function(err){
                  callback(null, jsonObj);
                });
              },
            ],
            function(err, result){
              res.json(result);
            });

        });

    //===========================================================================================================
    // Ruta za uzimanje svih vrijednosti za odredjeni senzor u stanici uključujući i podatke o stanici.
    // Ruta je privremeno za uzimanje svih vrijednosti i bit će modifikovana
    //===========================================================================================================
        app.get('/api/user/pregled/tabela/:id', function(req, res){

          async.waterfall([

              function(callback){
                models.senzor.findAll({where: {StanicaId: req.params.id}, include: [
                  {model: models.stanica},
                  {model: models.tip_senzora}
                ]}).then(function(senzor){
                  callback(null, senzor);
                })
              },
              function(arg1, callback){

                var jsonObj = [];

                async.forEachOf(arg1, function(entry, key, callback){
                  models.vrijednost.findAll({where: {SenzorId: entry.dataValues.id}}).then(function(data){

                    jsonObj.push({"senzor": entry, "vrijednosti": data});
                    callback(null, jsonObj);
                  });
                }, function(err){
                  callback(null, jsonObj);
                });
              },
            ],
            function(err, result){
              res.json(result);
            });

        });

  //===========================================================================================================
  //=============== UZIMANJE PODATAKA ZA LOGOVANOG KORISNIKA ==================================================
  //===========================================================================================================
  app.get('/api/user/senzor/:id', function(req, res){
    models.senzor.findAll({where: {StanicaId: req.params.id}}).then(function(senzor){
      res.json(senzor);
    })
  });

  app.get('/api/user/vrijednost/:id', function(req, res){
    models.vrijednost.findAll({where: {SenzorId: req.params.id}}).then(function(vrijednost){
      res.json(vrijednost);
    })
  });

  //===========================================================================================================
  //=============== UZIMANJE SVIH PODATAKA ====================================================================
  //===========================================================================================================
  app.get('/stanica', function(req,res){
    models.stanica.findAll().then(function(stanica){
      res.json(stanica);
    });
  });

  app.get('/tip_senzora', function(req,res){
      models.tip_senzora.findAll().then(function(tip_senzora){
        res.json(tip_senzora);
      });
    });

  app.get('/tip_stanice', function(req,res){
    models.tip_stanice.findAll().then(function(tip_stanice){
      res.json(tip_stanice);
    });
  });

  app.get('/senzor', function(req,res){
    models.senzor.findAll().then(function(senzor){
      res.json(senzor);
    });
  });

  app.get('/api/user', function(req,res){
    models.user.findAll().then(function(user){
      res.json(user);
    });
  });
  //===========================================================================================================
  // Funkcija koja šalje izvještaj na zadani email u određennom formatu sa datim podacima
  //===========================================================================================================

  var send_email= function(email,userID, stanicaID,type){ // type: 'd'-dnevni,'m'-mjesecni,'s'-sedmicni
    var startDate = new Date();
    if(type=='d'){
      startDate.setDate(startDate.getDate() - 1);  
    }else if(type=='m'){
      startDate.setMonth(startDate.getMonth() - 1); 
    }else if(type=='s'){
      startDate.setDate(startDate.getDate() - 7);  
    }

    async.waterfall([
      function(callback){
        models.user_stanica.findAll({where: {UserId: userID}}).then(function(userstanica){
          callback(null, userstanica);
        })
      },
      function(arg1, callback){
        var jsonObj = [];
        async.forEachOf(arg1, function(entry, key, callback){
          models.stanica.findAll({where: {id: entry.dataValues.StanicaId}}).then(function(data){

            jsonObj.push(data);
            callback(null, jsonObj);
          });
        }, function(err){
          callback(null, jsonObj);
        });
      },
    ],
    function(err, result){
      var prvi=result;
      async.waterfall([

        function(callback){
          models.senzor.findAll({where: {StanicaId: stanicaID}, include: [{model: models.tip_senzora}]}).then(function(senzor){
            callback(null, senzor);
          })
        },
  
        function(arg1, callback){
          var jsonObj = [];
          async.forEachOf(arg1, function(entry, key, callback){//izmjena query-a
            models.vrijednost.findAll({where: [{SenzorId: entry.dataValues.id}, {Datum: {$gte:startDate}}]}).then(function(data){
  
              jsonObj.push({"senzor": entry, "vrijednosti": data});
              callback(null, jsonObj);
            });
          }, function(err){
            callback(null, jsonObj);
          });
        },
      ],
      function(err, result){
        var pregledStanice=prvi;
        var coll=result;
        var collection=[];
        for(var i=0; i<coll.length; i++){
          for(var j=0; j<coll[i].vrijednosti.length; j++){
            var time = '';
            time = new Date(coll[i].vrijednosti[j].Datum);
      
            if(time>startDate) {
              time = time.getTime();

              var datumDodjele=(coll[i].vrijednosti[j].Datum).toISOString().replace(/T/, ' ').replace(/\..+/, '');
              var dijelovi=datumDodjele.split(' ');
              var dat=(dijelovi[0].split('-')).reverse();
              var vr=dijelovi[1].split(':');
              if((parseInt(vr[0])+1)<10) vr[0]='0'+(parseInt(vr[0])+1).toString();
              else vr[0]=(parseInt(vr[0])+1).toString();
              datumDodjele=dat[0]+'.'+dat[1]+'.'+dat[2]+' '+vr[0]+':'+vr[1]+':'+vr[2];

              collection.push({
                "Vrijednost": coll[i].vrijednosti[j].Vrijednost,
                "Datum": datumDodjele,
                "Kod_senzora": coll[i].senzor.Kod_senzora,
                "Tip_senzora": coll[i].senzor.Tip_senzora.Tip_Senzora,
              });
            }
          }
        }    
        //---Priprema izvjestaja---------------------------------
        var preparedData={};
        var d={};
        if(type=='d'){
          preparedData = tipoviSenzora_satnica(collection);
          d = prepareDataForPdf(preparedData.collection,preparedData.distinctTipSenzora,4);
        }else{
          preparedData = tipoviSenzora_AVG(collection);
          d = prepareDataForPdf(preparedData.collection,preparedData.distinctTipSenzora,2);
        }
        
        var columns= d.columns;
        var result = d.result;

        var filename="Izvjestaj"+"_"+userID+"_"+stanicaID+"_"+type;
        var text="";
        var attachments=[];

        var options = { format: 'Letter' };
        
        var tableBody="";
        for(var i=0; i<columns.length; i++){
          var tbl="<table border='1'>";
          for(var j=0; j<columns[i].length; j++){
            if(j==0) tbl+="<tr>";
            tbl+="<th>"+columns[i][j]+"</th>";
          }
          tbl+="</tr>";
          for(var j=0; j<result[i].length; j++){
            tbl+="<tr>";
            for(var k=0; k<columns[i].length; k++){
              var vr=result[i][j][columns[i][k]];
              if(vr==undefined) vr="";
              tbl+="<td>"+vr+"</td>";
              
              
            }
            tbl+="</tr>";
          }
          tbl+="</table><br>";
          tableBody+=tbl;
        }
          
        //----Kreiranje PDF izvjestaja------//
        var create_pdf = function () {
          return new Promise(function (resolve, reject) {
            pdf.create("<html><header></header><body>"+tableBody+"</body></html>", options)
            .toFile('./'+filename+'.pdf', function(err, res) {
              if (err) return console.log(err);
              console.log(res); 
            //----Kreiranje attachmenta na kreirani fajl------//
              var attachments = [
                { 
                  filename: filename,
                  path: './'+filename+'.pdf',
                  contentType: 'application/pdf' 
                }
              ];
            //----Kreiranje e-maila------//
              var mail = {
                from: "node proba <alemsistem365@gmail.com>",
                to: email,
                subject: "Podaci kao fajl",
                text: "Podaci su u attachmentu",
                html: "Podaci su u attachmentu",
                attachments : attachments
              };
              var smtpTransport = mailer2.createTransport({
                service: "Gmail",
                auth: {
                    user: "alemsistem365@gmail.com",
                    pass: "Alem123Sistem"
                }
              });
            
            //----Slanje e-maila------//
              smtpTransport.sendMail(mail, function(error, response){
                if(error){
                    console.log(error);
                }else{
                    console.log("Message sent: " + response.message);
                }
                smtpTransport.close();

              resolve();  
              });
            });
          });
        }

      //----Brisanje kreiranog izvjestaja------//
        Promise.resolve(create_pdf()).then(function () {
          fs.unlink('./'+filename+'.pdf');
        });
      });
    });
  }


//--PDF-priprema podataka--------------------------------------------------------------------------------
var prepareDataForPdf = function(collection,distinctTipSenzora,splitSize){
  var data = [];

  for(var i=0; i<collection.length; i++){
    var temp={};
    for(var j=0; j<collection[i].length; j++){
      if(j == 0){
        temp["Datum"] = collection[i][j];
      }
      else{
        temp[distinctTipSenzora[j-1]]=collection[i][j];
      };
    }
    data.push(temp);
  }

  var tabela=[];
  for(var i=0; i<data.length; i++){
    var object={Datum: data[i].Datum};
    for(var j=0; j<distinctTipSenzora.length; j++){
      if (distinctTipSenzora[j] in data[i]) object[distinctTipSenzora[j]] =data[i][distinctTipSenzora[j]];
      else object[distinctTipSenzora[j]]='';
    }
    tabela.push(object);
  }

  var podaci=[];
  var splitarray=function (input, spacing)
  {
    var output = [];
    for (var i = 0; i < input.length; i += spacing)
    {
        output[output.length] = input.slice(i, i + spacing);
    }
    return output;
  }

  var grupe= splitarray(distinctTipSenzora,splitSize);
  
  var result=[];
  var columns=[];
  for(var i=0; i<grupe.length; i++){
    result.push([]);
    columns.push([]);
  }

  for(var n = 0; n<tabela.length; n++){
    for(var i=0; i<grupe.length; i++){
      var obj={Datum:tabela[n].Datum};
      for(var j=0; j<grupe[i].length; j++){
        obj[grupe[i][j]]=tabela[n][grupe[i][j]];
      }
      result[i].push(obj); 
    }

  }
  
  for(var i=0; i<grupe.length; i++){
    grupe[i].unshift("Datum");
  }

  return {columns: grupe, result: result};
}

// --PDF-statistika----------------------------------------------------------------------------
var tipoviSenzora_satnica = function (collection) {
  var distinctTipSenzora = [];
  var distinctDatum = [];
  distinctDatum["datumi"] = [];
  var temp=[];

  var i = 0;
  for(var m = 0; m<collection.length; m++){
    var item=collection[m];
    var value = item.Tip_senzora;
    var date = item.Datum;
    if (value && distinctTipSenzora.indexOf(value) === -1) {
      distinctTipSenzora.push(value);
    };
    if (date && temp.indexOf(date) === -1) {
      temp.push(date);
      distinctDatum.datumi[i] = [];
      distinctDatum.datumi[i].push(date);
      i++;
    };
  }

  for(var m=0; m<collection.length; m++){
    var item=collection[m];
    var k = 0;
    var t = -1;
    while(t == -1){
      t = distinctDatum.datumi[k].indexOf(item.Datum);
      k++;
    }
    var indeks_tipSenzora = distinctTipSenzora.indexOf(item.Tip_senzora);
    distinctDatum.datumi[k-1][indeks_tipSenzora+1] = item.Vrijednost;
  }
  collection = distinctDatum.datumi;

  return {collection:collection, distinctTipSenzora:distinctTipSenzora}
}
var tipoviSenzora_AVG = function (collection) {

      var distinctTipSenzora = [];
      var distinctDatum = [];
      distinctDatum.datumi = [];
      var temp=[];
      distinctDatum.vrijednosti = [];
      var i = 0;
      
    for(var j=0; j<collection.length; j++){
      var value = collection[j].Tip_senzora;
      var date = collection[j].Datum.slice(0, 10);
      //var date = $filter('date')(new Date(datex._i), "MM/dd/yyyy");
      if (value && value.trim().length > 0 && distinctTipSenzora.indexOf(value) === -1) {
        distinctTipSenzora.push(value);
      };
      if (date && date.trim().length > 0 && temp.indexOf(date) === -1) {
        temp.push(date);
        distinctDatum.datumi[i] = [];
        distinctDatum.datumi[i][0] = date;
        i++;
      };
    }

      for(var b = 0; b < distinctDatum.datumi.length; b++){
        for(var a = 0; a < distinctTipSenzora.length; a++)
          distinctDatum.datumi[b][a+1] = [];
      };

      for(var j=0; j<collection.length; j++){
        var k = 0;
        var t = -1;
        var date = collection[j].Datum.slice(0, 10);
        while(t == -1){
          t = distinctDatum.datumi[k][0].indexOf(date);
          k++;
        }
        var indeks_tipSenzora = distinctTipSenzora.indexOf(collection[j].Tip_senzora);
        distinctDatum.datumi[k-1][indeks_tipSenzora+1].push(collection[j].Vrijednost);
      }

     for(var j=0; j<distinctDatum.datumi.length; j++){
      for(var a = 0; a < distinctTipSenzora.length; a++){
        var avg = 0; var max = 0; var min = 0; var b = 0;
        for(var k=0; k<distinctDatum.datumi[j][a+1].length; k++){
          avg = avg + distinctDatum.datumi[j][a+1][k];
          b++;
        }
        avg = avg/b;
        max = Math.max.apply(Math, distinctDatum.datumi[j][a+1]);
        min = Math.min.apply(Math, distinctDatum.datumi[j][a+1]);
        distinctDatum.datumi[j][a+1] = "";
        distinctDatum.datumi[j][a+1] = "AVG: " + avg.toFixed(2) + " " + "MAX: " + max + " " + "MIN: " + min;
      };
     }
    collection = distinctDatum.datumi;
    return {collection:collection, distinctTipSenzora:distinctTipSenzora}
}

  //===========================================================================================================
  //================================= OSTALE RUTE =============================================================
  //===========================================================================================================
  // Insert routes below
  app.use('/api/things', require('./api/thing'));
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);
  // All other routes should redirect to the index.html
  app.get('/*', function(req, res){
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
  });

};








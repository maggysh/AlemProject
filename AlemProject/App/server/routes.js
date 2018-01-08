/**
 * Main application routes
 */

'use strict';
var errors = require('./components/errors');
var path = require('path');
var models = require('./models');
var async = require('async');
var async_ForEach = require('async');


module.exports = function(app, passport){

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

    models.user_stanica.find({where:{UserId: req.body.user, StanicaId: req.body.stanica}}).then(function(response){
      return response.updateAttributes({
        Dnevni: req.body.dnevni,
        Sedmicni: req.body.sedmicni,
        Mjesecni: req.body.mjesecni
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
      console.log(senzor);//*********************************OBRISAIT
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
                'Mjesecni': c

              });
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








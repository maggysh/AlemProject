var models = require('./models');
var PromiseFtp = require('promise-ftp');
var ftp = new PromiseFtp();
var minutes = 0.1, the_interval = minutes * 60 * 1000;
var fs = require('fs');
var async = require('async');
var mailer = require("nodemailer");
var fsmonitor = require('fsmonitor');

var smtpTransport = mailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "alemsistem365@gmail.com",
        pass: "Alem123Sistem"
    }
});


fsmonitor.watch('files', null, function(change){
    if(change.addedFiles.length>0){
        async.forEachOf(change.addedFiles, function(file){
            doMagic(file);
        })
    }
});
var isMISfile=false;
function doMagic(fileName){

    async.waterfall([

        // ------------------------------------------------------------------------------------------------------------------------------------
        // POČETAK WATERFALL FUNCKIJE
        // ------------------------------------------------------------------------------------------------------------------------------------

        function(callback){
            console.log("Ucitavanje file-a");
            var fileNamePath = 'files/' + fileName;
            if(fileName.indexOf(".MIS")==-1) isMISfile=false;
            else{
                var file = fs.readFileSync(fileNamePath, "utf8");

                setTimeout(function() {
                    callback(null, file);
                }, 2000);
            }
        },

        function(arg1, callback){
            console.log("Čitanje file-a i upisivanje vrijednosti u bazu");
            async.forEachOf(arg1.split('<STATION>'), function(podatak, key,callback){
                console.log(podatak);
                var stationID = '';
                var senzorID = '';
                var godina = '';
                var mjesec = '';
                var dan = '';
                var sati = '';
                var minute = '';
                var sekunde = '';
                var vrijednost = '';
                if (podatak != ''){
                    stationID = podatak.substring(0, 10);

                    podatak = podatak.replace(stationID + "</STATION><SENSOR>", "");
                    console.log(podatak);
                    senzorID = podatak.substring(0, 4);
                    console.log(senzorID);
                    podatak = podatak.replace(/(?:\r\n|\r|\n)/g, '<br>');
                    podatak = podatak.replace(senzorID + "</SENSOR><DATEFORMAT>YYYYMMDD</DATEFORMAT>" + "<br>", "");
                    godina = podatak.substring(0, 4);
                    console.log(godina);
                    podatak = podatak.replace(godina, "");
                    mjesec = podatak.substring(0, 2);
                    podatak = podatak.replace(mjesec, "");
                    dan = podatak.substring(0, 2);
                    podatak = podatak.replace(dan + ";", "");
                    sati = podatak.substring(0, 2);
                    minute = podatak.substring(2, 4);
                    sekunde = podatak.substring(4, 6);
                    i = 7;
                    podatak = podatak.replace("<br>", ",");
                    while(podatak[i] != ',') {
                        vrijednost = vrijednost + podatak[i];
                        console.log("vrijednost ----",vrijednost);
                        i++;
                    }

                    console.log('stationID', stationID);

                    models.stanica.find({where: {Kod_stanice: stationID}}).then(function(stanica){
                            if(stanica == null) return;
                            console.log("VJEVERICA",stanica);
                            models.senzor.find({where: {Kod_senzora: senzorID, StanicaId: stanica.dataValues.id}}).then(function(senzor){
                                if(senzor == null) return;
                                console.log(senzor);
                                models.vrijednost.sync().then(function(){
                                    models.vrijednost.create({
                                        SenzorId: senzor.dataValues.id,
                                        Datum: new Date(godina, mjesec, dan, sati, minute, sekunde),
                                        Vrijednost: vrijednost
                                    });
                                }).then(function(){
                                    //Slanje maila u slučaju prekoračenja vrijednosti na određenom senzoru
                                    //Potrebno dodati i slučaj za prekoračenej gornje granice
                                    models.user_senzor.find({where: {SenzorId: senzor.dataValues.id, Max: {lte: vrijednost}}}).then(function(data){
                                        if(data != null){
                                            console.log("data",data);
                                            models.user.find({where: {id: data.dataValues.UserId}}).then(function(value){
                                                if(value != null){
                                                    setTimeout(function() {
                                                        var txt = "Stanica: " + stationID + ", senzor: " + senzorID + ", vrijednost " + vrijednost;
                                                        var mail = {
                                                            from: "node proba <alemsistem365@gmail.com>",
                                                            to: value.dataValues.email,
                                                            subject: "Prekoracenje vrijednosti",
                                                            text: txt,
                                                            html: txt
                                                        };
                                                        smtpTransport.sendMail(mail, function(error, response){
                                                            if(error){
                                                                console.log(error);
                                                            }else{
                                                                console.log("Message sent: " + response.message);
                                                            }
                                                            smtpTransport.close();
                                                        });
                                                    }, 1000);
                                                }
                                            })
                                        };

                                    });
                                })
                            })
                        });

                    callback(null);
                }
            }, function(err){
                callback(null);
            });
        },
        // ------------------------------------------------------------------------------------------------------------------------------------
        // KRAJ WATERFALL FUNCKIJE
        // ------------------------------------------------------------------------------------------------------------------------------------
    ], function(err){
        console.log("Završetak rada na file-u");
        if(err) console.log(err);
        return;
    });

}

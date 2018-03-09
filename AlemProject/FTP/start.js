var models = require('./models');
var PromiseFtp = require('promise-ftp');
var ftp = new PromiseFtp();
var minutes = 0.1, the_interval = minutes * 60 * 1000;
var fs = require('fs');
var async = require('async');
var mailer = require("nodemailer");
var fsmonitor = require('fsmonitor');
var os = require('os');
var path = require('path');

// -----------------------------------------------------------------------------
// - čitamo iz direktorija "files" i nakon obrade prebacujemo u direktorij
//   "processed"
// -----------------------------------------------------------------------------
var inputDir = './files/';
var processedDir = './processed/';

// -----------------------------------------------------------------------------
// - vrijednosti za timere
// - učitavamo sadržaj direktorija periodično u vremenskom intervalu određenim
//   varijablom "processingInterval"
// - nakon ponavljana tog intervala "maxNumberOfIntervals" puta provjeravamo
//   dali su dospjele sve očekivane datoteke

// -----------------------------------------------------------------------------
// var processingInterval = 9000;
// var maxNumberOfIntervals = 10;
var processingInterval = 360000;
var maxNumberOfIntervals = 24;
var intervalCounter = 0;

// -----------------------------------------------------------------------------
// - da bi smo bili u stanju provjeravati dali su sve datoteke dospjele, mora
//   postojati spisak očekivanih datoteka
// - globalna varijabla "listOfExpectedFiles" sadrži listu sa imenima datoteka
//   i flag koji označava dali je datoteka obrađena ili nije
// -----------------------------------------------------------------------------
var listOfExpectedFiles = [];

function addToListOfExpectedFile(fileName) {
    listOfExpectedFiles.push({
        "fileName": fileName,
        "processed": false
    });
    console.log("i did add to list of expected files"+fileName);
}

function setupListOfExpectedFiles() {
    console.log('--> resetiranje liste očekivanih datoteka');
    listOfExpectedFiles = [];
    fs.readFile("SpisakStanica.json", function (err, data) {   
        if (err) throw err; 
        else{
            podaci =  JSON.parse(data.toString());
//            listOfExpectedFiles.push({idStanice:'0000031213',brojOcekivanihDatoteka:1});
            for(var i=0; i< podaci.length; i++){
                listOfExpectedFiles.push({idStanice: podaci[i].idStanice, brojOcekivanihDatoteka:podaci[i].brojOcekivanihDatoteka,processed: false, processedFiles:[]});
            }
        }
    });
    // addToListOfExpectedFile("DATA 001.MIS");
    // addToListOfExpectedFile("DATA 002.MIS");
    // addToListOfExpectedFile("DATA 003.MIS");
}

// -----------------------------------------------------------------------------
// - funkcija za provjeru dali se datoteka nalazi na spisku očekivanih datoteka
// -----------------------------------------------------------------------------
function isOnListOfExpectedFiles(file) {
    for(i = 0; i < listOfExpectedFiles.length; i++) {        
        if(file.indexOf(listOfExpectedFiles[i].idStanice)!=-1){ 
            return true;
        }
    }
    return false;
    console.log("Is this file on list of expected files");
}

// -----------------------------------------------------------------------------
// - označavanje datoteke da je obrađena
// -----------------------------------------------------------------------------
function flagAsProcessed(file) {
    for(i = 0; i < listOfExpectedFiles.length; i++) {
        console.log("idstanice",listOfExpectedFiles[i].idStanice);
        console.log("br ocekivanih:",listOfExpectedFiles[i].brojOcekivanihDatoteka);
        console.log("indexof:",file.indexOf(listOfExpectedFiles[i].idStanice.toString()));
        console.log("file:",file);
        console.log(" ");
        if(file.indexOf(listOfExpectedFiles[i].idStanice.toString())!=-1 && listOfExpectedFiles[i].processedFiles.indexOf(file)==-1) {
            
            listOfExpectedFiles[i].processedFiles.push(file);
            listOfExpectedFiles[i].brojOcekivanihDatoteka--;
            console.log("brdatoteka:",listOfExpectedFiles[i].brojOcekivanihDatoteka);
            if(listOfExpectedFiles[i].brojOcekivanihDatoteka==0) listOfExpectedFiles[i].processed=true;
            
            console.log("boolean:",listOfExpectedFiles[i].processed);
            console.log(" ");
            break;
        }
    }
    console.log("im gonna flag this file as processed");
}

// -----------------------------------------------------------------------------
// - kontrola dali su sve datoteke sa spiska očekivanih datoteka obrađene
// -----------------------------------------------------------------------------
function statusCheck() {
    console.log('--> provjera statusa');
    var unprocessedFilesExist = false;
    var initialMessageDisplayed = false;
    var txt="<p>UPOZORENJE:<br> nisu još dospjele slijedeće datoteke:<br>";
    for(i = 0; i < listOfExpectedFiles.length; i++) {
        if(listOfExpectedFiles[i].processed == false) {
            if(!initialMessageDisplayed) {
                console.log('    UPOZORENJE: nisu još dospjele datoteke za stanice sa id-jem:');
                initialMessageDisplayed = true;
            }
            unprocessedFilesExist = true;
            console.log('    ',listOfExpectedFiles[i].idStanice);
            txt+="za stanicu sa ID-jem: " + listOfExpectedFiles[i].idStanice.toString()+' nedostaje '+ listOfExpectedFiles[i].brojOcekivanihDatoteka.toString() + ' fajlova, <br>';
            console.log("STATUS CHECK")
        }
    }
    if(unprocessedFilesExist) {
      //  console.log('    šaljemo mail'); // zadatak
        setTimeout(function() {
           // var txt = "Stanica: " + stationID + ", senzor: " + senzorID + ", vrijednost " + vrijednost;
            var mail = {
                from: "node proba <alemsistem365@gmail.com>",
               // to: value.dataValues.email,
                to:"irma.basic@alemsistem.ba",
                subject: "Prekoracenje vrijednosti",
                text: "Upozorenje",
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
    };
}

// -----------------------------------------------------------------------------
// - procesiranje direktorija
// - učitavamo spisak svih datoteka na direktoriju i obrađujemo samo one
//   koje se nalaze na spisku očekivanih datoteka
// - obrađene datoteke prebacujemo u direktorij "processed"
// -----------------------------------------------------------------------------
function processDirectory() {
    fs.readdirSync('./files/').forEach(file => {
        if(isOnListOfExpectedFiles(path.basename(file))) {
            fs.rename(inputDir+file, processedDir+file, function (err) {
              if (err) {
                  console.log('--> greška tokom obrade:',file);
              } else {
                  flagAsProcessed(path.basename(file));
                  console.log("try my best")    
              }
            });
        }
    });
}

// -----------------------------------------------------------------------------
// - ovo je glavni dio
// - prvo se pokreće priprema liste očekivanih datoteka i inicijalno obrada
//   "ulaznog" direktorija
// - to se radi sa "setImmediate" zato da se, unutar Node.js event loopa izvrši
//   prije izvršavanja bilo kojih callback-ova
// - nakon toga se sa setInterval pokreće beskonačna petlja koja periodično
//   učitava i obrađuje datoteke sa direktorija
// - nakon isteka određenog vremena provjerava se dali su dospjele sve očekivane
//   datoteke
//
//  --------------------------------------------------------------------------
//        za bolje razumijevanje Node.js event loop-a pogledaj:
//    https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/
// -----------------------------------------------------------------------------
setImmediate(setupListOfExpectedFiles);
setImmediate(processDirectory);
setInterval(() => {
    console.log("interval: ",intervalCounter + '\n');
    console.log(listOfExpectedFiles);
    if(++intervalCounter >= maxNumberOfIntervals) {
        setImmediate(statusCheck);
        setImmediate(setupListOfExpectedFiles);
        intervalCounter = 0;
    }
    processDirectory();
},processingInterval);


var smtpTransport = mailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "alemsistem365@gmail.com",
        pass: "Alem123Sistem"
    }
});


fsmonitor.watch('files', null, function(change){
    console.log("Added files:    %j", change.addedFiles);
    if(change.addedFiles.length>0){
        async.forEachOf(change.addedFiles, function(file){
            doMagic(file);
            flagAsProcessed(file);
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
                isMISfile=true;
                var file = fs.readFileSync(fileNamePath, "utf8");
                
                setTimeout(function() {
                    callback(null, file);
                }, 2000);
            }
        },

        function(arg1, callback){
            console.log("Čitanje file-a i upisivanje vrijednosti u bazu");
            try{
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
                        podatak = podatak.replace(godina, "");
                        mjesec = podatak.substring(0, 2);
                        podatak = podatak.replace(mjesec, "");
                        dan = podatak.substring(0, 2);
                        podatak = podatak.replace(dan + ";", "");
                        sati = podatak.substring(0, 2);
                        minute = podatak.substring(2, 4);
                        sekunde = podatak.substring(4, 6);
                        i = 7;
                        
                        if(dan=="08") throw new DOMException();
                        podatak = podatak.replace("<br>", ",");
                        console.log(podatak);
                        while(podatak[i] != ',') {
                            vrijednost = vrijednost + podatak[i];
                            console.log("vrijednost ----",vrijednost);
                            i++;
                        }

                        console.log('stationID', stationID);

                        models.stanica.find({where: {Kod_stanice: stationID}}).then(function(stanica){
                                if(stanica == null) return;
                                //console.log("VJEVERICA",stanica);
                                models.senzor.find({where: {Kod_senzora: senzorID, StanicaId: stanica.dataValues.id}}).then(function(senzor){
                                    if(senzor == null) return;
                                    //console.log(senzor);
                                    models.vrijednost.sync().then(function(){
                                        var d= new Date(Date.UTC(parseInt(godina),parseInt(mjesec)-1, parseInt(dan), parseInt(sati), parseInt(minute), parseInt(sekunde)));
                                        console.log("HEJ MJESEC: ");
                                        console.log(d);

                                        models.vrijednost.create({
                                            SenzorId: senzor.dataValues.id,
                                            Datum: new Date(Date.UTC(godina, mjesec-1, dan, sati, minute, sekunde)),
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
        }catch(err){
            console.log()
        }
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

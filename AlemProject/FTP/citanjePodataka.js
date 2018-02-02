/**
 * Created by Amela on 06/02/2016.
 */

//citanje u string
//
var fs = require('fs');
var path = "files";
var models = require('./models');
var email = require('./sendEmail.js');
var file="";
console.log(file);
console.log("PROLAZAK \n");
function ucitavanjePodataka1(fileName){
    //path = "files/" + fileName.name;
    //console.log("path " + path);
    //fs.readdir(path, function(err, files){
        //file = fs.readFileSync(files, "utf8");

    //citanje jednog filea
        fileName = 'files/' + fileName;
        file = fs.readFileSync(fileName, "utf8");
        console.log(file.name);
        citanje(file);
        //console.log( "FILE " + files + " end \n");
        //files = fs.readFileSync(files, "utf8");
        //console.log(files);

        /*for(var i = 0; i < files.length; i++){
            //console.log("ime fajla" + files[i] + "kraj");
            file = fs.readFileSync(path + "/" + files[i], "utf8");
            //console.log(file);
            citanje(file);
        }*/
    //});
}

function ucitavanjePodataka(fileName){
    fileName = 'files/' + fileName;
    file = fs.readFileSync(fileName, "utf8");
    file.split('<STATION>').forEach(function(podatak){
        //console.log(podatak + "KRAJ \n" );
        var stationID = '';
        var senzorID = '';
        var godina = "";
        var mjesec = "";
        var dan = "";
        var sati = "";
        var minute = "";
        var sekunde = "";
        var vrijednost = "";
        //citanje stanice
        if (podatak != ""){
            stationID = podatak.substring(0, 10);
            console.log("stanica " + stationID + "\n");

            podatak = podatak.replace(stationID + "</STATION><SENSOR>", "");

            //provjera
            //console.log("novi" + podatak);

            //citanje senzora
            senzorID = podatak.substring(0, 4);

            console.log("senzor " + senzorID + "\n");

            podatak = podatak.replace(/(?:\r\n|\r|\n)/g, '<br>');
            podatak = podatak.replace(senzorID + "</SENSOR><DATEFORMAT>YYYYMMDD</DATEFORMAT>" + "<br>", "");

            //provjera
            //console.log("novi" + podatak);

            //citanje datuma
            godina = podatak.substring(0, 4);

            console.log("godina " + godina + "\n");
            podatak = podatak.replace(godina, "");

            //citanje mjeseca
            mjesec = podatak.substring(0, 2);

            console.log("mjesec " + mjesec + "\n");
            podatak = podatak.replace(mjesec, "");
            //citanje dana
            dan = podatak.substring(0, 2);
            console.log("dan " + dan + "\n");

            //console.log("ostatak " + podatak + "\n");
            podatak = podatak.replace(dan + ";", "");

            sati = podatak.substring(0, 2);
            console.log("sati " + sati + "\n");

            minute = podatak.substring(2, 4);
            console.log("minute " + minute + "\n");

            sekunde = podatak.substring(4, 6);
            console.log("sekunde " + sekunde + "\n");

            //console.log("ostatak " + podatak);
            i = 7;
            podatak = podatak.replace("<br>", ",");
            //citanje vrijednosti
            while(podatak[i] != ',')
            {
                //console.log(podatak[i]);
                vrijednost = vrijednost + podatak[i];
                i++;
            }
            console.log("vrijednost " + vrijednost + "\n");



            models.stanica.find({ where: { Kod_stanice: stationID} }).then(function(stanica){
                models.senzor.find({ where: { Kod_Senzora: senzorID, StanicaId: stanica.dataValues.id} }).then(function(senzor){
                    models.vrijednost.sync().then(function() {
                        models.vrijednost.create({
                            Vrijednost: vrijednost,
                            Datum: new Date(godina + '.' + mjesec + '.' + dan + ' ' + sati + ':' + minute + ':' + sekunde),
                            SenzorId: senzor.dataValues.id
                        });
                    });
                });
            });

            console.log("kraj");
            /*

            console.log("izasao");

            // PROVJERAVANJE LIMITA ZA STANICU
            //treba naci sve usere kojima je predjen limit

            models.user_senzor.findAll({where: {
                SenzorId: senzorID,
                $or: [
                    { Max: {$lt: vrijednost}},
                    { Min: {$gt: vrijednost}}
                ]
            }}).then(function(response){
                console.log("odgovor " + response);
            });

            console.log("Nastavio");

            users.forEach(function(user){
               //email.smtpTransport.sendMail();
            });*/

        }

    });


};


exports.ucitavanjePodataka = ucitavanjePodataka;
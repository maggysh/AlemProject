var models = require('./models');
var async = require('async');
var fs = require('fs');
var moment = require("moment");
var PDFDocument = require("pdfkit");
var mailer = require("nodemailer");


var smtpTransport = mailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "node.proba@gmail.com",
        pass: "proba.node"
    }
});

var docc = [];
var msg = "";
var subject = "";

function GenerisiIzvjestaj(stanicaID, msg, primaoc, subject, doc){

    var att = "";
    models.stanica.find({where: {id: stanicaID}}).then(function(stanica){
        att = 'Dnevni_izvjestaj_' + stanica.dataValues.Naziv + '.pdf';
        doc.pipe( fs.createWriteStream(att) );
        subject = "Dnevni izvjestaj za stanicu " + stanica.dataValues.Naziv + "-" + stanica.dataValues.Kod_stanice;
        models.senzor.findAll({where: {StanicaId: stanicaID}}).then(function(response){
            async.forEachOf(response, function(entry, key, callback){
                models.vrijednost.findAll({where: {SenzorId: entry.dataValues.id}}).then(function(data){
                    async.forEachOf(data, function(value, callback){
                        msg = msg + "\n" + moment(value.dataValues.Datum).format('DD.MM.YYYY, h:mm:ss a') + " - Kod senzora: " + entry.dataValues.Kod_senzora + " - Vrijednost: " + value.dataValues.Vrijednost ;
                    });
                });
            });
        })
    });

    setTimeout(function() {

        doc.text(subject, {
            paragraphGap: 10,
            indent: 20,
            align: 'justify',
            columns: 1
        });
        doc.text(msg, {
            paragraphGap: 10,
            indent: 20,
            align: 'justify',
            columns: 1
        });
        doc.end();
        var mail = {
            from: "Alem Project <node.proba@gmail.com>",
            to: primaoc,
            subject: subject,
            text: subject,
            attachments: [
                {
                    filename: att,
                    filePath: att,
                    contentType: 'application/pdf'
                }
            ]
        };
       if(msg != ""){
            smtpTransport.sendMail(mail, function (error, response) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Message sent: " + response.message);
                }
                msg = "";
                smtpTransport.close();
            })
        };

        setTimeout(function(){
            if(fs.existsSync(att)){
                fs.unlinkSync(att, "utf8");
            };
        }, 1000);

    }, 500);

};


models.user_stanica.findAll({where: {Dnevni: 1}}).then(function(response){

    async.forEachOf(response, function(entry, key, callback){
        models.user.find({where: {id: entry.dataValues.UserId}}).then(function(data){
            docc[key] = new PDFDocument();
            var primaoc = data.dataValues.email;
            GenerisiIzvjestaj(entry.dataValues.StanicaId, msg, primaoc, subject, docc[key]);
        });
    }, function(err){
        callback(null);
    });

});

var models = require('./models');
var async = require('async');
var mailer = require("nodemailer");


var smtpTransport = mailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "node.proba@gmail.com",
        pass: "proba.node"
    }
});


models.user_stanica.findAll({where: {Sedmicni: 1}}).then(function(response){

    async.forEachOf(response, function(entry, key, callback){

        models.user.find({where: {id: entry.dataValues.UserId}}).then(function(data){
            var mail = {
                from: "node proba <node.proba@gmail.com>",
                to: data.dataValues.email,
                subject: "Sedmicni izvjestaj",
                text: "Sedmicni izvjestaj",
                html: "<b>Sedmicni izvjestaj</b>"
            };

            smtpTransport.sendMail(mail, function (error, response) {

                if (error) {
                    console.log(error);
                } else {
                    console.log("Message sent: " + response.message);
                }

                smtpTransport.close();
            })
        });


    }, function(err){
        callback(null);
    })

});




var dbCreds = require('.././creds.json');
var Sequelize = require('sequelize');


 var sequelize = new Sequelize(dbCreds.schema, dbCreds.username, dbCreds.password, {
 host: dbCreds.host,
 dialect: dbCreds.database,

 pool: {
 max: 5,
 min: 0,
 idle: 10000
 },
 define: {
 timestamps: false,
 }
 });
 /*
var sequelize = new Sequelize('alemdb', 'velid', 'root', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  define: {
    timestamps: false,
  }
});*/

var user = sequelize.import('./korisnik.js');
var stanica = sequelize.import('./stanica.js');
var tip_stanice = sequelize.import('./tip_stanice.js');
var senzor = sequelize.import('./senzor.js');
var tip_senzora = sequelize.import('./tip_senzora.js');
var vrijednost = sequelize.import('./vrijednost.js');
var user_stanica = sequelize.import('./user_stanica.js');
var user_senzor = sequelize.import('./user_senzor.js');

stanica.belongsToMany(user, {through: user_stanica});
user.belongsToMany(stanica, {through: user_stanica});

senzor.belongsToMany(user, {through: user_senzor});
user.belongsToMany(senzor, {through: user_senzor});

tip_stanice.hasMany(stanica);
stanica.belongsTo(tip_stanice);

stanica.hasMany(senzor);
senzor.belongsTo(stanica);

tip_senzora.hasMany(senzor);
senzor.belongsTo(tip_senzora);

senzor.hasMany(vrijednost);
vrijednost.belongsTo(senzor);

sequelize.sync();


var db = {}; // ==========================================
db.user = user;
db.stanica = stanica;
db.tip_stanice = tip_stanice;
db.senzor = senzor;
db.tip_senzora = tip_senzora;
db.vrijednost = vrijednost;
db.user_stanica = user_stanica;
db.user_senzor = user_senzor;
module.exports = db; // ==================================


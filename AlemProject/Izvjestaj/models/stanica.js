/**
 * Created by Amela on 25/12/2015.
 */

module.exports = function(sequelize, DataTypes) {
  var stanica = sequelize.define('Stanica',{

    Naziv: {
      type: DataTypes.STRING
    },
    Kod_stanice: {
      type: DataTypes.STRING
    },
    Geo_sirina: 'DOUBLE',
    Geo_duzina: 'DOUBLE',

  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
  return stanica;
};


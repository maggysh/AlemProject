/**
 * Created by Amela on 25/12/2015.
 */

module.exports = function(sequelize, DataTypes) {
  var senzor = sequelize.define('Senzor',{

    Kod_senzora: {
      type: DataTypes.STRING
    },

  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
  return senzor;
};


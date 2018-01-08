/**
 * Created by Amela on 25/12/2015.
 */

module.exports = function(sequelize, DataTypes) {
  var vrijednost = sequelize.define('Vrijednost',{

    Datum: {
      type: DataTypes.DATE
    },
    Vrijednost: 'DOUBLE',


  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
  return vrijednost;
};


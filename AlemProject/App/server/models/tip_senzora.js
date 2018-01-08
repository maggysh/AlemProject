/**
 * Created by Amela on 25/12/2015.
 */

module.exports = function(sequelize, DataTypes) {
  var tip_senzora = sequelize.define('Tip_senzora',{

    Tip_Senzora: {
      type: DataTypes.STRING
    },

  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
  return tip_senzora;
};


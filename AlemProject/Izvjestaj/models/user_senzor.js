module.exports = function(sequelize, DataTypes) {
  var user_senzor = sequelize.define('User_senzor',{

    Max: 'DOUBLE',
    Min: 'DOUBLE',


  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
  return user_senzor;
};


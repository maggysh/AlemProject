module.exports = function(sequelize, DataTypes) {
  var user_stanica = sequelize.define('User_stanica',{
    Dnevni: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Sedmicni: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Mjesecni: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }


  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
  return user_stanica;
};




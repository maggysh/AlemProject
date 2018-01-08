
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('User',{

    ime_prezime: {
      type: DataTypes.STRING
    },
    username: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    email:    {
      type: DataTypes.STRING
    },
    firma:    {
      type: DataTypes.STRING
    },

  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });
  return user;
};


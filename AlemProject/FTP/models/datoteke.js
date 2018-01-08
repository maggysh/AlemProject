
module.exports = function(sequelize, DataTypes) {
    var datoteke = sequelize.define('Datoteke',{

        Naziv: {
            type: DataTypes.STRING
        },
        Host: {
            type: DataTypes.STRING
        },
        Datum: {
            type: DataTypes.DATE
        }

    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });
    return datoteke;
};


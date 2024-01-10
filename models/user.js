const Sequelize = require('sequelize');

const sequalize = require('../util/database');

const User = sequalize.define('User', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
    },
    ispremiumuser: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // Set the default value to false
    },
    totalExpenses: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    }
});



module.exports = User;
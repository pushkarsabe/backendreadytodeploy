const Sequelize = require('sequelize');

const sequalize = require('../util/database');

const User = require('../models/user');

const Expense = sequalize.define('expense', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    money: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    options: {
        type: Sequelize.STRING,
    }

});

Expense.belongsTo(User, { foreignKey: 'userid' });

module.exports = Expense;
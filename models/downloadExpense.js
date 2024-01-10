const Sequelize = require('sequelize');

const sequalize = require('../util/database');

const DownloadExpense = sequalize.define('downloadExpense', {
    id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
    },
    URL: {
        type: Sequelize.STRING,
        allowNull: false
    }

});

module.exports = DownloadExpense;
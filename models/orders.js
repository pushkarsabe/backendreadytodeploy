const Sequelize = require('sequelize');

const sequalize = require('../util/database');

const User = require('../models/user');

const Order = sequalize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    paymentid: {
        type: Sequelize.STRING,
    },
    orderid: {
        type: Sequelize.STRING,
    },
    status: {
        type: Sequelize.STRING,
    }

});

// Order.belongsTo(User, { foreignKey: 'userid' });

module.exports = Order;
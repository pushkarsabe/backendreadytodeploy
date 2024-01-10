const Sequelize = require('sequelize');

const sequalize = require('../util/database');

const User = require('../models/user');

const ForgotPasswordRequests = sequalize.define('forgotPasswordRequests', {
    id: {
        primaryKey: true,
        type: Sequelize.UUID,
        allowNull: false,
        unique: true
    },
    isactive: {
        type: Sequelize.BOOLEAN,
    }

});


module.exports = ForgotPasswordRequests;
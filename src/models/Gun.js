const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Gun = sequelize.define('Gun', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    throatDepth: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    throatWidth: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pressure: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    workingStroke: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    auxiliaryStroke: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    hangerType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cylinderType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    electrodeType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cadUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    stepUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Gun;

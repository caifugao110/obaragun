const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SearchHistory = sequelize.define('SearchHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    searchParams: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    searchType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resultCount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = SearchHistory;

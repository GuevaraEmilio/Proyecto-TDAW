const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('User', {
  user: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'USER'
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'SCORE'
  }
}, {
  tableName: 'highScores',
  timestamps: false
});

module.exports = User;

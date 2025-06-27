// models/Score.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./User');

const Score = sequelize.define('Score', {
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'SCORE'
  },
  userId: {  
    type: DataTypes.INTEGER, 
    allowNull: false,
    field: 'USER_ID'
  }
}, {
  tableName: 'scores',
  timestamps: true
});


module.exports = Score;

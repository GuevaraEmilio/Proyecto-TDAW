const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'USERNAME'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'PASSWORD'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'EMAIL'  // Asegúrate que esta columna exista en tu base de datos
  },
  type_user: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'TYPE_USER'
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;

// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    field: "USERNAME"
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "PASSWORD"
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "EMAIL"
  },
  type_user: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "user",
    field: "TYPE_USER"
  }
}, {
  timestamps: false,
  freezeTableName: true
});

module.exports = User;

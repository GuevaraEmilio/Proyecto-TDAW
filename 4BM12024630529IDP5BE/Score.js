// Score.js
const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Score = sequelize.define(
  "Score",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    score: {
      type: DataTypes.INTEGER,
      field: "SCORE",
    },
    userId: {
      type: DataTypes.INTEGER,
      field: "USER_ID",
    },
    // ya no declaras createdAt/updatedAt aquí
  },
  {
    tableName: "scores",
    timestamps: false,      // ← IMPORTANTE: así Sequelize no buscará createdAt/updatedAt
  }
);

module.exports = Score;

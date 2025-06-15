const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('login_db', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
  database: 'login_db',
  logging: false
});

module.exports = sequelize;

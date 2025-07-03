const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('login_db', 'root', '0140', {
  host: 'localhost',
  dialect: 'mysql',
  database: 'login_db',
  logging: false
});

module.exports = sequelize;

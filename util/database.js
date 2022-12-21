const Sequelize = require('sequelize');

const sequelize = new Sequelize('group-chat', 'root', 'savitha123', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
const Sequelize = require('sequelize')

//Connection with MySql
const sequelize = new Sequelize(process.env.DATABASENAME, process.env.DBUSER, process.env.DBPASS, {
    host: process.env.HOSTDB,
    dialect: process.env.DIALECTDB,
    port: process.env.PORTDB, 
  });

module.exports = sequelize
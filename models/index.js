const { Sequelize } = require('sequelize').Sequelize

const dialect = 'mssql'
let config

switch (dialect) {
  case 'mssql':
    config = require('../config/db.config.js').mssql
    break;
  default:
    config = require('../config/db.config.js').mssql
    break;
}

const connection = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    charset: 'utf8',
    collate: 'utf8_persian_ci',
    host: config.HOST,
    dialect: config.dialect,
    define: {
      timestamps: true,
      freezeTableName: true,
      underscored: false,
    },
    dialectOptions: {
      useUTC: true, //for reading from database
      dateStrings: true,
      instanceName: config.dialectOptions.instanceName,

    },
    // timezone : '+03:30',
    operatorsAliases: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
)

const db = {}
db.Sequelize = Sequelize
db.Op = Sequelize.Op
db.connection = connection

module.exports = db
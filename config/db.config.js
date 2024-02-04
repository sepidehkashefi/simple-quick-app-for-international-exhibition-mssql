module.exports = {
  mysql: {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "",
    DB: "exhibition",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      instanceName: null,
    }
  }
  ,
  mssql: {
    HOST: "192.168.1.139",
    PORT: "1433",
    USER: "sa",
    PASSWORD: "123",
    DB: "exhibition_DB",
    dialect: "mssql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      instanceName: 'sepid',
    }

  }
}
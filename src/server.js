const express = require('express')

const mongoose = require('mongoose')

const databaseConfig = require('./config/database')

class App {
  constructor() {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'
    this.database()
    this.middlewares()
    this.routes()
  }

  database() {
    //Conecta no banco de dados MongoDB atlas o Link está via config/database.js
    mongoose.connect(databaseConfig.uri, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
  }

  middlewares() {
    this.express.use(express.json())
  }

  routes() {
    this.express.use(require('./routes'))
  }
}

module.exports = new App().express

const express = require('express')

const mongoose = require('mongoose')
const Youch = require('youch')
const Sentry = require('@sentry/node')
const validate = require('express-validation')

const databaseConfig = require('./config/database')
const sentryConfig = require('./config/Sentry')

class App {
  constructor() {
    this.sentry()
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'
    this.database()
    this.middlewares()

    this.routes()
    this.exception()
  }

  sentry() {
    Sentry.init(sentryConfig)
  }

  database() {
    // Conecta no banco de dados MongoDB atlas o Link está via config/database.js
    mongoose.connect(databaseConfig.uri, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
  }

  middlewares() {
    this.express.use(Sentry.Handlers.requestHandler())
    this.express.use(express.json())
  }

  routes() {
    this.express.use(require('./routes'))
  }

  exception() {
    if (process.env.NODE_ENV === 'production') {
      this.express.use(Sentry.Handlers.errorHandler())
    }
    this.express.use(async (err, req, res, next) => {
      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err)
      }

      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err)

        return res.json(await youch.toJSON())
      }

      return res
        .status(err.status || 500)
        .json({ error: 'Internal Server Error' })
    })
  }
}

module.exports = new App().express

const express = require('express')

const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')

const controllers = require('./app/controllers')

routes.post('/users', controllers.UserController.store)
routes.post('/sessions', controllers.SessionController.store)

routes.get('/ads', authMiddleware, controllers.AdController.index)
routes.get('/ads/:id', authMiddleware, controllers.AdController.show)
routes.post('/ads', authMiddleware, controllers.AdController.store)
routes.put('/ads/:id', authMiddleware, controllers.AdController.update)
routes.delete('/ads/:id', authMiddleware, controllers.AdController.destroy)
module.exports = routes

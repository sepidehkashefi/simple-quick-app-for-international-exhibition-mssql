const { authJwt } = require('../middleware')
const controller = require('../controllers/represent.controller')
module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, Content-Type, Accept'
		)
		next()
	})

	app.post('/represent/add/', [authJwt.verifyToken], controller.add)
	app.put('/represent/edit/:id', [authJwt.verifyToken], controller.edit)
	app.get('/represent/info/:id', [authJwt.verifyToken], controller.info)
	app.get('/represent/list', [authJwt.verifyToken], controller.list)

}
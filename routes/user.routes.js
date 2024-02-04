
const { authJwt } = require('../middleware')
const controller = require('../controllers/user.controller')
module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, Content-Type, Accept'
		)
		next()
	})

	app.post('/user/changepassword', [authJwt.verifyToken], controller.editPassword)
	app.post('/user/login/', controller.login)
	app.post('/user/add/', controller.add)

}
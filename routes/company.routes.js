const { authJwt } = require('../middleware')
const controller = require('../controllers/company.controller')
module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, Content-Type, Accept'
		)
		next()
	})

	app.post('/company/add/',[authJwt.verifyToken], controller.add)
	app.put('/company/edit/:id',[authJwt.verifyToken], controller.edit)
	app.get('/company/info/:id',[authJwt.verifyToken], controller.info)
	app.get('/company/list',[authJwt.verifyToken], controller.list)

}
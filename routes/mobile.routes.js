const { authJwt } = require('../middleware')
const controller = require('../controllers/mobile.controller')
module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, Content-Type, Accept'
		)
		next()
	})
	
	app.post('/mobile/add/',[authJwt.verifyToken], controller.add)
	app.put('/mobile/edit/:id',[authJwt.verifyToken], controller.edit)
	app.get('/mobile/info/:id',[authJwt.verifyToken], controller.info)
	app.get('/mobile/list',[authJwt.verifyToken], controller.list)
	app.get('/mobile/agentid/:id',[authJwt.verifyToken], controller.mobilesByAgentId)

}
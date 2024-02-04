const { authJwt } = require('../middleware')
const controller = require('../controllers/agent.controller')
module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, Content-Type, Accept'
		)
		next()
	})
	
	app.post('/agent/add/', [authJwt.verifyToken], controller.add)
	app.put('/agent/edit/:id', [authJwt.verifyToken], controller.edit)
	app.get('/agent/info/:id', [authJwt.verifyToken],controller.info)
	app.get('/agent/list', [authJwt.verifyToken], controller.list)
	app.get('/agent/company/:id', [authJwt.verifyToken], controller.agentsByCompanyId)
	app.get('/agent/agentid/:id', [authJwt.verifyToken], controller.agentbyagentid)

}
const jwt = require('jsonwebtoken')
const config = require('../config/auth.config.js')
const db = require('../models')

const Connection = db.connection

const verifyToken = (_req, _res, _next) => {
	// ========= use bearer token
	const authHeader = _req.headers['authorization']

	let isBasic = false;
	if (authHeader && authHeader.toLowerCase().includes('bearer')) {

		const bearer = authHeader.split(' ')
		const bearerToken = bearer[1]
		_req.token = bearerToken

	}
	else if (authHeader && authHeader.toLowerCase().includes('basic')) {
		const basic = authHeader.split(' ')
		const basicToken = basic[1]
		_req.token = basicToken
		isBasic = true

	}
	token = _req.token
	if (!token) {
		return _res.status(401).send({
			message: 'توکن وجود ندارد'
		})
	}
	if (isBasic) {

		let secret64 = atob(token)

		if (secret64.trim() == config.secret.trim()) {
			_req.isBasic = true
			return _next()
		}
		else

			return _res.status(401).send({ message: 'دسترسی لازم وجود ندارد' })
	}
	jwt.verify(token, 'sepidehSecretKey', async (err, decoded) => {
		if (err) {

			return _res.status(401).send({ message: 'دسترسی لازم وجود ندارد' })
		}

		try {

			let user = await Connection.query(`select * from [dbo].[user] where userName='${decoded.userName}' and password='${decoded.password}'`, {
				type: db.Sequelize.QueryTypes.SELECT
			})

			if (user.length > 0) {
				_req.userName = decoded.userName
				_req.password = decoded.password
				_req.id = decoded.id
				return _next()
			}
			else { return _res.status(401).send({ message: 'دسترسی لازم وجود ندارد' }) }
		} catch (err) { return _res.status(401).send({ message: 'خطا در سمت سرور' }) }



	})
}


const authJwt = {
	verifyToken,
}
module.exports = authJwt
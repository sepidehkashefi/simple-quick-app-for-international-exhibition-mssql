const bcrypt = require('bcryptjs')

module.exports = (connection, Sequelize) => {
	const User = connection.define('user', {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true
		},

		userName: {
			type: Sequelize.STRING,
		},
		realName: {
			type: Sequelize.STRING,
		},
		token: {
			type: Sequelize.TEXT,
		},
		password: {
			type: Sequelize.TEXT,
		
		}
	},
		{
			indexes: [
				{
					using: 'BTREE',
					fields: ['id']
				}
			]
			,
			paranoid: true,
		}
	)

	return User
}
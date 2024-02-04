

module.exports = (connection, Sequelize) => {
    const Represent = connection.define('represent', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },

        firstName: {
            type: Sequelize.STRING,
        },
        lastName: {
            type: Sequelize.STRING,
        },
        adress: {
            type: Sequelize.STRING,
        },
        mobile: {
            type: Sequelize.STRING,
    
        },
        cityId: {
            type: Sequelize.UUID,
        }
    }
        ,
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

    return Represent
}
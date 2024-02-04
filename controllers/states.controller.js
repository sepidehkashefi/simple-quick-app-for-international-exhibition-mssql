const db = require('../models');
const Connection = db.connection


//! states APIs 

// route:  localhost:9990/state/searchcity?q=city
// method: get
exports.searchCity = (_req, _res) => {
    let where = ``
    let search = _req.query.q
    if (!!search && search.length > 0) {
        search = search.trim().split(' ')
        for (let query of search)
            where += ` and (c.name like N'%${query}%' or s.name like N'%${query}%')`
        where = where.replace('and', '')
        Connection.query(`SELECT distinct c.id , s.name+'-'+c.name as name from city c
        left join states s on s.id=c.stateId
        where ${where}`, {
            type: db.Sequelize.QueryTypes.SELECT,
        }).then((_result) => {
            if (_result.length > 0)
                _res.status(200).send(_result)
            else
                _res.status(200).send([])
        })
            .catch(() => {
                _res.status(500).send({ message: "خطا در سمت سرور" })
            })
    }
}
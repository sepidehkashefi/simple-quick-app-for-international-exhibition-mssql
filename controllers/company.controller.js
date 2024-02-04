const db = require('../models')
const Connection = db.connection;


//! company APIs 

// route:  localhost:9990/company/add/
// method: post
exports.add = async (_req, _res) => {
  try {

    if (!_req.body.id || !_req.body.name) {
      return _res.status(400).send({ message: "لطفا فیلدهای مربوطه را وارد کنید" })
    }

    await Connection.query(`insert into company (userId,id,name,address,telephone,brand,hasAds) VALUES ('${_req.id}','${_req.body.id}','${_req.body.name}','${_req.body.address}','${_req.body.telephone}','${_req.body.brand}','${_req.body.hasAds}')`, {
      type: db.Sequelize.QueryTypes.SELECT
    })

    _res.status(200).send({ message: "کمپانی با موفقیت ثبت شد ." })

  } catch (err) {

    _res.status(500).send({ message: "مشکلی  پیش آمده است .", error: err })

  }
}

// route:  localhost:9990/company/edit/:id
// method: put
exports.edit = async (_req, _res) => {

  try {

    if (!_req.body.name) {
      return _res.status(400).send({ message: "لطفا فیلدهای مربوطه را وارد کنید" })
    }

    await Connection.query(`UPDATE company
    SET name = '${_req.body.name}', address = '${_req.body.address}'
    ,telephone='${_req.body.telephone}',brand='${_req.body.brand}' ,hasAds='${_req.body.hasAds}'
    WHERE id='${_req.params.id}'`, {
      type: db.Sequelize.QueryTypes.SELECT
    })
    _res.status(200).send({ message: "ویرایش کمپانی با موفقیت انجام شد." })

  } catch (err) {
    _res.status(500).send({ message: "مشکلی  پیش آمده است .", error: err })

  }
}

// route:  localhost:9990/company/info/:companyid/
// method: get
exports.info = async (_req, _res) => {

  try {

    let company = await Connection.query(`select * from company where id='${_req.params.id}'`, {
      type: db.Sequelize.QueryTypes.SELECT
    })

    let agents = await Connection.query(`select agent.*,companyId from agent inner join company_agent
    on agent.id=company_agent.agentId and company_agent.companyId='${_req.params.id}'`, {
      type: db.Sequelize.QueryTypes.SELECT
    })

    _res.status(200).send({ ...company[0], agents })

  } catch (err) {
    _res.status(500).send({ message: "مشکلی  پیش آمده است .", error: err })

  }
}

// route: localhost:9990/company/list
// method: get
exports.list = async (_req, _res) => {
  try {

    await Connection.query(`select * from company order by rowNumber desc`, {
      type: db.Sequelize.QueryTypes.SELECT
    }).then((_result) => {
      if (_result.length > 0)
        _res.status(200).send(_result)
      else
        _res.status(200).send([])
    })
  } catch (err) {

    _res.status(500).send({ message: "مشکلی  پیش آمده است .", error: err })

  }
}
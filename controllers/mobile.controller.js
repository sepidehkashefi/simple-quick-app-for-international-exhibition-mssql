const db = require('../models')
const Connection = db.connection;

//! mobile APIs 

// route:  localhost:9990/mobile/add
// method: post
exports.add = async (_req, _res) => {
  try {
    await Connection.query(`insert into [dbo].[mobile] (id,mobile,telegram,whatsapp,robika,ita,bale) VALUES ('${_req.body.id}','${_req.body.mobile}','${_req.body.telegram}','${_req.body.whatsapp}','${_req.body.robika}','${_req.body.ita}','${_req.body.bale}')`, {
      type: db.Sequelize.QueryTypes.SELECT
    })
    _res.status(200).send({ message: "موبایل با موفقیت اضافه شد" })

  } catch (err) {
    console.log(err)
    _res.status(500).send({ message: "مشکلی  پیش آمده است .", error: err })

  }
}

// route:  localhost:9990/mobile/edit
// method: put
exports.edit = async (_req, _res) => {
  try {
    await Connection.query(`UPDATE [dbo].[mobile]
    SET mobile = '${_req.body.mobile}', telegram = '${_req.body.telegram}', whatsapp='${_req.body.whatsapp}',robika='${_req.body.robika}',ita='${_req.body.ita}',bale='${_req.body.bale}'
    WHERE id='${_req.params.id}'`, {
      type: db.Sequelize.QueryTypes.SELECT
    })
    _res.send({ message: "update company done successfully !" })
  } catch (err) {
    _res.send({ message: "مشکلی  پیش آمده است .", error: err })

  }
}

// route:  localhost:9990/mobile/info
// method: get
exports.info = async (_req, _res) => {

  try {

    let mobile = await Connection.query(`select * from [dbo].[mobile] where id='${_req.params.id}'`, {
      type: db.Sequelize.QueryTypes.SELECT
    })

    _res.status(200).send(mobile[0])


  } catch (err) {
    console.log(err)
    _res.status(500).send({ message: "مشکلی  پیش آمده است .", error: err })

  }
}

// route:  localhost:9990/mobile/list
// method: get
exports.list = async (_req, _res) => {

  try {

    let mobiles = await Connection.query(`select * from [dbo].[mobile]`, {
      type: db.Sequelize.QueryTypes.SELECT
    })

    _res.status(200).send(mobiles)


  } catch (err) {
    console.log(err)
    _res.status(500).send({ message: "مشکلی  پیش آمده است .", error: err })

  }
}

// route:  localhost:9990/mobile/agentid/:id
// method: get
exports.mobilesByAgentId = async (_req, _res) => {

  try {

    let mobiles = await Connection.query(`select  mobile.* from mobile inner join consumer_mobile on mobile.id=consumer_mobile.mobileId where consumer_mobile.consumerId='${_req.params.id}'`, {
      type: db.Sequelize.QueryTypes.SELECT
    })

    _res.status(200).send(mobiles)


  } catch (err) {
    console.log(err)
    _res.status(500).send({ message: "مشکلی  پیش آمده است .", error: err })

  }
}
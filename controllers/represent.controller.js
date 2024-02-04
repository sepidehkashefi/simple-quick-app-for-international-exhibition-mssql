const db = require('../models')
const Connection = db.connection;


//! represent APIs 

// route:  localhost:9990/represent/add
// method: post
exports.add = async (_req, _res) => {

  try {

    //check entrance fields
    if (!_req.body.id || !_req.body.lastName || !_req.body.cityId || !_req.body.mobileArray || _req.body.mobileArray.length == 0) {
      return _res.status(400).send({ message: "لطفا فیلدهای مربوطه را وارد کنید" })
    }

    Connection.transaction(async (_transaction) => {

      await Connection.query(`select * from represent where id='${_req.body.id}'`, { transaction: _transaction }).then(async (_result) => {
        if (_result[0].length > 0) {
          //start-update----------------------------------------

          await Connection.query(`UPDATE represent
          SET firstName = '${_req.body.firstName}', lastName = '${_req.body.lastName}', address='${_req.body.address}',telephone='${_req.body.telephone}',cityId='${_req.body.cityId}'
          WHERE id='${_req.body.id}'`,
            { transaction: _transaction }
          )

          let mobileIds = ""
          _req.body.mobileArray.forEach(async element => { return mobileIds += `'${element.id}',` })
          mobileIds = mobileIds.substring(0, mobileIds.length - 1)

          //delete mobiles
          await Connection.query(`delete mobile where id in (
            select mobileId from consumer_mobile 
            where mobileId not in (${mobileIds})
             and consumerType='represent'
            and consumerId='${_req.body.id}'
            )`, {
            transaction: _transaction
          })

          await Connection.query(`delete consumer_mobile  
          where mobileId not in (${mobileIds})
           and consumerType='represent'
          and consumerId='${_req.body.id}'`, { transaction: _transaction })

          //update mobile based on id, if exist:update
          //else insert

          _req.body.mobileArray.forEach(async (element) => {

            await Connection.query(`select * from [dbo].[mobile] where id='${element.id}'`, { transaction: _transaction }).then(async (_result) => {

              if (_result[0].length > 0) {
                await Connection.query(`UPDATE [dbo].[mobile]
                SET mobile = '${element.mobile}', telegram = '${element.telegram}', whatsapp='${element.whatsapp}',robika='${element.robika}',ita='${element.ita}',bale='${element.bale}'
                WHERE id='${element.id}'`)
              }
              else {

                await Connection.query(`insert into [dbo].[mobile] (id,mobile,telegram,whatsapp,robika,ita,bale) VALUES ('${element.id}','${element.mobile}','${element.telegram}','${element.whatsapp}','${element.robika}','${element.ita}','${element.bale}')`)

                await Connection.query(`insert into consumer_mobile (consumerId,consumerType,mobileId) VALUES ('${_req.body.id}','represent','${element.id}')`)

              }
            })

          })
        }
        //end-update---------------------------------------
        //add----------------------------------------------
        else {

          await Connection.query(`insert into represent (userId,id,firstName,lastName,address,telephone,cityId) VALUES ('${_req.id}','${_req.body.id}','${_req.body.firstName}','${_req.body.lastName}','${_req.body.address}','${_req.body.telephone}','${_req.body.cityId}')`, {
            transaction: _transaction
          })


          _req.body.mobileArray.forEach(async (element) => {


            await Connection.query(`insert into consumer_mobile (consumerId,consumerType,mobileId) VALUES ('${_req.body.id}','represent','${element.id}')`)

          })

          let mobileValues = ""
          _req.body.mobileArray.forEach(async element => { return mobileValues += `('${element.id}','${element.mobile}','${element.telegram}','${element.whatsapp}','${element.robika}','${element.ita}','${element.bale}'),` })

          //insert mobiles 
          await Connection.query(`insert into [dbo].[mobile] (id,mobile,telegram,whatsapp,robika,ita,bale) VALUES ${mobileValues.substring(0, mobileValues.length - 1)}`, {
            transaction: _transaction
          })

        }
      })

      _res.status(200).send({ message: 'عملیات با موفقیت انجام شد' })



    })
  } catch (err) { }
}

// route:  localhost:9990/represent/edit/:id
// method: put
exports.edit = async (_req, _res) => {

  try {

    //check entrance fields
    if (!_req.body.firstName || !_req.body.lastName || !_req.body.address || !_req.body.telephone || !_req.body.cityId) {
      return _res.status(400).send({ message: "لطفا فیلدهای مربوطه را وارد کنید" })
    }

    //update values
    await Connection.query(`UPDATE represent
    SET firstName = '${_req.body.firstName}', lastName = '${_req.body.lastName}', address='${_req.body.address}',telephone='${_req.body.telephone}',cityId='${_req.body.cityId}'
    WHERE id='${_req.params.id}'`, {
      type: db.Sequelize.QueryTypes.SELECT
    })

    _res.status(200).send({ message: "ویرایش با موفقیت انجام شد" })

  } catch (err) {
    console.log(err)
    _res.status(500).send({ message: "مشکلی  پیش آمده است .", error: err })

  }
}


// route:  localhost:9990/represent/info/:id
// method: get
exports.info = async (_req, _res) => {

  try {
    const represent = await Connection.query(`select represent.*, city.name as cityName , city.id as cityId from represent inner join city on city.id= represent.cityId where represent.id='${_req.params.id}'`, {
      type: db.Sequelize.QueryTypes.SELECT
    })

    const mobiles = await Connection.query(` select mobile.* from  mobile inner join consumer_mobile on consumer_mobile.mobileId=mobile.id where consumer_mobile.consumerId='${_req.params.id}'`, {
      type: db.Sequelize.QueryTypes.SELECT
    })

    const data = { ...represent[0], mobileArray: mobiles }

    _res.status(200).send(data)

  } catch (err) {
    console.log(err)
    _res.status(500).send({ message: "مشکلی  پیش آمده است .", error: err })

  }
}


// route:  localhost:9990/represent/list
// method: get
exports.list = async (_req, _res) => {

  try {

    await Connection.query(`select represent.*,city.name from represent inner join city on city.id=represent.cityId order by rowNumber desc `, {
      type: db.Sequelize.QueryTypes.SELECT
    }).then((_result) => {
      if (_result.length > 0)
        _res.status(200).send(_result)
      else
        _res.status(200).send([])
    })

  } catch (err) {
    console.log(err)
    _res.send({ message: "مشکلی  پیش آمده است .", error: err })

  }
}

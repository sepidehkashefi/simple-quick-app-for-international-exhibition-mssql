const db = require('../models')
const Connection = db.connection;

//route: localhost:9990/agent/add
//method: post
exports.add = async (_req, _res) => {
  try {

    if (!_req.body.companyId
      || !_req.body.agentId
      || !_req.body.agentName
      || !_req.body.mobileArray
      || _req.body.mobileArray.length == 0) {
      return _res.status(400).send({ message: "لطفا فیلدهای مربوطه را وارد کنید" })
    }

    Connection.transaction(async (_transaction) => {

      await Connection.query(`select * from agent where id='${_req.body.agentId}'`,
        { transaction: _transaction }).then(async (_result) => {

          if (_result[0].length > 0) {

            await Connection.query(`UPDATE agent
          SET agentName = '${_req.body.agentName}', agentPosition = '${_req.body.agentPosition}'
          WHERE id='${_req.body.agentId}'`,
              { transaction: _transaction }
            )

            let mobileIds = ""
            _req.body.mobileArray.forEach(async element => { return mobileIds += `'${element.id}',` })
            mobileIds = mobileIds.substring(0, mobileIds.length - 1)

            await Connection.query(`delete mobile where id in (
            select mobileId from consumer_mobile 
            where mobileId not in (${mobileIds})
             and consumerType='agent'
            and consumerId='${_req.body.agentId}'
            )`, {
              transaction: _transaction
            })

            await Connection.query(`delete consumer_mobile  
          where mobileId not in (${mobileIds})
           and consumerType='agent'
          and consumerId='${_req.body.agentId}'`, { transaction: _transaction })

            setMobile(_req, _transaction)

          }


          else {

            await Connection.query(`insert into agent (userId, id,agentName,agentPosition) VALUES ('${_req.id}','${_req.body.agentId}','${_req.body.agentName}','${_req.body.agentPosition}')`, {
              transaction: _transaction
            })

            await Connection.query(`insert into company_agent (companyId,agentId) VALUES ('${_req.body.companyId}','${_req.body.agentId}')`, {
              transaction: _transaction
            })

            setMobile(_req, _transaction)
          }
        })

      _res.status(200).send({ message: 'عملیات با موفقیت انجام شد' })

    })
  } catch (err) { }
}

function setMobile(_req, _transaction) {
  _req.body.mobileArray.forEach(async (element) => {

    await Connection.query(`select * from [dbo].[mobile] where id='${element.id}'`, { transaction: _transaction }).then(async (_result) => {

      if (_result[0].length > 0) {

        await Connection.query(`UPDATE [dbo].[mobile]
                   SET mobile = '${element.mobile}', telegram = '${element.telegram}', whatsapp='${element.whatsapp}',robika='${element.robika}',ita='${element.ita}',bale='${element.bale}'
                   WHERE id='${element.id}'`)
      }
      else {
        await Connection.query(`insert into [dbo].[mobile] (id,mobile,telegram,whatsapp,robika,ita,bale) VALUES ('${element.id}','${element.mobile}','${element.telegram}','${element.whatsapp}','${element.robika}','${element.ita}','${element.bale}')`)

        await Connection.query(`insert into consumer_mobile (consumerId,consumerType,mobileId) VALUES ('${_req.body.agentId}','agent','${element.id}')`)

      }
    })
  })
}


// route:  localhost:9990/agent/edit/:id
// method: put
exports.edit = async (_req, _res) => {

  if (!_req.body.agentName || !_req.body.mobileArray || _req.body.mobileArray.length == 0) {
    return _res.status(400).send({ message: "لطفا فیلدهای مربوطه را وارد کنید" })
  }
  try {

    await Connection.query(`UPDATE agent
    SET agentName='${_req.body.agentName}',agentPosition='${_req.body.agentPosition}'
    WHERE id='${_req.params.id}'`, {
      type: db.Sequelize.QueryTypes.SELECT
    })

    _res.send({ message: "update agent done successfully !" })

  } catch (err) {
    console.log(err)
    _res.send({ message: "مشکلی  پیش آمده است .", error: err })

  }
}

// route:  localhost:9990/agent/info/:id
// method: get
exports.info = async (_req, _res) => {

  try {

    const agent = await Connection.query(`select * from agent where id='${_req.params.id}'`, {
      type: db.Sequelize.QueryTypes.SELECT
    })

    const mobiles = await Connection.query(` select mobile.* from  mobile inner join consumer_mobile on consumer_mobile.mobileId=mobile.id where consumer_mobile.consumerId='${_req.params.id}'`, {
      type: db.Sequelize.QueryTypes.SELECT
    })

    const data = { ...agent[0], mobileArray: mobiles }

    _res.send(data)

  } catch (err) {
    console.log(err)
    _res.send({ message: "مشکلی  پیش آمده است .", error: err })

  }

}

// route:  localhost:9990/agent/list
// method: get
exports.list = async (_req, _res) => {

  try {

    let represent = await Connection.query(`select * from agent order by rowNumber desc`, {
      type: db.Sequelize.QueryTypes.SELECT
    })

    _res.status(200).send(represent)


  } catch (err) {
    console.log(err)
    _res.send({ message: "مشکلی  پیش آمده است .", error: err })

  }
}

// route:  localhost:9990/agent/company/:id
// method: get
exports.agentsByCompanyId = async (_req, _res) => {
  try {
    const agents = await Connection.query(`
      SELECT agent.* FROM agent
      INNER JOIN company_agent AS a ON agent.id = a.agentId
      WHERE a.companyId = '${_req.params.id}'
    `, {
      type: db.Sequelize.QueryTypes.SELECT
    });

    const updatedAgents = await Promise.all(agents.map(async (agent) => {
      const mobiles = await Connection.query(`
        SELECT mobile.* FROM mobile
        INNER JOIN consumer_mobile ON mobile.id = consumer_mobile.mobileId
        WHERE consumer_mobile.consumerId = '${agent.id}'
      `, {
        type: db.Sequelize.QueryTypes.SELECT
      });

      return { ...agent, mobileArray: mobiles };
    }));

    _res.status(200).send(updatedAgents);
  } catch (err) {
    console.log(err);
    _res.status(500).send({ message: "مشکلی پیش آمده است.", error: err });
  }
}

// route:  localhost:9990/agent/agentid/:id
// method: get
exports.agentbyagentid = async (_req, _res) => {

  try {

    const agent = await Connection.query(`
      SELECT * FROM agent
      WHERE id='${_req.params.id}'
    `, {
      type: db.Sequelize.QueryTypes.SELECT
    });

    const mobiles = await Connection.query(`
        SELECT mobile.* FROM mobile
        INNER JOIN consumer_mobile ON mobile.id = consumer_mobile.mobileId
        WHERE consumer_mobile.consumerId = '${agent[0].id}'
      `, {
      type: db.Sequelize.QueryTypes.SELECT
    });

    const data = { ...agent[0], mobileArray: mobiles }

    _res.status(200).send(data);
  } catch (err) {
    _res.status(500).send({ message: "مشکلی پیش آمده است.", error: err });
  }
}
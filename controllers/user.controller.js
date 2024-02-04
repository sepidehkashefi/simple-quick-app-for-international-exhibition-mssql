const db = require('../models')
const Connection = db.connection
var jwt = require('jsonwebtoken');


//! user APIs 

// route:  localhost:9990/user/add
// method: post
exports.add = async (_req, _res) => {
  try {

    //check entrance fields
    if (!_req.body.userName || !_req.body.realName || !_req.body.password) {
      return _res.status(400).send({ message: "لطفا فیلدهای مربوطه را وارد کنید" })
    }

    // check user existance
    const existUser = await Connection.query(`select * from [dbo].[user] where userName='${_req.body.userName}' `, {
      type: db.Sequelize.QueryTypes.SELECT
    })

    if (existUser.length > 0) {
      _res.status(400).send({ message: "این یوزر قبلا اضافه شده است" })
    }

    //insert user
    await Connection.query(`insert into [dbo].[user] (userName,realName,password) VALUES ('${_req.body.userName}','${_req.body.realName}','${_req.body.password}')`, {
      type: db.Sequelize.QueryTypes.SELECT
    })

    _res.status(200).send({ message: "کاربر با موفقیت اضافه شد." })

  } catch (err) {
    console.log(err)
    _res.status(500).send({ message: "مشکلی  پیش آمده است .", error: err })

  }
}

// route:  localhost:9990/user/login
// method: post
exports.login = async (_req, _res) => {

  try {

    //check entrance fields 
    if (!_req.body.password || !_req.body.userName)
      return _res.status(400).send({ message: "لطفا فیلدهای مربوطه را وارد کنید" })

    // check user existance
    let user = await Connection.query(`select * from [dbo].[user] where userName='${_req.body.userName}' and password='${_req.body.password}'`, {
      type: db.Sequelize.QueryTypes.SELECT
    })

    if (user.length > 0) {
      const userObject = { "userName": user[0].userName, "password": user[0].password, "id": user[0].id }
      var token = jwt.sign(userObject, 'sepidehSecretKey');

      //add created token to user
      await Connection.query(`UPDATE [dbo].[user]
      SET token = '${token}'
      where userName='${_req.body.userName}'`, {
        type: db.Sequelize.QueryTypes.SELECT
      })

      _res.status(200).send({ message: "کاربر با موفقیت وارد شد ", token })

    }

    else
      _res.status(400).send({ message: 'رمز عبور یا نام کاربری صحیح نمی باشد' })

  } catch (err) {
    _res.status(500).send({ message: "مشکلی  پیش آمده است .", error: err })
  }
}

// route:  localhost:9990/user/changepassword
// method: post
exports.editPassword = async (_req, _res) => {

  try {
    //check entrance fields 
    if (!_req.body.password || !_req.body.confirmPassword || !_req.body.newPassword)
      return _res.status(400).send({ message: "لطفا فیلد های مربوطه را وارد کنید" })

    //get old password from DB to comparing with entrance 
    const userOldPassword = await Connection.query(`select password from [dbo].[user]
    WHERE userName='${_req.userName}'`, {
      type: db.Sequelize.QueryTypes.SELECT
    })

    if (userOldPassword[0].password != _req.body.password)
      return _res.status(400).send({ message: "رمز قبلی رااشتباه وارد کردید" })

    if (_req.body.newPassword != _req.body.confirmPassword) {
      return _res.status(400).send({ message: "رمز جدید با تکرار رمز جدید برابر نیست" })
    }

    //update password
    await Connection.query(`UPDATE [dbo].[user]
    SET password = '${_req.body.newPassword}'
    WHERE userName='${_req.userName}'`, {
      type: db.Sequelize.QueryTypes.SELECT
    })

    _res.status(200).send({ message: "تغییر رمز جدید با موفقیت انجام شد." })

  } catch (err) {
    console.log(err)
    _res.status(500).send({ message: "مشکلی  پیش آمده است .", error: err })

  }
}

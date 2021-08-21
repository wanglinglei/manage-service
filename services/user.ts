const db = require("../modules/db.js");
const user = require("express").Router();

//用户登录
user.post('/user_login_in', async (req, res) => {
  console.log(req.body, 'req')
  const { userName, password } = req.body;
  res.send({
    status: 'success',
    msg: '登录成功！',
    data: {
      login_status: '1',
      user_info: {
        userName,
        password
      }
    }
  })
})
//用户注册 
user.post('/user_register', async (req, res) => {
  const { userName, password1, password2, phoneNumber, email } = req.body;
  console.log(req.body, ' req.body');

  let msg, data, status = 'fail'
  if (!userName || !password1 || !password2 || !phoneNumber) {
    msg = '信息输入错误'
  }
  if (password1 !== password2) {
    msg = '信息输入错误'
  }
  try {
    const result = await db.findOne("administrators", { $or: [{ userName }, { phoneNumber }, { email }] });
    if (!result || result.length === 0) {
      await db.insertOne("administrators", {
        userName,
        password: password1,
        phoneNumber,
        email,
        creatTime: Date.now().toString(),
        updateTime: '',
        authLevel: '0',
        lastLoginTime: '',
        userPic: ''
      })
      status = 'success'
      msg = '注册成功'
    } else {
      const { res_userName = userName, res_phoneNumber = phoneNumber, res_email = email } = result;
      if (res_userName === userName) {
        msg = '该用户名已被注册'
      } else if (res_phoneNumber === phoneNumber) {
        msg = '该手机号已被注册'
      } else if (res_email === email) {
        msg = '该邮箱已被注册'
      } else {
        msg = '系统错误'
      }
    }
    status = 'fail'
  } catch (error) {
    status = 'fail',
      msg = '网络错误'
  }
  res.send({
    status,
    msg,
    data
  })
})
module.exports = user
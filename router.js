var express = require('express')
var md5 = require('blueimp-md5')
var User = require('./models/user')

var router = express.Router()

router.get('/', function (req, res) {
  res.render('index.html', {
    user: req.session.user
  })
})

router.get('/login', function (req, res, next) {
  res.render('login.html')
})

router.post('/login', function (req, res, next) {
    var body = req.body

    User.findOne({
      email: body.email,
      password: md5(md5(body.password))
    }, function (err, user) {
      if (err) {
        return next(err)
      }

      // 如果邮箱和密码匹配，则 user 是查询到的用户对象，否则就是 null
      if (!user) {
        return res.status(200).json({
          err_code: 1,
          message: 'Email or password is invalid.'
        })
      }

      // 用户存在，登陆成功，通过 Session 记录登陆状态
      req.session.user = user

      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })


    })
})

router.get('/register', function (req, res, next) {
  res.render('register.html')
})

router.post('/register', function (req, res, next) {
  // 1. 获取表单提交的数据
  //    req.body
  // 2. 操作数据库
  //    判断改用户是否存在
  //    如果已存在，不允许注册
  //    如果不存在，注册新建用户
  // 3. 发送响应
  var body = req.body

  User.findOne({
    $or: [
      {email: body.email},
      {nickname: body.nickname}
    ]
  }, function (err, data) {

    if (err) {
      return next(err)
    }

    if (data) {
      return res.status(200).json({
        err_code: 1,
        message: 'Email or nickname aleady exists.'
      })
    } 

    body.password = md5(md5(body.password))

    new User(body).save(function (err, user) {
      if (err) {
        return next(err)
      }

      req.session.user = user

      res.status(200).json({
        err_code: 0,
        message: 'ok'
      })
    })


  })
})

router.get('/logout', function (req, res) {
  req.session.user = null
  res.redirect('/login')
})

module.exports = router
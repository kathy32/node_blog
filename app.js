var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var router = require('./router')

var app = express()

// 将 相对路径 改为 绝对路径 （ 动态路径拼接 ）
app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))
app.set('views', path.join(__dirname, './views/'))  // 设置默认目录为 ./views

app.engine('html', require('express-art-template'))

// 配置解析表单 POST 请求体插件
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(session({
  secret: 'itcast',
  resave: false,
  saveUninitialized: false
}))

app.use(router)

app.use(function (req, res) {
  res.render('404.html')
})

// 配置一个全局错误处理中间件
app.use(function (err, req, res, next) {
  res.status(500).json({
    err_code: 500,
    message: err.message
  })
})

app.listen(3000, function () {
  console.log('running...')
})
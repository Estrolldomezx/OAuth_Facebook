/* --setup-- */
var session = require('express-session')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var app = require('express')()
var passport = require('passport')
var fs = require("fs");
var http = require('http');
let ejs = require('ejs');

var FacebookStrategy = require('passport-facebook').Strategy
var CLIENT_ID = '790575288557745'
var CLIENT_SECRET = '7756b613948cc694bff2ab80bf6ae085'

passport.serializeUser(function (user, done) {
    //ส่งข้อมูลทั่วไปเก็บใน session
    done(null, user);
})
passport.deserializeUser(function (obj, done) {
    //นำข้อมูลที่เก็บใน sessions ไปใช้งาน
    done(null, obj)
})
passport.use(new FacebookStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/facebook/cornboildev"
    //callback เมื่อ user อนุญาตสิทธิ์การเข้าถึงข้อมูลสำเร็จแล้ว ก็จะ response ข้อมูลกลับมาให้ application
},
    function (accessToken, refreshToken, profile, done) {
        //ส่วนนี้จะเอาข้อมูลที่ได้จาก facebook ไปทำอะไรต่อก็ได้
        done(null, profile)
    }
));

/* --setup-- */
app.set('views', __dirname);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    fs.readFile('./index.html', function (err, html) {
        res.end(html);
    });
    //เรียกอ่านไฟล์ index.html  
})
app.get('/auth/facebook', passport.authenticate('facebook')) //ทำการ Authenticate กับ facebook
app.get('/auth/facebook/cornboildev',
    passport.authenticate('facebook', {
        successRedirect: '/profile', //หาก authen สำเร็จ จะไปยัง /profile/
        failureRedirect: '/'  //หากไม่สำเร็จจะกลับไปเรียกอ่าน index.html ใหม่
    }))
app.get('/profile', (req, res) => {
    res.render('home', {user:req.user}); //แสดงหน้า home.ejs และส่ง parameter เป็น object ของข้อมูล user
})
app.listen(8000, () => {
    console.log('server is running at localhost!')
})
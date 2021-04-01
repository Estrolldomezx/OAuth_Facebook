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
    done(null, user);
})
passport.deserializeUser(function (obj, done) {
    done(null, obj)
})
passport.use(new FacebookStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/facebook/cornboildev"
},
    function (accessToken, refreshToken, profile, done) {
        //ส่วนนี้จะเอาข้อมูลที่ได้จาก facebook ไปทำอะไรต่อก็ได้
        done(null, profile)
    }
));

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
})
app.get('/auth/facebook', passport.authenticate('facebook'))
app.get('/auth/facebook/cornboildev',
    passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }))
app.get('/profile', (req, res) => {
    // fs.readFile('/home', function (err, data) {
    //     //  res.send(req.user);
    // })
    res.render('home', {user:req.user});
    

    // res.send(req.user);
    // res.json(req.user.displayName)
     //console.log(req.user.id);
})
app.listen(8000, () => {
    console.log('server is running at localhost!')
})
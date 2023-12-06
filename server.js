const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
_=require('underscore');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const cookieparser = require('cookie-parser');
const flash = require('connect-flash');

app.set('view engine','ejs');
app.set('views','views');

app.use(express.static(path.join(__dirname , 'public')));

app.use(expressSession({
    secret: "MYS3CR3TK3Y",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: true
}));

app.use(flash());
app.use(cookieparser()); 

app.use(bodyParser.urlencoded({
    extended: true
 }));

const jwt = require('./middleware/auth');
app.use(jwt.authJwt);

const Router = require('./routes/dashboard.routes');
app.use(Router);

const schoolRouter = require('./routes/school.routes');
app.use('/school',schoolRouter);

const facultyRouter = require('./routes/faculty.routes');
app.use('/faculty',facultyRouter);

const studentRouter = require('./routes/student.routes');
app.use('/student',studentRouter);

require(path.join(__dirname, '/config/database'))();

app.listen(process.env.PORT , () => {
    console.log(`server running @ http://127.0.0.1:${process.env.PORT}`);
})


const Router = require('express').Router();
const dashboardController = require('../controllers/dashboard.controller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/register-uploads')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const Iuploads = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('only jpg, jpeg, png are allowed'))
        }
    },    
})
Router.get('/', dashboardController.loginShow);
Router.post('/login', dashboardController.login);
Router.get('/register', dashboardController.registerShow);
Router.post('/insert', Iuploads.single('image') , dashboardController.register);
Router.get('/dashboard', dashboardController.userAuth, dashboardController.dashboardShow);

module.exports = Router;
const studentRouter = require('express').Router();
const studentController = require('../controllers/student.controller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/image-uploads')
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

studentRouter.get('/add' , studentController.userAuth, studentController.add);
studentRouter.post('/insert' , Iuploads.single('image') , studentController.insert);
studentRouter.get('/list' ,studentController.userAuth, studentController.list);

module.exports = studentRouter;
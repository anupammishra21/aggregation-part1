const facultyRouter = require('express').Router();
const facultyController = require('../controllers/faculty.controller');

facultyRouter.get('/add' , facultyController.userAuth, facultyController.add);
facultyRouter.post('/insert' , facultyController.insert);
facultyRouter.get('/list' , facultyController.userAuth, facultyController.list);




module.exports = facultyRouter;
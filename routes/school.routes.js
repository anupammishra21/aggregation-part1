const schoolRouter = require('express').Router();
const schoolController = require('../controllers/school.controller');

schoolRouter.get('/add' , schoolController.userAuth, schoolController.add);
schoolRouter.post('/insert' , schoolController.insert);
schoolRouter.get('/list' , schoolController.userAuth, schoolController.list);


module.exports = schoolRouter;
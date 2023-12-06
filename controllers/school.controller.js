const schoolCrud = require('../models/school.model');
class schoolController{

    async userAuth(req, res, next){
        try{
            if(!_.isEmpty(req.user)){                       
                next();
            } else { 
                req.flash('error' , 'UnAuthorized UseR .. Please Login')              
                res.redirect('/');                           
            }

        }catch(err){
            throw(err);
        }
    }
    
    /* To Show the add Form*/
    async add(req, res){
        try{                                   
            res.render('school-add', {
                title: "Add Form",               
                error: req.flash('error'),
            })
        } catch(err) {
            throw err;
        }
    }

    /* To insert the Add Form*/
    async insert(req, res){
        try{
            let is_email_exists =  await schoolCrud.findOne({ email : req.body.email, isDeleted : false});
            if(!_.isEmpty(is_email_exists)){
                req.flash('error' , 'This email already Exists');
                return res.redirect('/school/add');
            }           
            let save_data = await schoolCrud.create(req.body);
          
            if (!_.isEmpty(save_data) && save_data._id) {
                req.flash('success' , 'School Successfully Added Below');
                res.redirect('/school/list');
            } else {
                req.flash('error' , 'Something went wrong');
                res.redirect('/school/add');
            } 
            
        } catch(err) {
            throw err;
        }
    }

    /* To Show the school list*/
    async list(req, res){
        try{            
            let all_schools = await schoolCrud.find({ isDeleted: false}).sort({ createdAt: -1});
            res.render('school-list', {
                title: "List",
                success:req.flash('success'),
                all_schools
            })
        } catch(err) {
            throw err;
        }
    }
}

module.exports = new schoolController();
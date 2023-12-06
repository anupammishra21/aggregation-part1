const logRegCrud = require('../models/register.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class dashboardController{

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

     /* To Show the Login Form*/
     async loginShow(req, res){
        try{
            res.render('login', {
                title: 'Login',
                error:req.flash('error'),
                success:req.flash('success'),
            });
        } catch(err){
            throw err;
        }
    }

    /* To Login Functionality */
    async login(req , res){      
        try {
         let email_exists = await logRegCrud.findOne({ email: req.body.email});
         //console.log(email_exists);
         if(_.isEmpty(email_exists)){
            req.flash('error','There is no Account with this email');
            res.redirect('/');

         } else {         
         const hash_password = email_exists.password;
         if(bcrypt.compareSync(req.body.password, hash_password)){
            let token = jwt.sign({
                id: email_exists._id,
            }, 'abcdefg', { expiresIn: '2d'}); 
            // const parts = token.split('.'); 
            // console.log(token); // 3           
            res.cookie('user_token', token);
            res.redirect('/dashboard');         
         } else {
            req.flash('error','Bad credentials');
            res.redirect('/');
         } }
        } catch(err) {
            throw err
        }
    }

    /* To Show the Registration Form*/
    async registerShow(req, res){
        try{
            res.render('register', {
                title: 'Registeration',
                error:req.flash('error'),
            });
        } catch(err){
            throw err;
        }
    }

    /* Insert the Registration Form*/
    async register(req , res){      
        try {           
             

            let is_email_exist =  await logRegCrud.findOne({ email : req.body.email});
            if(!_.isEmpty(is_email_exist)){
                req.flash('error' , 'This email already Exists');
                return res.redirect('/register');
            } 
            
            if(req.body.password !== req.body.confirm_password){
                req.flash('error' , 'Password is not Matching');
                return res.redirect('/register'); 
            }

            if (!_.isEmpty(req.file)) {
                req.body.image = req.file.filename;
             } else {
                 req.flash('error' , 'Image must be Added');
                 res.redirect('/register');
             }
             req.body.fullname = req.body.fname + " " + req.body.lname;

            req.body.password = bcrypt.hashSync(req.body.password , bcrypt.genSaltSync(10));
            
            //console.log(req.body , "body");

            let save_data = await logRegCrud.create(req.body);
            //console.log(save_data , "save");
            if (!_.isEmpty(save_data) && save_data._id) {
                req.flash('success' , 'Registeration Successfull');
                res.redirect('/');
            } else {
                req.flash('error' , 'Something went wrong');
                res.redirect('/');
            }

        } catch(err) {
            throw err
        }
    }
    

    /* To Show the Dashboard*/
    async dashboardShow(req, res){
        try{           
            const loginUser = await logRegCrud.findOne({ _id : req.user.id });           
            res.render('dashboard', {
                title: 'Dashboard',
                loginUser
            });
        } catch(err){
            throw err;
        }
    }
 }

 module.exports = new dashboardController();
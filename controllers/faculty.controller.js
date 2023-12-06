const facultyCrud = require('../models/faculty.model');
const SchoolCrud = require('../models/school.model');
class facultyController{

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

    async add(req, res){
        try{
            let school_names = await SchoolCrud.find({ isDeleted: false});
            //console.log(school_names);
            res.render('faculty-add', {
                title: "Add Form",
                error:req.flash('error'),
                school_names
            })
        } catch(err) {
            throw err;
        }
    }

    async insert(req, res){
        try{
          
            if(_.isEmpty(req.body.school_id)){
                req.flash('error' , 'Please select a School');
                return res.redirect('/faculty/add');
            }      
         
            let save_data = await facultyCrud.create(req.body);
          
            if (!_.isEmpty(save_data) && save_data._id) {
                req.flash('success' , 'Faculty Successfully Added Below');
                res.redirect('/faculty/list');
            } else {
                req.flash('error' , 'Something went wrong');
                res.redirect('/faculty/add');
            } 
            
        } catch(err) {
            throw err;
        }
    }

    async list(req, res){
        try{
            // let all_faculty = await facultyCrud.find({ isDeleted: false}).sort({ createdAt: -1});
            // let all_faculty = await facultyCrud.aggregate([
            //     {
            //         $lookup : {
            //             from: 'schools',
            //             localField: 'school_id',
            //             foreignField: '_id',
            //             as: 'school_details'

            //         }
            //     },{
            //         $unwind : '$school_details'
            //     },{
            //         $sort: { 'createdAt': -1 }
            //     },{
            //         $project: {
            //             name:1,
            //             no_of_teachers:1,
            //             contact:1,
            //             'school_details.name':1
            //         }
            //     }
            // ])
            
            let all_faculty = await facultyCrud.aggregate([
                {
                    $lookup:{
                        from: 'schools',
                        let : {
                            schoolId : '$school_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: [ '$_id', '$$schoolId' ] }
                                        ]
                                    }
                                }
                            },
                            {
                                $project:{
                                    name:1,                                   
                                }
                            }
                        ],
                        as: 'school_details'
                       
                    }
                },
                {
                    $unwind: '$school_details'
                },
                {
                    $sort: { 'createdAt' : -1 }
                },
                {
                    $project: {
                        name:1,
                        no_of_teachers:1,
                        contact:1,                       
                        'school_details.name':1                       
                    }
                }
            ])
            console.log(all_faculty);
            //console.log(all_faculty[0].school_details);
            res.render('faculty-list', {
                title: "List",
                success:req.flash('success'),
                all_faculty
            })
        } catch(err) {
            throw err;
        }
    }
}

module.exports = new facultyController();
const studentCrud = require('../models/student.model');
const facultyCrud = require('../models/faculty.model');
class studentController{

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
            let faculty_names = await facultyCrud.find({ isDeleted: false});
            res.render('student-add', {
                title: "Add Form",
                faculty_names,
                error:req.flash('error'),
            })
        } catch(err) {
            throw err;
        }
    }

    async insert(req, res){
        try{
          
            if(_.isEmpty(req.body.faculty_id)){
                req.flash('error' , 'Please select a Faculty');
                return res.redirect('/student/add');
            }
            
            let is_email_exists =  await studentCrud.findOne({ email : req.body.email, isDeleted : false});
            if(!_.isEmpty(is_email_exists)){
                req.flash('error' , 'This email already Exists');
                return res.redirect('/student/add');
            }

            if (!_.isEmpty(req.file)) {
                req.body.image = req.file.filename;
            } else {
                 req.flash('error' , 'Image must be Added');
                 res.redirect('/student/add');
            }

            //console.log(req.body);
         
            let save_data = await studentCrud.create(req.body);
          
            if (!_.isEmpty(save_data) && save_data._id) {
                req.flash('success' , 'Student Details Successfully Added Below');
                res.redirect('/student/list');
            } else {
                req.flash('error' , 'Something went wrong');
                res.redirect('/student/add');
             } 
            
        } catch(err) {
            throw err;
        }
    }

    async list(req, res){
        try{
            // let all_students = await studentCrud.find({ isDeleted: false}).sort({ createdAt: -1});
            
    //******************METHOD 1***********************
            // let all_students = await studentCrud.aggregate([
            // {
            //     $lookup: {
            //         from: 'faculties',
            //         localField: 'faculty_id',
            //         foreignField: '_id',
            //         as: 'faculty_details'
            //     }
            // },{
            //     $unwind: '$faculty_details'
            // },{
            //     $sort: { 'createdAt' : -1 }
            // },{
            //     $project: {
            //         name:1,
            //         gender:1,
            //         age:1,
            //         email:1,
            //         contact:1,
            //         image:1,
            //         'faculty_details.name':1,
            //         'faculty_details.contact':1
            //     }
            // }            
            // ])
    //*********************************************** */

    //******************METHOD 2********************* */
            let all_students = await studentCrud.aggregate([
                {
                    $lookup:{
                        from: 'faculties',
                        let : {
                            facultyId : '$faculty_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: [ '$_id', '$$facultyId' ] }
                                        ]
                                    }
                                }
                            },
                            {
                                $lookup : {
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
                                        }
                                    ],
                                    as: 'school_details'
                                }
                            },
                            {
                                $unwind: '$school_details'
                            },
                            {
                                $project:{
                                    name:1,
                                    contact:1,
                                    'school_details.name':1,
                                    'school_details.contact':1
                                }
                            }
                        ],
                        as: 'faculty_details'
                       
                    }
                },
                {
                    $unwind: '$faculty_details'
                },
                {
                    $sort: { 'createdAt' : -1 }
                },
                {
                    $project: {
                        name:1,
                        gender:1,
                        age:1,
                        email:1,
                        contact:1,
                        image:1,
                        'faculty_details.name':1,
                        'faculty_details.contact':1,
                        'faculty_details.school_details.name':1,
                        'faculty_details.school_details.contact':1
                    }
                }
            ])

          
            console.log(all_students);
            //console.log(all_students[0].faculty_details.name)
            res.render('student-list', {
                title: "List",
                success:req.flash('success'),
                all_students
            })
        } catch(err) {
            throw err;
        }
    }
}

module.exports = new studentController();
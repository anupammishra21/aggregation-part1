
function checker(req, res){
    if(_.isEmpty(req.user)){  
        req.flash('error' , 'UnAuthorized UseR .. Please Login');
        return res.redirect('/');
    } 
}

module.exports = checker();
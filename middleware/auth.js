const auth=(req,res,next)=>{
    const jwt=require('jsonwebtoken');
    try{
        if(!req.get('Authorization')){
            const err=new Error('please login');
            err.statusCode=401;
            throw err;
        }
        let token=req.get('Authorization');
        let isTrue=jwt.verify(token,'fushaMgr');
        if(!isTrue){
            const err=new Error('please login');
            err.statusCode=401;
            throw err;
        }
        req.adminId=isTrue.adminId;
        next();
    }catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
};

module.exports={
    auth
};
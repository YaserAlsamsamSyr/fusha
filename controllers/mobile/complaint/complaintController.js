const models=require('../../../util/callModel');
const err=require('../../../middleware/errorHandle');
const validation=require('../../../validation/methods');
const getComplaints=async(req,res,next)=>{
    try{
        let complaints=await models.complaint.findAll({
            attributes:['id','firstName','lastName','phoneNumber','description']
        });
        if(complaints.length==0)
             throw err('no complaints found',404);
        res.status(200).json({complaints:complaints});
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};
const deleteComplaint=async(req,res,next)=>{
    const complaintId=req.params.id;
    try{
        //validation
        let validationCheck=await validation.isId(complaintId);
        if(validationCheck!==true)
            throw err(validationCheck,422);
        //
        let deletedComplaint=await models.complaint.destroy({where:{id:complaintId}});
        if(!deletedComplaint)
              throw err('this complaint not found',404);
        res.status(200).json({message:'delete success'});
    }catch(err){
        if(!err.statusCode)
             err.statusCode=500;
        next(err);
    }
};
module.exports={
    getComplaints,
    deleteComplaint
}
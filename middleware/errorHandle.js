const err=(message,statusCode)=>{
     const err=new Error(message);
     err.statusCode=statusCode;
     return err;
};

module.exports=err;
const uploadImage=(folderName,images,icon='none')=>{
    const multer=require('multer');
    const storage = multer.diskStorage({
        destination:(req, file, cb)=> {
          cb(null, './public/'+folderName)
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + file.originalname;
          cb(null, file.fieldname + '-' + uniqueSuffix)
        }
      })
    const fileFilter=(req,file,cb)=>{
        if(
            file.mimetype==='image/png' ||
            file.mimetype==='image/jpg' ||
            file.mimetype==='image/jpeg' 
        )
        cb(null,true);
        else
        cb(null,false);
    };
    const upload =multer({storage:storage,fileFilter:fileFilter}).fields([{ name: icon, maxCount: 1 }, { name:images}]);
    return upload;
};
module.exports={
    uploadImage
}
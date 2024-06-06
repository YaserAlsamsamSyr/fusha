const models=require('../../../util/callModel');
const Err=require('../../../middleware/errorHandle');
const validation=require('../../../validation/methods');
const addCity=(req,res,next)=>{
    const upload=require('../../../middleware/image').uploadImage;
    const adminId=req.adminId;
    upload('city','images','icon')(req, res,async function (err) {
        try{
            const multer=require('multer');
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                throw Err(err.message,422);
            } else if (err) {
                // An unknown error occurred when uploading.
                throw Err(err.message,422);
            }
            // Everything went fine.
            const araName=req.body.araName;
            const engName=req.body.engName;
            let icon=req.files['icon'];
            const images=req.files['images'];
            //validation
            const { unlink } = require('node:fs');
            let deleteImages='';
            if(!images){
                if(icon)
                    unlink(icon[0].path, (err) => {
                        if (err) throw err;
                      });
                throw Err('images is required',422);
            }
            if(!icon){
                deleteImages=images.map(i=>i.path);
                for(let i=0;i<deleteImages.length;i++)
                    unlink(deleteImages[i], (err) => {
                      if (err) throw err;
                    });
                throw Err('icon is required',422);
            }
            let checkValidation=await validation.isSrting(araName)
            if(checkValidation!==true){
                deleteImages=images.map(i=>i.path);
                for(let i=0;i<deleteImages.length;i++)
                    unlink(deleteImages[i], (err) => {
                      if (err) throw err;
                    });
                unlink(icon[0].path, (err) => {
                    if (err) throw err;
                  });
                throw Err(checkValidation,422);
            }
            checkValidation=await validation.isSrting(engName)
            if(checkValidation!==true){
                deleteImages=images.map(i=>i.path);
                for(let i=0;i<deleteImages.length;i++)
                    unlink(deleteImages[i], (err) => {
                      if (err) throw err;
                    });
                unlink(icon[0].path, (err) => {
                    if (err) throw err;
                  });
                throw Err(checkValidation,422);
            }
            checkValidation=await validation.isId(adminId)
            if(checkValidation!==true){
                deleteImages=images.map(i=>i.path);
                for(let i=0;i<deleteImages.length;i++)
                    unlink(deleteImages[i], (err) => {
                      if (err) throw err;
                    });
                unlink(icon[0].path, (err) => {
                    if (err) throw err;
                  });
                throw Err(checkValidation,422);
            }
            //
            icon=req.files['icon'][0];
            let admin=await models.admin.findOne({
                    where:{id:adminId},
                    attributes:['id'],
                    include:{
                            model:models.language,
                            attributes:['id','name'],
                            include:{
                                model:models.city,
                                attributes:['id','name','icon'],
                                include:{
                                        model:models.image,
                                        attributes:['url']
                                    }
                            }
                    }
            });
            let araCities='';
            let engCities='';
            admin.languages.forEach(i => {
                 i.name=='ara'?araCities=i.cities:engCities=i.cities;
            });
            //add
            let ara='';
            let eng='';
            admin.languages.forEach(i => {
                i.name=='ara'?ara=i:eng=i;
            });
            let newEngCity=await eng.createCity({
               name:engName,
               icon:icon.path
            });
            let newAraCity=await ara.createCity({
                name:araName,
                icon:icon.path 
            });
            let url=images.map(i=>({url:i.path,araCityId:newAraCity.id}));
            for(let i=0;i<url.length;i++){
            await newEngCity.createImage(url[i]);
            }
            await newAraCity.update({cityId:newEngCity.id});
            //
            let araCitiesJSON=[];
            for(i=0;i<araCities.length;i++)
                araCitiesJSON.push({
                    "id": araCities[i].id,
                    "name": araCities[i].name,
                    "icon": araCities[i].icon,
                    "images":engCities[i].images.map(j=>j.url)
                });
            araCitiesJSON.push({
                "id": newAraCity.id,
                "name": newAraCity.name,
                "icon": newAraCity.icon,
                "images":images.map(j=>j.path)
            })
            let engCitiesJSON=[];
            for(i=0;i<engCities.length;i++)
                engCitiesJSON.push({
                    "id": engCities[i].id,
                    "name": engCities[i].name,
                    "icon": engCities[i].icon,
                    "images":engCities[i].images.map(j=>j.url)
                });
            engCitiesJSON.push({
                "id": newEngCity.id,
                "name": newEngCity.name,
                "icon": newEngCity.icon,
                "images":images.map(j=>j.path)
            })
            res.status(201).json({
                araCities:araCitiesJSON,
                engCities:engCitiesJSON
            });
        }catch(err){
           if(!err.statusCode)
              err.statusCode=500;
            next(err);
        }
    });
};
const deleteCity=async(req,res,next)=>{
    try{
        const adminId=req.adminId;
        const cityId=req.params.id;
        const lang=req.get('lang');
        //validation
        let checkValidation=await validation.isSrting(lang);
        if(checkValidation!==true)
            throw Err(checkValidation,422);
        checkValidation=await validation.isId(cityId);
        if(checkValidation!==true)
            throw Err(checkValidation,422);
        checkValidation=await validation.isId(adminId);
        if(checkValidation!==true)
            throw Err(checkValidation,422);
        //
        let cityToDelete='';
        if(lang&&lang=='ara'){
            cityToDelete=await models.admin.findOne({
                where:{id:adminId},
                attributes:['id'],
                include:{
                    model:models.language,
                    attributes:['id'],
                    where:{name:lang},
                    include:{
                        model:models.city,
                        where:{id:cityId},
                        attributes:['id','icon'],
                        include:[{
                            model:models.city,
                            attributes:['id']
                        },{
                            model:models.image,
                            attributes:['id','url']
                        },{
                            model:models.hotel,
                            attributes:['id'],
                            include:{
                                model:models.image,
                                attributes:['id','url']
                            }
                        },{
                            model:models.package,
                            attributes:['id'],
                            include:{
                                model:models.image,
                                attributes:['id','url']
                            }
                        }]
                    }
                }
            });
            if(!cityToDelete)
               throw Err('this city not found',404);
            let check=await cityToDelete.languages[0].cities[0].city.destroy();//parent eng
            // cityToDelete.languages[0].cities[0].id//child ara
            if(!check)
                Err('delete  faild',422);
        }else if(lang && lang=='eng'){
            cityToDelete=await models.admin.findOne({
                where:{id:adminId},
                attributes:['id'],
                include:{
                    model:models.language,
                    attributes:['id'],
                    where:{name:lang},
                    include:{
                        model:models.city,
                        where:{id:cityId},
                        attributes:['id','icon'],
                        include:[{
                            model:models.image,
                            attributes:['id','url']
                        },{
                            model:models.hotel,
                            attributes:['id'],
                            include:{
                                model:models.image,
                                attributes:['id','url']
                            }
                        },{
                            model:models.package,
                            attributes:['id'],
                            include:{
                                model:models.image,
                                attributes:['id','url']
                            }
                        }]
                    }
                }
            });
            if(!cityToDelete)
                throw Err('this city not found',404);
            let check=await cityToDelete.languages[0].cities[0].destroy();//parent eng
            // cityToDelete.languages[0].cities[0].id//child ara
            if(!check)
                Err('delete  faild',422);
        }else
            throw Err('please select english or arabic language and try agen',422);
        //delete images (package,hotel,city)
        let allImages=[];
        allImages.push(cityToDelete.languages[0].cities[0].icon);
        cityToDelete.languages[0].cities[0].images.map(j=>{allImages.push(j.url)});
        if(cityToDelete.languages[0].cities[0].hotels.length!==0)
            cityToDelete.languages[0].cities[0].hotels.map(i=>{
                i.images.map(j=>{allImages.push(j.url)});
            });
        if(cityToDelete.languages[0].cities[0].packages.length!==0)
            cityToDelete.languages[0].cities[0].packages.map(i=>{
            i.images.map(j=>{allImages.push(j.url)});
        });
        const { unlink } = require('node:fs');
        for(let i=0;i<allImages.length;i++)
            unlink(allImages[i], (err) => {
              if (err) throw err;
            });
        //
        res.status(200).json({message:'delete success'});
    }catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
};
module.exports={
    deleteCity,
    addCity
}
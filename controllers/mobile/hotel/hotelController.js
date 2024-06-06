const models=require('../../../util/callModel');
const Err=require('../../../middleware/errorHandle');
const validation=require('../../../validation/methods');
const getHotels=async(req,res,next)=>{
    const adminId=req.adminId;
    const lang=req.get('lang');
    try{
        //validation
        let checkValidation=await validation.isId(adminId);
        if(checkValidation!==true)
            throw Err(checkValidation,422);
        checkValidation=await validation.isSrting(lang);
        if(checkValidation!==true)
            throw Err(checkValidation,422);
        //
        let hotelsJSON='';
        let hotels='';
        if(lang && lang=='ara') {
            hotels=await models.admin.findOne({
               where:{id:adminId},
               attributes:['id'],
               include:{
                   model:models.language,
                   attributes:['id'],
                   where:{name:lang},
                   include:{
                       model:models.hotel,
                       attributes:['id','name','description'],
                       include:[{
                                model:models.city,
                                attributes:['id','name','icon']
                            },{
                                model:models.hotel,
                                attributes:['id'],
                                include:{
                                        model:models.image,
                                        attributes:['url']
                                    }
                            }
                        ]
                   }
               }
            });
            hotelsJSON=hotels.languages[0].hotels.map(i=>({
                id:i.id,
                city:{id:i.city.id,name:i.city.name,icon:i.city.icon},
                name:i.name,
                description:i.description,
                images:i.hotel.images.map(j=>j.url)
            }));
        } else if(lang && lang=='eng') {
            hotels=await models.admin.findOne({
               where:{id:adminId},
               attributes:['id'],
               include:{
                   model:models.language,
                   attributes:['id'],
                   where:{name:lang},
                   include:{
                       model:models.hotel,
                       attributes:['id','name','description'],
                       include:[{
                                model:models.city,
                                attributes:['id','name','icon']
                            },{
                                model:models.image,
                                attributes:['url']
                            }
                        ]
                   }
               }
            });
            hotelsJSON=hotels.languages[0].hotels.map(i=>({
                id:i.id,
                city:{id:i.city.id,name:i.city.name,icon:i.city.icon},
                name:i.name,
                description:i.description,
                images:i.images.map(j=>j.url)
            }));
        } else throw Err('select correct language then try agen',422);
        if(hotels.languages[0].hotels.length==0)
            res.status(200).json({hotels:[]});
        else res.status(200).json({hotels:hotelsJSON});
    }catch(err){
       if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
};
const addHotel=async(req,res,next)=>{
    const upload=require('../../../middleware/image').uploadImage;
    const Op=require('sequelize').Op;
    upload('hotel','images')(req,res,async(err)=>{
        try{
            const multer=require('multer');
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                throw Err(err.message,422);
            } else if (err) {
                // An unknown error occurred when uploading.
                throw Err(err.message,422);
            }
            const lang=req.get('lang');
            const adminId=req.adminId;
            const araHotel=req.body.araHotel;
            const engHotel=req.body.engHotel;
            const images=req.files['images'];
            //validation
            if(!images)
                 throw Err('images are required',422);
            let imagToDel=images.map(i=>i.path);
            let checkValidation=await validation.isId(adminId);
            if(checkValidation!==true){
                const { unlink } = require('node:fs');
                for(let i=0;i<imagToDel.length;i++)
                    unlink(imagToDel[i], (err) => {
                      if (err) throw err;
                    });
                throw Err(checkValidation,422);
            }
            checkValidation=await validation.isSrting(lang);
            if(checkValidation!==true){
                const { unlink } = require('node:fs');
                for(let i=0;i<imagToDel.length;i++)
                    unlink(imagToDel[i], (err) => {
                      if (err) throw err;
                    });
                throw Err(checkValidation,422);
            }   
            let nameVal=[araHotel.name,engHotel.name];
            let descVal=[araHotel.description,engHotel.description];
            let idVal=[araHotel.cityId,engHotel.cityId];
            for(let i=0;i<nameVal.length;i++){
                checkValidation=await validation.isSrting(nameVal[i]);
                if(checkValidation!==true){
                    const { unlink } = require('node:fs');
                    for(let i=0;i<imagToDel.length;i++)
                        unlink(imagToDel[i], (err) => {
                          if (err) throw err;
                        });
                    throw Err(checkValidation,422);
                }   
            }
            for(let i=0;i<descVal.length;i++){
                checkValidation=await validation.iSDescription(descVal[i]);
                if(checkValidation!==true){
                    const { unlink } = require('node:fs');
                    for(let i=0;i<imagToDel.length;i++)
                        unlink(imagToDel[i], (err) => {
                          if (err) throw err;
                        });
                    throw Err(checkValidation,422);
                }   
            }
            for(let i=0;i<idVal.length;i++){
                checkValidation=await validation.isId(idVal[i]);
                if(checkValidation!==true){
                    const { unlink } = require('node:fs');
                    for(let i=0;i<imagToDel.length;i++)
                        unlink(imagToDel[i], (err) => {
                          if (err) throw err;
                        });
                    throw Err(checkValidation,422);
                }   
            }
            //
            let hotelsJSON=[];
            if(lang && lang=='ara'){
                let admin=await models.admin.findOne({
                    where:{id:adminId},
                    attributes:['id'],
                    include:{
                        model:models.language,
                        attributes:['name','id'],
                        where:{name:lang},
                        include:[{
                                model:models.city,
                                attributes:['id','name','icon'],
                                where:{id:araHotel.cityId},
                            },{
                                model:models.hotel,
                                attributes:['id','name','description'],
                                include:[{
                                    model:models.city,
                                    attributes:['id','name','icon']
                                },{
                                    model:models.hotel,
                                    attributes:['id'],
                                    include:{
                                        model:models.image,
                                        attributes:['url']
                                    }
                                }]
                            },{
                                 model:models.admin,
                                 attributes:['id'],
                                 include:{
                                     model:models.language,
                                     attributes:['id','name'],
                                }
                            }]
                    }
                });
                //add
                let ara='';
                let eng='';
                if(admin.languages[0].admin.languages[0].name=='ara'){
                    ara=admin.languages[0].admin.languages[0];
                    eng=admin.languages[0].admin.languages[1];
                }else{
                    ara=admin.languages[0].admin.languages[1];
                    eng=admin.languages[0].admin.languages[0];
                }
                let newAraHotel=await ara.createHotel(araHotel);
                let newengHotel=await eng.createHotel(engHotel);
                await newAraHotel.update({hotelId:newengHotel.id});
                let hotelImages=images.map(i=>({url:i.path,araHotelId:newAraHotel.id}));
                for(let i=0;i<hotelImages.length;i++)
                       await newengHotel.createImage(hotelImages[i]);
                //
                admin.languages[0].hotels.map(i=>{
                    hotelsJSON.push({
                        id:i.id,
                        city:i.city,
                        name:i.name,
                        description:i.description,
                        images:i.hotel.images.map(j=>j.url)
                    })
                });
                hotelsJSON.push({
                    id:newAraHotel.id,
                    city:admin.languages[0].cities[0],
                    name:newAraHotel.name,
                    description:newAraHotel.description,
                    images:images.map(i=>i.path)
                });
            }else if(lang && lang=='eng'){
                let admin=await models.admin.findOne({
                    where:{id:adminId},
                    attributes:['id'],
                    include:{
                        model:models.language,
                        attributes:['name','id'],
                        where:{name:lang},
                        include:[{
                            model:models.city,
                            attributes:['id','name','icon'],
                            where:{id:engHotel.cityId},
                        },{
                            model:models.hotel,
                            attributes:['id','name','description'],
                            include:[{
                                model:models.city,
                                attributes:['id','name','icon']
                            },{
                                model:models.image,
                                attributes:['url']
                            }]
                        },{
                            model:models.admin,
                            attributes:['id'],
                            include:{
                                model:models.language,
                                attributes:['id','name'],
                            }
                        }]
                    }
                });
                //add
                let ara='';
                let eng='';
                if(admin.languages[0].admin.languages[0].name=='ara'){
                    ara=admin.languages[0].admin.languages[0];
                    eng=admin.languages[0].admin.languages[1];
                }else{
                    ara=admin.languages[0].admin.languages[1];
                    eng=admin.languages[0].admin.languages[0];
                }
                let newAraHotel=await ara.createHotel(araHotel);
                let newengHotel=await eng.createHotel(engHotel);
                await newAraHotel.update({hotelId:newengHotel.id});
                let hotelImages=images.map(i=>({url:i.path,araHotelId:newAraHotel.id}));
                for(let i=0;i<hotelImages.length;i++)
                       await newengHotel.createImage(hotelImages[i]);
                //
                admin.languages[0].hotels.map(i=>{
                    hotelsJSON.push({
                        id:i.id,
                        city:i.city,
                        name:i.name,
                        description:i.description,
                        images:i.images.map(j=>j.url)
                    })
                });
                hotelsJSON.push({
                    id:newengHotel.id,
                    city:admin.languages[0].cities[0],
                    name:newengHotel.name,
                    description:newengHotel.description,
                    images:images.map(i=>i.path)
                });
            } else{ 
                imagToDel=images.map(i=>i.path);
                const { unlink } = require('node:fs');
                for(let i=0;i<imagToDel.length;i++)
                    unlink(imagToDel[i], (err) => {
                      if (err) throw err;
                    });
                throw Err('select correct language and try agen',422);
            }
            res.status(201).json({hotels:hotelsJSON});
        } catch(err){
            if(!err.statusCode)
                err.statusCode=500;
            next(err);
        }
    });
};
const deleteHotel=async(req,res,next)=>{
       const adminId=req.adminId;
       const lang=req.get('lang');
       const hotelId=req.params.id;
       try{
            //validation
            let checkValidation='';
            let idVal=[adminId,hotelId];
            for(let i=0;i<2;i++){
                checkValidation=await validation.isId(idVal[i]);
                if(checkValidation!==true)
                   throw Err(checkValidation,422);
            }
            checkValidation=await validation.isSrting(lang);
            if(checkValidation!==true)
                 throw Err(checkValidation,422);
            //
            let imagToDel=[];
            if(lang && lang=='ara'){
                let hotelToDelete=await models.admin.findOne({
                    where:{id:adminId},
                    attributes:['id'],
                    include:{
                        model:models.language,
                        where:{name:lang},
                        attributes:['id'],
                        include:{
                            model:models.hotel,
                            attributes:['id'],
                            where:{id:hotelId},
                            include:{
                                model:models.hotel,
                                attributes:['id'],
                                include:{
                                    model:models.image,
                                    attributes:['url']
                                }
                            }
                        }
                    }
                });
                if(!hotelToDelete)
                    throw Err('this hotel not found',404);
                imagToDel=hotelToDelete.languages[0].hotels[0].hotel.images.map(i=>i.url);
                let check=await hotelToDelete.languages[0].hotels[0].hotel.destroy();
                if(!check)
                    throw Err('delete fail',422);
            } else if(lang && lang=='eng'){
                let hotelToDelete=await models.admin.findOne({
                    where:{id:adminId},
                    attributes:['id'],
                    include:{
                        model:models.language,
                        where:{name:lang},
                        attributes:['id'],
                        include:{
                            model:models.hotel,
                            attributes:['id'],
                            where:{id:hotelId},
                            include:{
                                model:models.image,
                                attributes:['url']
                            }
                        }
                    }
                });
                if(!hotelToDelete)
                    throw Err('this hotel not found',404);
                imagToDel=hotelToDelete.languages[0].hotels[0].images.map(i=>i.url);
                let check=await hotelToDelete.languages[0].hotels[0].destroy();
                if(!check)
                    throw Err('delete fail',422);
            } else throw Err('please select correct language and try agen',422);
            const { unlink } = require('node:fs');
            for(let i=0;i<imagToDel.length;i++)
                unlink(imagToDel[i], (err) => {
                  if (err) throw err;
                });
            res.status(200).json({message:'delete success'});
       }catch(err){
            if(!err.statusCode)
                err.statusCode=500;
            next(err);
       }
};
module.exports={
    deleteHotel,
    addHotel,
    getHotels
};
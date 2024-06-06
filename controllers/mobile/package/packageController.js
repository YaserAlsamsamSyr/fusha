const models=require('../../../util/callModel');
const Err=require('../../../middleware/errorHandle');
const validaiton=require('../../../validation/methods');
const getPackages=async(req,res,next)=>{
    const lang=req.get('lang');
    const adminId=req.adminId;
    const searchType=req.params.searchType?req.params.searchType:'maxPrice';
    try{
        //validation
        let checkVal=await validaiton.isId(adminId);
        if(checkVal!==true)
             throw Err(checkVal,422);
        checkVal=await validaiton.isSrting(lang);
        if(checkVal!==true)
             throw Err(checkVal,422);
        checkVal=await validaiton.isSrting(searchType);
        if(checkVal!==true)
                  throw Err(checkVal,422);
        //
        let packagesJSON='';
        let packages='';
        if(
            searchType!='maxPrice'&&
            searchType!='minPrice'&&
            searchType!='lastDate'&&
            searchType!='newDate' &&
            searchType!='popular' &&
            searchType!='nonPopular'
        )
            throw Err('this type of search is not supported',422);
        if(lang && lang=='ara'){
            packages=await models.admin.findOne({
                where:{id:adminId},
                attributes:['id'],
                include:{
                    model:models.language,
                    attributes:['id'],
                    where:{name:lang},
                    include:{
                        model:models.package,
                        attributes:['createdAt','id','title','price','description','type','priceOffer'],
                        include:[{
                            model:models.package,
                            attributes:['id'],
                            include:{
                                model:models.image,
                                attributes:['url']
                            }
                        },{
                            model:models.city,
                            attributes:['id','name','icon']
                        }]
                    }
                }
            });
            packagesJSON=packages.languages[0].packages.map(i=>({
                id:i.id,
                title:i.title,
                city:{id:i.city.id,name:i.city.name,icon:i.city.icon},
                price:i.price,
                description:i.description,
                type:i.type,
                priceOffer:i.priceOffer,
                images:i.package.images.map(j=>j.url)
            }));
        } else if(lang && lang=='eng'){
            packages=await models.admin.findOne({
                where:{id:adminId},
                attributes:['id'],
                include:{
                    model:models.language,
                    attributes:['id'],
                    where:{name:lang},
                    include:{
                        model:models.package,
                        attributes:['createdAt','id','title','price','description','type','priceOffer'],
                        include:[{
                            model:models.image,
                            attributes:['url']
                        },{
                            model:models.city,
                            attributes:['id','name','icon']
                        }]
                    }
                }
            });
            packagesJSON=packages.languages[0].packages.map(i=>({
                id:i.id,
                title:i.title,
                city:{id:i.city.id,name:i.city.name,icon:i.city.icon},
                price:i.price,
                description:i.description,
                type:i.type,
                priceOffer:i.priceOffer,
                images:i.images.map(j=>j.url)
            }));
        } else throw Err('please select correct language and try agen',422);
        if(searchType=='maxPrice'){
            packagesJSON.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }else if(searchType=='minPrice'){
            packagesJSON.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        }else if(searchType=='lastDate'){
            if(lang=='ara')
                packagesJSON=packages.languages[0].packages.map(i=>({
                    id:i.id,
                    title:i.title,
                    city:{id:i.city.id,name:i.city.name,icon:i.city.icon},
                    price:i.price,
                    description:i.description,
                    type:i.type,
                    date:i.createdAt,
                    priceOffer:i.priceOffer,
                    images:i.package.images.map(j=>j.url)
                }));
            else if(lang=='eng')
                packagesJSON=packages.languages[0].packages.map(i=>({
                    id:i.id,
                    title:i.title,
                    city:{id:i.city.id,name:i.city.name,icon:i.city.icon},
                    price:i.price,
                    description:i.description,
                    type:i.type,
                    date:i.createdAt,
                    priceOffer:i.priceOffer,
                    images:i.images.map(j=>j.url)
                }));
            packagesJSON.sort((a, b) => parseFloat(new Date(a.date).getTime()) - parseFloat(new Date(b.date).getTime()));
            packagesJSON=packagesJSON.map(i=>({
                id:i.id,
                title:i.title,
                city:{id:i.city.id,name:i.city.name,icon:i.city.icon},
                price:i.price,
                description:i.description,
                type:i.type,
                priceOffer:i.priceOffer,
                images:i.images.map(j=>j)
            }));
        } else if(searchType=='newDate'){
            if(lang=='ara')
                packagesJSON=packages.languages[0].packages.map(i=>({
                    id:i.id,
                    title:i.title,
                    city:{id:i.city.id,name:i.city.name,icon:i.city.icon},
                    price:i.price,
                    description:i.description,
                    type:i.type,
                    date:i.createdAt,
                    priceOffer:i.priceOffer,
                    images:i.package.images.map(j=>j.url)
                }));
            else if(lang=='eng')
                packagesJSON=packages.languages[0].packages.map(i=>({
                    id:i.id,
                    title:i.title,
                    city:{id:i.city.id,name:i.city.name,icon:i.city.icon},
                    price:i.price,
                    description:i.description,
                    type:i.type,
                    date:i.createdAt,
                    priceOffer:i.priceOffer,
                    images:i.images.map(j=>j.url)
                }));
                packagesJSON.sort((a, b) => parseFloat(new Date(b.date).getTime()) - parseFloat(new Date(a.date).getTime()))
                packagesJSON=packagesJSON.map(i=>({
                    id:i.id,
                    title:i.title,
                    city:{id:i.city.id,name:i.city.name,icon:i.city.icon},
                    price:i.price,
                    description:i.description,
                    type:i.type,
                    priceOffer:i.priceOffer,
                    images:i.images.map(j=>j)
                }));
        }else if(searchType=='popular'){
            let popularPackage=[];
            for(let i=0;i<packagesJSON.length;i++)
                if(lang=='eng'&&packagesJSON[i].type=='popular')
                   popularPackage.push(packagesJSON[i]);
                else if(lang=='ara'&&packagesJSON[i].type=='عامة')
                   popularPackage.push(packagesJSON[i]);
            packagesJSON=popularPackage;
        }else if(searchType=='nonPopular'){
            let nonPopularPackage=[];
            for(let i=0;i<packagesJSON.length;i++)
                if(lang=='eng'&&packagesJSON[i].type=='nonPopular')
                    nonPopularPackage.push(packagesJSON[i]);
                else if(lang=='ara'&&packagesJSON[i].type=='ليست عامة')
                    nonPopularPackage.push(packagesJSON[i]);
            packagesJSON=nonPopularPackage;
        }
        res.status(200).json({packages:packagesJSON});
    }catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
};
const addPackage=(req,res,next)=>{
        const upload=require('../../../middleware/image').uploadImage;
        upload('package','images')(req,res,async(err)=>{
            try{
                const multer=require('multer');
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.
                    throw Err(err.message,422);
                } else if (err) {
                    // An unknown error occurred when uploading.
                    throw Err(err.message,422);
                }
                const adminId=req.adminId;
                const lang=req.get('lang');
                const araPackage=req.body.araPackage;//{title:,description:,type:,cityId:}
                const engPackage=req.body.engPackage;//{title:,description:,type:,cityId:}
                const price=req.body.price;
                const priceOffer=req.body.priceOffer;
                const images=req.files['images'];
                //validation
                if(!images)
                   throw Err('images are required',422);
                let imgToDel=images.map(i=>i.path);
                const { unlink } = require('node:fs');
                let checkVal=await validaiton.isId(adminId);
                if(checkVal!==true){
                    for(let i=0;i<imgToDel.length;i++)
                        unlink(imgToDel[i], (err) => {
                          if (err) throw err;
                        });
                    throw Err(checkVal,422);
                }
                checkVal=await validaiton.isSrting(lang);
                if(checkVal!==true){
                    for(let i=0;i<imgToDel.length;i++)
                        unlink(imgToDel[i], (err) => {
                          if (err) throw err;
                        });
                    throw Err(checkVal,422);
                }
                checkVal=await validaiton.isPrice(price);
                if(checkVal!==true){
                    for(let i=0;i<imgToDel.length;i++)
                        unlink(imgToDel[i], (err) => {
                          if (err) throw err;
                        });
                    throw Err(checkVal,422);
                }
                checkVal=await validaiton.isOffer(priceOffer);
                if(checkVal!==true){
                    for(let i=0;i<imgToDel.length;i++)
                        unlink(imgToDel[i], (err) => {
                          if (err) throw err;
                        });
                    throw Err(checkVal,422);
                }
                let titleWithTypeVal=[
                    araPackage.title,
                    araPackage.type,
                    engPackage.title,
                    engPackage.type
                ];
                let descVal=[
                    araPackage.description,
                    engPackage.description
                ];
                let idVal=[
                    araPackage.cityId,
                    engPackage.cityId
                ];
                for(let i=0;i<titleWithTypeVal.length;i++){
                    checkVal=await validaiton.isSrting(titleWithTypeVal[i]);
                    if(checkVal!==true){
                        for(let i=0;i<imgToDel.length;i++)
                        unlink(imgToDel[i], (err) => {
                          if (err) throw err;
                        });
                        throw Err(checkVal,422);
                    }
                }
                for(let i=0;i<descVal.length;i++){
                    checkVal=await validaiton.iSDescription(descVal[i]);
                    if(checkVal!==true){
                        for(let i=0;i<imgToDel.length;i++)
                        unlink(imgToDel[i], (err) => {
                          if (err) throw err;
                        });
                        throw Err(checkVal,422);
                    }
                }
                for(let i=0;i<idVal.length;i++){
                    checkVal=await validaiton.isId(idVal[i]);
                    if(checkVal!==true){
                        for(let i=0;i<imgToDel.length;i++)
                        unlink(imgToDel[i], (err) => {
                          if (err) throw err;
                        });
                        throw Err(checkVal,422);
                    }
                }
                //
                let packages='';
                let packagesJSON='';
                let newEngPackage='';
                let language={ara:'',eng:''};
                let newAraPackage='';
                let packageImages='';
                if(lang && lang=='ara'){
                    packages=await models.admin.findOne({
                        where:{id:adminId},
                        attributes:['id'],
                        include:{
                            model:models.language,
                            attributes:['id'],
                            where:{name:lang},
                            include:[{
                                model:models.package,
                                attributes:['id','title','price','description','type','priceOffer'],
                                include:[{
                                    model:models.package,
                                    attributes:['id'],
                                    include:{
                                        model:models.image,
                                        attributes:['url']
                                    }
                                },{
                                    model:models.city,
                                    attributes:['id','name','icon']
                                },{
                                    model:models.language,
                                    attributes:['id'],
                                    include:{
                                        model:models.admin,
                                        attributes:['id'],
                                        include:{
                                            model:models.language,
                                            attributes:['id','name']
                                        }
                                    }
                                }]
                            },{
                                model:models.city,
                                attributes:['id','name','icon'],
                                where:{id:araPackage.cityId}
                            }]
                        }
                    });
                    packagesJSON=packages.languages[0].packages.map(i=>({
                        id:i.id,
                        title:i.title,
                        city:{id:i.city.id,name:i.city.name,icon:i.city.icon},
                        price:i.price,
                        description:i.description,
                        type:i.type,
                        priceOffer:i.priceOffer,
                        images:i.package.images.map(j=>j.url)
                    }));
                    //add
                    newEngPackage={
                        priceOffer:priceOffer,
                        price:price,
                        title:engPackage.title,
                        description:engPackage.description,
                        type:engPackage.type,
                        cityId:engPackage.cityId
                    };
                    packages.languages[0].packages[0].language.admin.languages[0].name=='ara'?
                        language={
                            ara:packages.languages[0].packages[0].language.admin.languages[0],
                            eng:packages.languages[0].packages[0].language.admin.languages[1]
                        }:
                        language={
                            ara:packages.languages[0].packages[0].language.admin.languages[1],
                            eng:packages.languages[0].packages[0].language.admin.languages[0]
                        }
                    ;
                    newEngPackage=await language.eng.createPackage(newEngPackage);
                    newAraPackage={
                        priceOffer:priceOffer,
                        price:price,
                        title:araPackage.title,
                        description:araPackage.description,
                        type:araPackage.type,
                        cityId:araPackage.cityId,
                        packageId:newEngPackage.id
                    };
                    newAraPackage=await language.ara.createPackage(newAraPackage);
                    newEngPackage.packageId=newAraPackage.id;
                    await newEngPackage.save();
                    packageImages=images.map(i=>({url:i.path,araPackageId:newAraPackage.id}));
                    for(let i=0;i<packageImages.length;i++)
                        await newEngPackage.createImage(packageImages[i]);
                    //
                    packagesJSON.push({
                        id:newAraPackage.id,
                        title:newAraPackage.title,
                        city:{
                            id:packages.languages[0].cities[0].id,
                            name:packages.languages[0].cities[0].name,
                            icon:packages.languages[0].cities[0].icon
                        },
                        price:newAraPackage.price,
                        description:newAraPackage.description,
                        type:newAraPackage.type,
                        priceOffer:newAraPackage.priceOffer,
                        images:packageImages.map(j=>j.url)
                    });
                }else if(lang && lang=='eng'){
                    packages=await models.admin.findOne({
                        where:{id:adminId},
                        attributes:['id'],
                        include:{
                            model:models.language,
                            attributes:['id'],
                            where:{name:lang},
                            include:[{
                                model:models.package,
                                attributes:['id','title','price','description','type','priceOffer'],
                                include:[{
                                    model:models.image,
                                    attributes:['url']
                                },{
                                    model:models.city,
                                    attributes:['id','name','icon']
                                },{
                                    model:models.language,
                                    attributes:['id'],
                                    include:{
                                        model:models.admin,
                                        attributes:['id'],
                                        include:{
                                            model:models.language,
                                            attributes:['id','name']
                                        }
                                    }
                                }]
                            },{
                                model:models.city,
                                attributes:['id','name','icon'],
                                where:{id:engPackage.cityId}
                            }]
                        }
                    });
                    packagesJSON=packages.languages[0].packages.map(i=>({
                        id:i.id,
                        title:i.title,
                        city:{id:i.city.id,name:i.city.name,icon:i.city.icon},
                        price:i.price,
                        description:i.description,
                        type:i.type,
                        priceOffer:i.priceOffer,
                        images:i.images.map(j=>j.url)
                    }));
                    //add
                    newEngPackage={
                        priceOffer:priceOffer,
                        price:price,
                        title:engPackage.title,
                        description:engPackage.description,
                        type:engPackage.type,
                        cityId:engPackage.cityId
                    };
                    packages.languages[0].packages[0].language.admin.languages[0].name=='ara'?
                        language={
                            ara:packages.languages[0].packages[0].language.admin.languages[0],
                            eng:packages.languages[0].packages[0].language.admin.languages[1]
                        }:
                        language={
                            ara:packages.languages[0].packages[0].language.admin.languages[1],
                            eng:packages.languages[0].packages[0].language.admin.languages[0]
                        }
                    ;
                    newEngPackage=await language.eng.createPackage(newEngPackage);
                    newAraPackage={
                        priceOffer:priceOffer,
                        price:price,
                        title:araPackage.title,
                        description:araPackage.description,
                        type:araPackage.type,
                        cityId:araPackage.cityId,
                        packageId:newEngPackage.id
                    };
                    newAraPackage=await language.ara.createPackage(newAraPackage);
                    newEngPackage.packageId=newAraPackage.id;
                    await newEngPackage.save();
                    packageImages=images.map(i=>({url:i.path,araPackageId:newAraPackage.id}));
                    for(let i=0;i<packageImages.length;i++)
                        await newEngPackage.createImage(packageImages[i]);
                    //
                    packagesJSON.push({
                        id:newEngPackage.id,
                        title:newEngPackage.title,
                        city:{
                            id:packages.languages[0].cities[0].id,
                            name:packages.languages[0].cities[0].name,
                            icon:packages.languages[0].cities[0].icon
                        },
                        price:newEngPackage.price,
                        description:newEngPackage.description,
                        type:newEngPackage.type,
                        priceOffer:newEngPackage.priceOffer,
                        images:packageImages.map(j=>j.url)
                    });
                }else{
                    //delete uploded iamge
                    for(let i=0;i<imgToDel.length;i++)
                    unlink(imgToDel[i], (err) => {
                      if (err) throw err;
                    });
                    throw Err('please select correct language then try agen',422);
                }
                res.status(201).json({packages:packagesJSON});
            }catch(err){
                if(!err.statusCode)
                    err.statusCode=500;
                next(err);
            }
            
        });
};
const deletePackage=async(req,res,next)=>{
    try{
        const adminId=req.adminId;
        const packageId=req.params.packageId;
        const lang=req.get('lang');
        //validaiton
        let checkVal=await validaiton.isSrting(lang);
        if(checkVal!==true)
                throw Err(checkVal,422);
        checkVal=await validaiton.isId(adminId);
        if(checkVal!==true)
                throw Err(checkVal,422);
        checkVal=await validaiton.isId(packageId);
        if(checkVal!==true)
                throw Err(checkVal,422);
        //
        let packageImages=[];
        if(lang && lang=='ara'){
                const packageToDelete=await models.admin.findOne({
                    where:{id:adminId},
                    attributes:['id'],
                    include:{
                        model:models.language,
                        attributes:['id'],
                        where:{name:lang},
                        include:{
                            model:models.package,
                            attributes:['id'],
                            where:{id:packageId},
                            include:{
                                model:models.package,
                                attributes:['id'],
                                include:{
                                    model:models.image,
                                    attributes:['url']
                                }
                            }
                        }
                    }
                });
                if(!packageToDelete) throw Err('this package not found',404);
                packageImages=packageToDelete.languages[0].packages[0].package.images;
                packageImages=packageImages.map(i=>i.url);
                let check=await packageToDelete.languages[0].packages[0].package.destroy();
                if(!check) throw Err('delete fail',422);
        }else if(lang && lang=='eng'){
            const packageToDelete=await models.admin.findOne({
                where:{id:adminId},
                attributes:['id'],
                include:{
                    model:models.language,
                    attributes:['id'],
                    where:{name:lang},
                    include:{
                        model:models.package,
                        attributes:['id'],
                        where:{id:packageId},
                        include:{
                            model:models.image,
                            attributes:['url']
                        }
                    }
                }
            });
            if(!packageToDelete) throw Err('this package not found',404);
            packageImages=packageToDelete.languages[0].packages[0].images;
            packageImages=packageImages.map(i=>i.url);
            let check=await packageToDelete.languages[0].packages[0].destroy();
            if(!check) throw Err('delete fail',422);
        }else throw Err('please select correct language and try agen',422);
        const { unlink } = require('node:fs');
        for(let i=0;i<packageImages.length;i++)
            unlink(packageImages[i], (err) => {
              if (err) throw err;
            });
        res.status(200).json({message:'delete success'});
    }catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
     }
};
const getMoreAboutPackage=async(req,res,next)=>{
        const adminId=req.adminId;
        const lang=req.get('lang');
        const packageId=req.params.packageId;
        try{    
            //validation
            let checkVal=await validaiton.isSrting(lang);
            if(checkVal!==true)
                throw Err(checkVal,422);
            checkVal=await validaiton.isId(adminId);
            if(checkVal!==true)
                throw Err(checkVal,422);
            checkVal=await validaiton.isId(packageId);
            if(checkVal!==true)
                throw Err(checkVal,422);
            //
            let poepleJSON='';
            if(lang && lang=='ara'){
                let people=await models.admin.findOne({
                   where:{id:adminId},
                   attributes:['id'],
                   include:{
                       model:models.language,
                       attributes:['id'],
                       where:{name:lang},
                       include:{
                           model:models.package,
                           attributes:['id'],
                           where:{id:packageId},
                           include:{
                               model:models.package,
                               attributes:['id'],
                               include:{
                                   model:models.customer,
                                   attributes:['phoneNumber','paymentId']
                               }
                           }
                       }
                   }
                });
                if(!people) throw Err('this package not found',404);
                poepleJSON=people.languages[0].packages[0].package.customers;
            }else if(lang && lang=='eng'){
                let people=await models.admin.findOne({
                    where:{id:adminId},
                    attributes:['id'],
                    include:{
                        model:models.language,
                        attributes:['id'],
                        where:{name:lang},
                        include:{
                            model:models.package,
                            attributes:['id'],
                            where:{id:packageId},
                            include:{
                                    model:models.customer,
                                    attributes:['phoneNumber','paymentId']
                            }
                        }
                    }
                 });
                 if(!people) throw Err('this package not found',404);
                 poepleJSON=people.languages[0].packages[0].customers;
            }else throw Err('please select correct language and try agen',422);
            res.status(200).json({people:poepleJSON});
        }catch(err){
            if(!err.statusCode)
               err.statusCode=500;
            next(err);
        }
};
const convertPackageToPopular=async(req,res,next)=>{
    const adminId=req.adminId;
    const lang=req.get('lang');
    const packageId=req.params.packageId;
    try{    
        //validation
        let checkVal=await validaiton.isSrting(lang);
        if(checkVal!==true)
            throw Err(checkVal,422);
        checkVal=await validaiton.isId(adminId);
        if(checkVal!==true)
            throw Err(checkVal,422);
        checkVal=await validaiton.isId(packageId);
        if(checkVal!==true)
            throw Err(checkVal,422);
        //
        let packageToConvert='';
        if(lang && lang=='ara'){
                packageToConvert=await models.admin.findOne({
                      where:{id:adminId},
                      attributes:['id'],
                      include:{
                          model:models.language,
                          attributes:['id'],
                          where:{name:lang},
                          include:{
                              model:models.package,
                              attributes:['id','type'],
                              where:{id:packageId},
                              include:{
                                  model:models.package,
                                  attributes:['id','type']
                              }
                          }
                      }
                });
                if(!packageToConvert) throw Err('this package not found',404);
                let editPackage='';
                editPackage=packageToConvert.languages[0].packages[0];
                editPackage.type='عامة';
                editPackage.package.type='popular';
                let check=await editPackage.save();
                if(!check) throw Err('update fail',422);
                check=await editPackage.package.save();
                if(!check) throw Err('update fail',422);
        } else if(lang && lang=='eng'){
                packageToConvert=await models.admin.findOne({
                    where:{id:adminId},
                    attributes:['id'],
                    include:{
                        model:models.language,
                        attributes:['id'],
                        where:{name:lang},
                        include:{
                            model:models.package,
                            attributes:['id','type'],
                            where:{id:packageId},
                            include:{
                                model:models.package,
                                attributes:['id','type']
                            }
                        }
                    }
              });
              if(!packageToConvert) throw Err('this package not found',404);
              let editPackage='';
              editPackage=packageToConvert.languages[0].packages[0];
              editPackage.type='popular';
              editPackage.package.type='عامة';
              let check=await editPackage.save();
              if(!check) throw Err('update fail',422);
              check=await editPackage.package.save();
              if(!check) throw Err('update fail',422);
        }else throw Err('please select correct language and try agen',422);
        res.status(200).json({message:"convert success"});
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};
const convertPackageToNoPopular=async(req,res,next)=>{
    const adminId=req.adminId;
    const lang=req.get('lang');
    const packageId=req.params.packageId;
    try{    
        //validation
        let checkVal=await validaiton.isSrting(lang);
        if(checkVal!==true)
            throw Err(checkVal,422);
        checkVal=await validaiton.isId(adminId);
        if(checkVal!==true)
            throw Err(checkVal,422);
        checkVal=await validaiton.isId(packageId);
        if(checkVal!==true)
            throw Err(checkVal,422);
        //
        let packageToConvert='';
        if(lang && lang=='ara'){
                packageToConvert=await models.admin.findOne({
                      where:{id:adminId},
                      attributes:['id'],
                      include:{
                          model:models.language,
                          attributes:['id'],
                          where:{name:lang},
                          include:{
                              model:models.package,
                              attributes:['id','type'],
                              where:{id:packageId},
                              include:{
                                  model:models.package,
                                  attributes:['id','type']
                              }
                          }
                      }
                });
                if(!packageToConvert) throw Err('this package not found',404);
                let editPackage='';
                editPackage=packageToConvert.languages[0].packages[0];
                editPackage.type='ليست عامة';
                editPackage.package.type='nonPopular';
                let check=await editPackage.save();
                if(!check) throw Err('update fail',422);
                check=await editPackage.package.save();
                if(!check) throw Err('update fail',422);
        } else if(lang && lang=='eng'){
                packageToConvert=await models.admin.findOne({
                    where:{id:adminId},
                    attributes:['id'],
                    include:{
                        model:models.language,
                        attributes:['id'],
                        where:{name:lang},
                        include:{
                            model:models.package,
                            attributes:['id','type'],
                            where:{id:packageId},
                            include:{
                                model:models.package,
                                attributes:['id','type']
                            }
                        }
                    }
              });
              if(!packageToConvert) throw Err('this package not found',404);
              let editPackage='';
              editPackage=packageToConvert.languages[0].packages[0];
              editPackage.type='nonPopular';
              editPackage.package.type='ليست عامة';
              let check=await editPackage.save();
              if(!check) throw Err('update fail',422);
              check=await editPackage.package.save();
              if(!check) throw Err('update fail',422);
        }else throw Err('please select correct language and try agen',422);
        res.status(200).json({message:"convert success"});
    }catch(err){
        if(!err.statusCode)
            err.statusCode=500;
        next(err);
    }
};
module.exports={
    convertPackageToNoPopular,
    convertPackageToPopular,
    getMoreAboutPackage,
    deletePackage,
    addPackage,
    getPackages
};
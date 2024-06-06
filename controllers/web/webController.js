const models=require('../../util/callModel');
const Err=require('../../middleware/errorHandle');
const validation=require('../../validation/methods');
const addComplaint=async(req,res,next)=>{
      const newComplaint=req.body;//{firstName:,lastName:,phoneNumber:,description:}
      try{
            //validation
            let stringVal=[newComplaint.firstName,newComplaint.lastName];
            let checkVal='';
            for(let i=0;i<stringVal.length;i++){
                checkVal=await validation.isSrting(stringVal[i]);
                if(checkVal!==true)
                    throw Err(checkVal,422);
            }
            checkVal=await validation.isPhoneNumber(newComplaint.phoneNumber);
            if(checkVal!==true)
                throw Err(checkVal,422);
            checkVal=await validation.iSDescription(newComplaint.description);
            if(checkVal!==true)
                throw Err(checkVal,422);
            //
            let check=await models.complaint.create(newComplaint);
            if(!check) throw Err('send faild please try agen',422);
            res.status(201).json({message:'send success'});
      }catch(err){
            if(!err.statusCode)
                err.statusCode=500;
            next(err);
      }
};
const home=async(req,res,next)=>{
       const lang=req.get('lang');
       try{
            //validation
            let checkVal=await validation.isSrting(lang);
            if(checkVal!==true)
                throw Err(checkVal,422);
            //
            let packageAndHotel='';
            let packageAndHotelJSON={packages:'',hotels:''};
            if(lang && lang=='ara'){
                    packageAndHotel=await models.language.findOne({
                        where:{name:lang},
                        attributes:['id'],
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
                            }]
                        },{
                            model:models.hotel,
                            attributes:['id','name','description'],
                            include:[{
                                model:models.hotel,
                                attributes:['id'],
                                include:{
                                    model:models.image,
                                    attributes:['url']
                                }
                            },{
                                model:models.city,
                                attributes:['id','name','icon']
                            }]
                        }]
                    });
                    packageAndHotelJSON.hotels=packageAndHotel.hotels.map(i=>(
                        {
                            id:i.id,
                            city:{id:i.city.id,name:i.city.name,icon:i.city.icon},
                            name:i.name,
                            description:i.description,
                            images:i.hotel.images.map(i=>i.url)
                        }
                    ));
                    packageAndHotelJSON.packages=packageAndHotel.packages.map(i=>(
                        {
                            id:i.id,
                            title:i.title,
                            city:{id:i.city.id,name:i.city.name,icon:i.city.icon},
                            price:i.price,
                            description:i.description,
                            type:i.type,
                            priceOffer:i.priceOffer,
                            images:i.package.images.map(i=>i.url)
                        }
                    ));
            }else if(lang && lang=='eng'){
                packageAndHotel=await models.language.findOne({
                    where:{name:lang},
                    attributes:['id'],
                    include:[{
                        model:models.package,
                        attributes:['id','title','price','description','type','priceOffer'],
                        include:[{
                                    model:models.image,
                                    attributes:['url']
                        },{
                                model:models.city,
                                attributes:['id','name','icon']
                        }]
                    },{
                        model:models.hotel,
                        attributes:['id','name','description'],
                        include:[{
                                model:models.image,
                                attributes:['url']
                        },{
                            model:models.city,
                            attributes:['id','name','icon']
                        }]
                    }]
                });
                packageAndHotelJSON.hotels=packageAndHotel.hotels.map(i=>(
                    {
                        id:i.id,
                        city:{id:i.city.id,name:i.city.name,icon:i.city.icon},
                        name:i.name,
                        description:i.description,
                        images:i.images.map(i=>i.url)
                    }
                ));
                packageAndHotelJSON.packages=packageAndHotel.packages.map(i=>(
                    {
                        id:i.id,
                        title:i.title,
                        city:{id:i.city.id,name:i.city.name,icon:i.city.icon},
                        price:i.price,
                        description:i.description,
                        type:i.type,
                        priceOffer:i.priceOffer,
                        images:i.images.map(i=>i.url)
                    }
                ));
            }else throw Err('please select correct language and try agen',422);
            res.status(200).json(packageAndHotelJSON);
       }catch(err){
            if(!err.statusCode)
               err.statusCode=500;
            next(err);
       }
};
const getPackages=async(req,res,next)=>{
    const lang=req.get('lang');
    const searchType=req.params.searchType?req.params.searchType:'maxPrice';
    try{    
        //validation
        let checkVal=await validation.isSrting(lang);
        if(checkVal!==true)
            throw Err(checkVal,422);
        checkVal=await validation.isSrting(searchType);
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
            packages=await models.language.findOne({
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
            });
            packagesJSON=packages.packages.map(i=>({
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
            packages=await models.language.findOne({
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
            });
            packagesJSON=packages.packages.map(i=>({
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
                packagesJSON=packages.packages.map(i=>({
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
                packagesJSON=packages.packages.map(i=>({
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
                packagesJSON=packages.packages.map(i=>({
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
                packagesJSON=packages.packages.map(i=>({
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
const addReservation=async(req,res,next)=>{
    try{
        const packageId=req.params.packageId;
        const lang=req.get('lang');
        const reservation=req.body;//{phoneNumber:,paymentId:}
        //validation
        let checkVal=await validation.isSrting(lang);
        if(checkVal!==true)
           throw Err(checkVal,422);
        checkVal=await validation.isId(packageId);
        if(checkVal!==true)
           throw Err(checkVal,422);
        checkVal=await validation.isPhoneNumber(reservation.phoneNumber);
        if(checkVal!==true)
           throw Err(checkVal,422);
        checkVal=await validation.isPaymentId(reservation.paymentId);
        if(checkVal!==true)
           throw Err(checkVal,422);
        //
        if(lang &&lang=='ara'){
            let newComplaint=await models.language.findOne({
                attributes:['id'],
                where:{name:lang},
                include:{
                    model:models.package,
                    where:{id:packageId},
                    attributes:['id'],
                    include:{
                        model:models.package,
                        attributes:['id']
                    }
                }
            });
            if(!newComplaint) throw Err('this  package not found',404);
            reservation.araPackageId=newComplaint.packages[0].id;
            let check=await newComplaint.packages[0].package.createCustomer(reservation);
            if(!check) throw Err('reservation fiald try agen',422);
        }else if(lang&& lang=='eng'){
            let newComplaint=await models.language.findOne({
                attributes:['id'],
                where:{name:lang},
                include:{
                    model:models.package,
                    where:{id:packageId},
                    attributes:['id'],
                    include:{
                        model:models.package,
                        attributes:['id']
                    }
                }
            });
            if(!newComplaint) throw Err('this  package not found',404);
            reservation.araPackageId=newComplaint.packages[0].package.id;
            let check=await newComplaint.packages[0].createCustomer(reservation);
            if(!check) throw Err('reservation fiald try agen',422);
        }else throw Err('please select correct language and try agen',422);
        res.status(201).json({message:'added success'});
    }catch(err){
        if(!err.statusCode)
              err.statusCode=500;
        next(err);
    }
};
module.exports={
    addReservation,
    getPackages,
    home,
    addComplaint
};
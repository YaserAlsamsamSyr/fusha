const complaint=require('./complaint/complaintController');
const city=require('./city/cityController');
const hotle=require('./hotel/hotelController');
const package=require('./package/packageController');
const validation=require('../../validation/methods');
const login=async(req,res,next)=>{
    const models=require('../../util/callModel');
    const err=require('../../middleware/errorHandle');
    const jwt=require('jsonwebtoken');
    const {userName,password}=req.body;
    try{
        //validation
        let checkValidation=await validation.isUserName(userName);
        if(checkValidation!==true)
              throw require('../../middleware/errorHandle')(checkValidation,422);
        checkValidation=await validation.isPassword(password);
        if(checkValidation!==true)
              throw require('../../middleware/errorHandle')(checkValidation,422);
        //
        let admin=await models.admin.findOne({
            where:{userName:userName,password:password},
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
        if(!admin)
           throw err('username or password incorrect',422);
        //construct json
        if(admin.languages[0].cities.length==0){
                let token=jwt.sign({adminId:admin.id},'fushaMgr',{expiresIn:'10h'});
                res.status(200).json({
                   token,
                   araCities:[],
                   engCities:[]
                });
            } else{
            let araCities='';
            let engCities='';
            admin.languages.forEach(i => {
                 i.name=='ara'?araCities=i.cities:engCities=i.cities;
            });
            let araCitiesJSON=[];
            for(i=0;i<araCities.length;i++)
                araCitiesJSON.push({
                    "id": araCities[i].id,
                    "name": araCities[i].name,
                    "icon": araCities[i].icon,
                    "images":engCities[i].images.map(j=>j.url)
                });
            let engCitiesJSON=[];
            for(i=0;i<engCities.length;i++)
                engCitiesJSON.push({
                    "id": engCities[i].id,
                    "name": engCities[i].name,
                    "icon": engCities[i].icon,
                    "images":engCities[i].images.map(j=>j.url)
                }); 
            let token=jwt.sign({adminId:admin.id},'fushaMgr',{expiresIn:'10h'});
            res.status(200).json({
                token:token,
                araCities:araCitiesJSON,
                engCities:engCitiesJSON
            });
        }
    }catch(err){
        if(!err.statusCode)
           err.statusCode=500;
        next(err);
    }
};
const getComplaints=complaint.getComplaints;
const deleteComplaint=complaint.deleteComplaint;
const addCity=city.addCity;
const deleteCity=city.deleteCity;
const getHotels=hotle.getHotels;
const addHotel=hotle.addHotel;
const deleteHotel=hotle.deleteHotel;
const getPackages=package.getPackages
const addPackage=package.addPackage;
const deletePackage=package.deletePackage;
const getMoreAboutPackage=package.getMoreAboutPackage;
const convertPackageToPopular=package.convertPackageToPopular;
const convertPackageToNoPopular=package.convertPackageToNoPopular;

module.exports={
    convertPackageToNoPopular,
    convertPackageToPopular,
    getMoreAboutPackage,
    deletePackage,
    addPackage,
    getPackages,
    deleteHotel,
    addHotel,
    getHotels,
    deleteCity,
    addCity,
    deleteComplaint,
    getComplaints,
    login
};
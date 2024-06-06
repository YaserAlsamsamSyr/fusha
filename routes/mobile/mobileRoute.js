const express=require('express');
const auth=require('../../middleware/auth');
const mobileController=require('../../controllers/mobile/mobileController');
const route=express.Router();

route.post('/login',mobileController.login);
route.post('/addCity',auth.auth,mobileController.addCity);
route.post('/addHotel',auth.auth,mobileController.addHotel);
route.post('/addPackage',auth.auth,mobileController.addPackage);
route.get('/getComplaints',auth.auth,mobileController.getComplaints);
route.get('/getHotels',auth.auth,mobileController.getHotels);
route.get('/getPackages/:searchType',auth.auth,mobileController.getPackages);
route.get('/getMoreAboutPackage/:packageId',auth.auth,mobileController.getMoreAboutPackage);
route.get('/convertPackageToPopular/:packageId',auth.auth,mobileController.convertPackageToPopular);
route.get('/convertPackageToNoPopular/:packageId',auth.auth,mobileController.convertPackageToNoPopular);
route.delete('/deleteComplaint/:id',auth.auth,mobileController.deleteComplaint);
route.delete('/deleteCity/:id',auth.auth,mobileController.deleteCity);
route.delete('/deleteHotel/:id',auth.auth,mobileController.deleteHotel);
route.delete('/deletePackage/:packageId',auth.auth,mobileController.deletePackage);

module.exports=route;
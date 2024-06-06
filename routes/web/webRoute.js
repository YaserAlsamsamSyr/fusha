const express=require('express');
const webController=require('../../controllers/web/webController');
const route=express.Router();

route.post('/addComplaint',webController.addComplaint);
route.post('/addReservation/:packageId',webController.addReservation);
route.post('/addReservation/:packageId',webController.addReservation);
route.get('/home',webController.home);
route.get('/getPackages/:searchType',webController.getPackages);

module.exports=route;
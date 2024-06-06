const express=require('express');
const adminRoute=require('./mobile/mobileRoute');
const webRoute=require('./web/webRoute');
const route=express.Router();

route.use('/adm',adminRoute);
route.use('/customer/web',webRoute);

module.exports=route;
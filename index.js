const express=require('express');
const body=require('body-parser');
const path=require('path');
const cors=require('cors');
const DB=require('./util/DB');
const route=require('./routes/fushaRoutes');
require('./util/modelRelaton');
const app=express();
app.use(cors());
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,lang,Authorization');
    next();
 });
app.use(body.json());
app.use(body.urlencoded({extended:false}))
app.use('/public',express.static(path.join(__dirname,'public')))
app.use(route);
app.use((err,req,res,next)=>{
    res.status(err.statusCode).json({message:err.message});
});
(async()=>{
    try{
        // await DB.sync({alter:true});
        await DB.sync();
        console.log("connected to database");
        app.listen(process.env.PORT||9090);
        console.log("server has been started success");
    }catch(err){
        console.log("database or server can't run because an error accure");
        // console.log(err);
        throw err;
    }
})()
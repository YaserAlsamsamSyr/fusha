const sequelize=require('sequelize');
const seq=new sequelize({
     host: process.env.HOST||'localhost',
     username: process.env.USERNAMEE||'root',
     password: process.env.PASSWORD||'',
     database: process.env.DBNAME||'fusha',
     dialect: 'mysql',
     dialectModule: require('mysql2'),
     benchmark: true 
});
module.exports=seq;
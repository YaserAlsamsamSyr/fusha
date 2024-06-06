const DbConnection=require('../util/DB');
const seq=require('sequelize');

const admin=DbConnection.define('admin',{
  id:{
    type:seq.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  userName:{
    allowNull:false,
    type:seq.STRING
  },
  password:{
    type:seq.STRING,
    allowNull:false
  }
});

module.exports=admin;
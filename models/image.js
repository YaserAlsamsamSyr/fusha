const DbConnection=require('../util/DB');
const seq=require('sequelize');

const image=DbConnection.define('image',{
  id:{
    type:seq.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  url:{
    allowNull:false,
    type:seq.STRING
  }
});

module.exports=image;
const DbConnection=require('../util/DB');
const seq=require('sequelize');

const hotel=DbConnection.define('hotel',{
  id:{
    type:seq.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  name:{
    allowNull:false,
    type:seq.STRING
  },
  description:{
    type:seq.STRING,
    allowNull:false
  }
});

module.exports=hotel;
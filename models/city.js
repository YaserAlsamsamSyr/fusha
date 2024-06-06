const DbConnection=require('../util/DB');
const seq=require('sequelize');

const city=DbConnection.define('city',{
  id:{
    type:seq.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  name:{
    allowNull:false,
    type:seq.STRING
  },
  icon:{
    type:seq.STRING,
    allowNull:false
  }
});

module.exports=city;
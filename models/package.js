const DbConnection=require('../util/DB');
const seq=require('sequelize');

const package=DbConnection.define('package',{
  id:{
    type:seq.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  title:{
    allowNull:false,
    type:seq.STRING
  },
  price:{
    allowNull:false,
    type:seq.DOUBLE
  },  
  description:{
    allowNull:false,
    type:seq.STRING
  },  
  type:{
    allowNull:false,
    type:seq.STRING
  },  
  priceOffer:{
    allowNull:false,
    type:seq.DOUBLE
  }
});

module.exports=package;
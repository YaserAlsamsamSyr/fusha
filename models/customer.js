const DbConnection=require('../util/DB');
const seq=require('sequelize');

const customer=DbConnection.define('customer',{
  id:{
    type:seq.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  phoneNumber:{
    allowNull:false,
    type:seq.STRING
  },
  paymentId:{
    type:seq.STRING,
    allowNull:false
  }
});

module.exports=customer;
const DbConnection=require('../util/DB');
const seq=require('sequelize');

const complaint=DbConnection.define('complaint',{
  id:{
    type:seq.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  firstName:{
    allowNull:false,
    type:seq.STRING
  },
  lastName:{
    type:seq.STRING,
    allowNull:false
  },
  phoneNumber:{
    type:seq.STRING,
    allowNull:false
  },
  description:{
    type:seq.STRING,
    allowNull:false
  }
});

module.exports=complaint;
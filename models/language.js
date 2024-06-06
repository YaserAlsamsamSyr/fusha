const DbConnection=require('../util/DB');
const seq=require('sequelize');

const language=DbConnection.define('language',{
  id:{
    type:seq.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  name:{
    allowNull:false,
    type:seq.STRING
  }
});

module.exports=language;
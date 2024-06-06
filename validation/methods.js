const rules=require('./rules');
const isSrting=(toValid)=>{
   return new Promise((resolve,reject)=>{
       !rules.checkSrting.test(toValid)?
            resolve(`${toValid} is not valid, must be string and characters same type of language and maximum 200 characters`)
            :
            resolve(true);
   });
};
const isId=(toValid)=>{
    return new Promise((resolve,reject)=>{
        !rules.id.test(toValid)?
            resolve(`${toValid} is not valid, must be numbers`)
            :
            resolve(true);
    });
};
const isPrice=(toValid)=>{
    return new Promise((resolve,reject)=>{
        !rules.price.test(toValid)?
            resolve(`price ${toValid} is not valid`)
            :
            resolve(true);
    });
};
const isPhoneNumber=(toValid)=>{
    return new Promise((resolve,reject)=>{
        !rules.checkPhoneNumber.test(toValid)?
            resolve(`PhoneNumber ${toValid} is not valid, must be numbers and from 6 to 25 digits`)
            :
            resolve(true);
    });
};
const isOffer=(toValid)=>{
    return new Promise((resolve,reject)=>{
        !rules.offer.test(toValid)?
            resolve(`${toValid} is not valid, must be like '20.3% or 20% or with out %'`)
            :
            resolve(true);
    });
};
const isPassword=(toValid)=>{
    return new Promise((resolve,reject)=>{
        !rules.checkPassword.test(toValid)?
            resolve('password invalid , must be from 8 to 20 characters')
            :
            resolve(true)
        ;
    });
};
const isUserName=(toValid)=>{
    return new Promise((resolve,reject)=>{
        !rules.checkUserName.test(toValid)?
            resolve('username invalid , must be like the form [a-zA-Z][.|0-9|a-zA-Z]?@[a-zA-Z](.[a-zA-Z])? or just numbers')
            :
            resolve(true)
        ;
    });
};
const isPaymentId=(toValid)=>{
    return new Promise((resolve,reject)=>{
        !rules.checkPaymentId.test(toValid)?
           resolve("paymentId invalid")
           :
           resolve(true)
        ;
    });
};
const iSDescription=(toValid)=>{
    return new Promise((resolve,reject)=>{
        !rules.checkDescription.test(toValid)?
        resolve("description must be string and numbers and maximum 20,000 characters")
        :
        resolve(true)
        ;
    });
};
module.exports={
    iSDescription,
    isPaymentId,
    isUserName,
    isPassword,
    isSrting,
    isId,
    isPrice,
    isPhoneNumber,
    isOffer
};
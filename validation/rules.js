const checkSrting=/(^([a-zA-z](\s)?){1,200}$)|(^((أ|ب|ت|ث|ج|ح|خ|د|ذ|ر|ز|س|ش|ص|ض|ط|ظ|ع|غ|ف|ق|ك|ل|م|ن|ه|هـ|و|ي|ئ|ا|ء|ؤ|ى|ة)(\s)?){1,200}$)/;
const id=/^[0-9]{1,}$/;
const price=/^[0-9]{1,10}(\.[0-9]{1,6})?$/;
const offer=/^[0-9]{1,10}(\.[0-9]{1,6})?(%)?$/;
const checkPhoneNumber=/^[0-9]{6,25}$/;
const checkUserName=/(^[a-zA-Z]+[0-9|\.|a-zA-Z]*@[a-zA-Z]+(\.[a-zA-Z]+)*$)|(^[0-9]+$)/;
const checkPassword=/^([a-zA-Z0-9]|!|~|`|@|#|\$|%|\^|&|\*|\(|-|_|=|\+|\)|\]|\[|\}|\{|'|"|;|:|\/|\?|\.|\>|,|\<|\||\\){8,20}$/;
const checkPaymentId=/^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)+$/;
const checkDescription=/^(([a-zA-z0-9](\s)?(%)?(\s)?)|((ه|أ|ب|ت|ث|ج|ح|خ|د|ذ|ر|ز|س|ش|ص|ض|ط|ظ|ع|غ|ف|ق|ك|ل|م|ن|هـ|و|ي|ئ|ا|ء|ؤ|ى|ة|٠|١|٢|٣|٤|٥|٦|٧|٨|٩)(\s)?(%)?(\s)?)){0,20000}$/;

module.exports={
    id,
    price,
    offer,
    checkDescription,
    checkPaymentId,
    checkUserName,
    checkPassword,
    checkPhoneNumber,
    checkSrting,
};
const models=require('./callModel');

models.package.hasMany(models.customer,{onDelete:'CASCADE'});
models.customer.belongsTo(models.package,{foreignKey:'araPackageId'});

models.package.hasMany(models.package,{as:'packageParent',onDelete:'CASCADE'});
models.package.belongsTo(models.package);

models.package.hasMany(models.image,{onDelete:'CASCADE'});
models.image.belongsTo(models.package,{foreignKey:'araPackageId'});

models.city.hasMany(models.package,{onDelete:'CASCADE'});
models.package.belongsTo(models.city);

models.language.hasMany(models.package,{onDelete:'CASCADE'});
models.package.belongsTo(models.language);

models.admin.hasMany(models.language,{onDelete:'CASCADE'});
models.language.belongsTo(models.admin);

models.language.hasMany(models.hotel,{onDelete:'CASCADE'});
models.hotel.belongsTo(models.language);

models.language.hasMany(models.city,{onDelete:'CASCADE'});
models.city.belongsTo(models.language);

models.city.hasMany(models.city,{as:'cityParent',onDelete:'CASCADE'});
models.city.belongsTo(models.city);

models.city.hasMany(models.image,{onDelete:'CASCADE'});
models.image.belongsTo(models.city,{foreignKey:'araCityId'});

models.city.hasMany(models.hotel,{onDelete:'CASCADE'});
models.hotel.belongsTo(models.city);

models.hotel.hasMany(models.image,{onDelete:'CASCADE'});
models.image.belongsTo(models.hotel,{foreignKey:'araHotelId'});

models.hotel.hasMany(models.hotel,{as:'hotelParent',onDelete:'CASCADE'});
models.hotel.belongsTo(models.hotel);
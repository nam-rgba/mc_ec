const mongoose = require('mongoose');

const MONGODB_PASS = process.env.MONGODB_PASS;

const uri = `mongodb+srv://doanngocnam:${MONGODB_PASS}@rise.vhheesf.mongodb.net/?retryWrites=true&w=majority&appName=rise`

mongoose.connect(uri, {
}).then(() => {
    console.log('Connected to MongoDB');
}
).catch(err => console.log(err)
);

//dev
if(1===0){
    mongoose.set('debug', true);
    mongoose.set('debug',{color:true});
}

module.exports = mongoose;
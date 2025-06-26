const _ = require('lodash');

const getInfoData =(object, filed)=>{
    return _.pick(object,filed);
}

module.exports = {
    getInfoData
}
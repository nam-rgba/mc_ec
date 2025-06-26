const shopModel = require("../models/shop.model")

const findByEmail = async ({email, select ={
    email:1, password: 1, name: 1, active:1, role:1
}}) =>{
    return await shopModel.findOne({email}).select(select).lean()
}

module.exports = {findByEmail}
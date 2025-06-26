const {customer} =  require('../customer.model')

const findAllCustomerIf = async ({query, limit, skip}) =>{
    return await customer.find(query)
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

module.exports = {findAllCustomerIf}
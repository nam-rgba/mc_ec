const { product } = require("../product.model")


const findAllProductIf = async ({ query, limit, skip }) => {
    return await product.find(query)
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const searchByText = async (key) => {
    const regexSearch = new RegExp(key)
    const result = await product
        .find({$text: { $search: regexSearch }}, { score: { $meta: 'textScore' } })
        .sort( { score: { $meta: 'textScore' } })
        .lean()

    return result 
}


module.exports = { findAllProductIf, searchByText }
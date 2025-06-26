const inventory = require('../inventory.model')

const insert = async ({
    productId, shopId, location, stock
})=>{
    return await inventory.create({
        iv_productId: productId,
        iv_shopId: shopId,
        iv_location: location,
        iv_stock: stock,
    })
}

module.exports = {insert}
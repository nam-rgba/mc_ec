const { Schema, model } = require("mongoose")
const slugify = require('slugify')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'products'

var productSchema = new Schema({
    product_name: { type: String, require: true },
    product_thumb: { type: String, require: true },
    product_description: String,
    product_slug: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    product_price: { type: Number, require: true },
    product_quantity: { type: Number, require: true },
    product_type: { type: String, require: true, enum: ['rice'] },
    product_attributes: { type: Schema.Types.Mixed, require: true },
    product_variations :{type: Array, default:[]},
    isDraft: {type: Boolean, default: true, index: true, select: false},
    isPublished: {type: Boolean, default: false, index: true, select: false},
    product_code: {type: String, unique: true, require: true}
    
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

// Create index
productSchema.index({product_name: 'text', product_description:'text'})

// Document middleware run before save
productSchema.pre('save',function(next){
    this.product_slug=slugify(this.product_name,{lower: true})
    next()
})


// Food================================================
var riceSchema =  new Schema({
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    brand: {type: String, require: true},
    date: Number,
    com: {type: String, require: true}
},{
    collection: 'rice',
    timestamps: true
})



module.exports = {
    product : model(DOCUMENT_NAME, productSchema),
    rice : model('rice', riceSchema),
}
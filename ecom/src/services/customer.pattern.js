const { customer, SI, LE } = require('../models/customer.model');
const tags = require('../models/tag.model');
const { BadRequestError, NotFoundError } = require('../res/error.response')
const { findAllCustomerIf } = require('../models/repository/customer.repo')




class CustomerFactory {
    // object to store
    static customerTypeStrore = {};

    //add new type
    static addClassType(type, classRef) {
        CustomerFactory.customerTypeStrore[type] = classRef
    }

    // handleCreate
    static async createCustomer(type, payload) {
        const customerClass = CustomerFactory.customerTypeStrore[type]
        if (!customerClass) throw new BadRequestError('Invalid class')

        return new customerClass(payload).createCustomer()
    }



    // ------------------------------------------------------------------------------------
    // Handle Logic


    /* Set tag for one Customer */
    static async setTag({ tagId, cusId }) {
        const customerFound = await customer.findById(cusId)
        if (!customerFound) throw new NotFoundError('Not found Customer!')

        const tagFound = await tags.findById(tagId).lean()
        if (!tagFound) throw new NotFoundError('Not found tag!')


        customerFound.tag = tagFound
        await customerFound.save()

        return customerFound.toObject()
    }

    /* Remove tag from customer */
    static async unsetTag({ cusId }) {
        const customerFound = await customer.findById(cusId)
        if (!customerFound) throw new NotFoundError('Not found Customer!')
        
        customerFound.tag = {}
        await customerFound.save()
        return customerFound.toObject()
    }


    /* List customer by tag */
    static async findByTags({tagId}) {
        const tagFound = await tags.findById(tagId)
        if (!tagFound) throw new NotFoundError('Not found tag!')

        const query = {
            'tag._id': tagFound._id
        }
        return await findAllCustomerIf({
            query, limit: 20, skip: 0
        })
    }

    /* List all customer */
    static async findAllCustomer() {
        const query = {}

        return await findAllCustomerIf({
            query, limit: 20, skip: 0
        })
    }
}

class Customer {
    constructor({ name, phone, address, type, additional }) {
        this.name = name
        this.phone = phone
        this.address = address
        this.type = type
        this.additional = additional
    }

    async createCustomer(_id) {

        // check is phone used
        const customerFound = await customer.findOne({ phone: this.phone })
        if (customerFound) throw new BadRequestError('Phone is already userd')

        return await customer.create({
            ...this,
            _id: _id
        })
    }
}

class SIC extends Customer {
    async createCustomer() {
        const newSI = await SI.create({
            ...this.additional
        })
        if (!newSI) throw new BadRequestError('cannot create SI')

        const newCustomer = await super.createCustomer(newSI._id)
        if (!newCustomer) throw new BadRequestError('cannot create Customer')
    }
}

class LEC extends Customer {
    async createCustomer() {
        const newLE = await LE.create({
            ...this.additional
        })
        if (!newLE) throw new BadRequestError('cannot create LE')

        const newCustomer = await super.createCustomer(newLE._id)
        if (!newCustomer) throw new BadRequestError('cannot create Customer')
    }
}

CustomerFactory.addClassType('SI', SIC)
CustomerFactory.addClassType('LE', LEC)


module.exports = CustomerFactory;

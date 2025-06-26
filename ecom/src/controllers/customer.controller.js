const { SuccessResponse } = require('../res/success.response')
const CustomerService = require('../services/customer.pattern')

class CustomerController {
    // POST: create a customer
    addCustomer = async (req, res, next) =>{
        new SuccessResponse({
            message: 'Add new customer successgully',
            metadata: await CustomerService.createCustomer(req.body.type,{
                ...req.body
            }) 
        }).send(res)
    }


    // GET: List all customer
    getAllCustomer = async (req, res, next)=>{
        new SuccessResponse({
            message: "Here your",
            metadata: await CustomerService.findAllCustomer()
        }).send(res)
    }


    // PATCH: Set tag for customer
    setTag = async (req, res, next)=>{
        new SuccessResponse({
            message: "Set tag successfully",
            metadata: await CustomerService.setTag(req.body)
        }).send(res)
    }

    // PATCH: Unset tag from customer
    unsetTag = async(req, res, next) =>{
        new SuccessResponse ({
            message: "Remove tag Successfully!",
            metadata: await CustomerService.unsetTag(req.body)
        }).send(res)
    }

    // GET: Filt by tags
    listByTag = async (req, res, next) =>{
        new SuccessResponse({
            message: "List filtered by tag",
            metadata: await CustomerService.findByTags(req.body)
        }).send(res)
    }

}

module.exports = new CustomerController
const { SuccessResponse } = require("../res/success.response")
const TagServices = require('../services/tag.service')

class TagController {
    addNewTag = async (req, res, next) =>{
        new SuccessResponse ({
            message: "OK",
            metadata: await TagServices.addNewTag(req.body)
        }).send(res)
    }

}

module.exports = new TagController
const { SuccessResponse } = require("../res/success.response")
const NotificationService = require('../services/notification.service')

class NotificationController {
    getNotiByUser = async (req, res, next) =>{
        new SuccessResponse ({
            message: "Here what's new!",
            metadata: await NotificationService.getNotiByUser(req.body)
        }).send(res)
    }
}

module.exports = new NotificationController
const NOTI = require('../models/notification.model')
const noti_content = require('../constants/notification')


class NotificationService {
    static pushNotification = async ({ type, receiveId, option }) => {
        const newNoti = await NOTI.create({
            noti_type: type,
            noti_receiveId: receiveId,
            noti_option: option,
            noti_content: noti_content[type]
        })

        return newNoti
    }


    static getNotiByUser = async ({ userId, type }) => {
        const match = { noti_receiveId: userId }

        if (type != 'all') {
            match['noti_type'] = type
        }

        return await NOTI.aggregate([
            { $match: match },
            {
                $project: {
                    noti_type: 1,
                    noti_receiveId: 1,
                    noti_content: 1,
                    noti_option:1,
                    createAt: 1
                }
            }
        ])
    }
}

module.exports = NotificationService
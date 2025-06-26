

/** 
 * @ service: KeyTokenService
 * @ description: chỉ dành để khởi tạo một row trong bảng keyTokenModel
 * @ param: userId, publicKey
 * @ return: publicKeyString
 *  
 */

const keyTokenModel = require('../models/token.model');
const { Types: { ObjectId }, mongoose } = require('mongoose')
class KeyTokenService {
    /* 
        Khi người dùng login, chúng ta tạo 1 refresh token mới
    */
    static async createKeyToken({ userId, accessKey, refreshKey, refreshToken }) {


        try {

            const filter = { userId: userId },
                update = { accessKey, refreshKey, refreshToken },
                options = { new: true, upsert: true }


            const keysUpdated = await keyTokenModel.findOneAndUpdate(filter, update, options)

            return keysUpdated ? keysUpdated : null
        } catch (error) {
            console.error('Error in createKeyToken:', error);
            throw new Error('Cannot create key token');
        }
    }

    /* we need to authen user when they want to do something */
    static async findAccessKeyById(userId) {
        return  await keyTokenModel.findOne({ userId: new ObjectId(String(userId)) }).lean()
    }

    /* remove refresh token when user log out */
    static async removeKey(id) {
        console.log('here is remoce')
        return await keyTokenModel.deleteOne(id)
    }
}

module.exports = KeyTokenService;

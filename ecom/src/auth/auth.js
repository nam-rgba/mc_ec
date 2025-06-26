const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../res/error.response');
const { findAccessKeyById } = require('../services/token.service');

const HEADERS = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id'
}

const createTokenPair = (payload, accessKey, refreshKey) => {
    // public key as a string
    try {
        //create access token
        const accessToken = JWT.sign(payload, accessKey, { expiresIn: '1 days' });

        //create refresh token
        const refreshToken = JWT.sign(payload, refreshKey, { expiresIn: '7 days' });

        JWT.verify(accessToken, accessKey, (err, decoded) => {
            if (err) {
                console.error('Error in verify access token:', err);
            } 
        }
        );
        return { accessToken, refreshToken }
    } catch (error) {
        console.error('Error in createTokenPair:', error);
        throw new Error('Cannot create token pair');
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /* 
        Steps: 
        1. check user id
        2. get accesstoken
        3. check user in dbs
        4. check key store
        5. verify token
        6. return
    */
    // 1.--------------------------------------------------
    const userId = req.headers[HEADERS.CLIENT_ID]
    // console.log('auth.js/authentication/ userId:', userId)
    // if (!userId) throw new AuthFailureError('Invalid Request')

    // 2.-----------------------------------------------------
    const accessToken = req.headers[HEADERS.AUTHORIZATION]
    // console.log('auth.js/authentication/ accesstoken:', accessToken)
    if (!accessToken) throw new AuthFailureError('Invalid Request')

    // 3.--------------------------------------------------------
    /* get access key first */
    const row = await findAccessKeyById(userId )
    if (!row) throw new NotFoundError('This session have been cracked or time out, please loggin again')
    try {
        const decoded =  JWT.verify(accessToken, row.accessKey)
        if(userId!=decoded.userId.toString()) throw new AuthFailureError('Invalid User')
        req.keyStore = row
        return next()
    } catch (error) {
        throw error
    }
})

module.exports = {
    createTokenPair,
    authentication
}
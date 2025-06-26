/**
 * @service AccessService
 * @description: Dùng để xử lý logic liên quan đến việc đăng ký tài khoản
 */


const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// import models
const shop = require('../models/shop.model');

// import services
const KeyTokenService = require('./token.service');
const { findByEmail } = require('./shop.service')

// import middleware and helper
const { createTokenPair } = require('../auth/auth');
const { getInfoData } = require('../utils/index');
const { BadRequestError, AuthFailureError } = require('../res/error.response');

const Roles = {
    SHOP: '000S1',//SHOP
    WRITER: '000S2',//WRITER
    EDITOR: '000S3',//EDITOR
    ADMIN: '000S4',//ADMIN
}

class AccessService {

    // Sign In function -----------------------------------------------------------
    /*
        Steps:
        1. Check email in the database
        2. password matching
        3. create a pair of key
        4. generate a new refresh token and access token
        5 return
    */
    static signin = async ({ email, password, refreshToken }) => {
        // step 1: check email
        const foundShop = await findByEmail({ email })
        // console.log(foundShop)
        if (!foundShop) throw new BadRequestError('No shop found!')

        // step 2: check password match
        const isPasswordMatch = await bcrypt.compare(password, foundShop.password)
        if (!isPasswordMatch) throw new AuthFailureError('Authenticated error!')

        // step 3: generate pair of key     
        const accessKey = crypto.randomBytes(32).toString('hex');
        const refreshKey = crypto.randomBytes(32).toString('hex');

        // step 4: tokens
        // destructuring
        const { _id: userId } = foundShop

        const tokens = createTokenPair({ userId, email }, accessKey, refreshKey)

        await KeyTokenService.createKeyToken({
            userId,
            accessKey,
            refreshKey,
            refreshToken: tokens.refreshToken
        })

        // step 5: return
        return {
            shop: getInfoData(foundShop, ['_id', 'email', 'name']),
            tokens
        }
    }

    // Sign Up function ----------------------------------------------------------- 
    static signup = async ({ name, email, password }) => {
        try {
            // Step 1: find email
            const emailholder = await shop.findOne({ email: email }).lean();
            if (emailholder) {
                throw new BadRequestError('Email already exists');
            }
            // Step 2:  create new shop
            const hashPassword = bcrypt.hashSync(password, 10);
            const newShop = await shop.create({
                name, email, password: hashPassword, role: Roles.SHOP
            });
            /* ------------------------------------------------------------------------------------------- */
            // Step 3:  if create shop success
            if (newShop) {
                /* 
                *create a row in the keyTokenModel table
                * with the userId, accessKey and refreshKey
                */
                // generate pair of key
                const accessKey = crypto.randomBytes(32).toString('hex');
                const refreshKey = crypto.randomBytes(32).toString('hex');

                // Step 4: if crea  te successfully, then create a token pair (access token and refresh token)
                const tokens = createTokenPair({
                    userId: newShop._id,
                    email
                }, accessKey, refreshKey);
                // console.log('Crated token pair:', tokens);

                if (!tokens) {
                    return {
                        code: 'xxxx',
                        message: 'There was a problem creating the token pair',
                    }
                }


                const DBKEY = KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    accessKey,
                    refreshKey,
                    refreshToken: tokens.refreshToken
                })
                // if create fail
                if (!DBKEY) {
                    return {
                        code: 'xxxx',
                        message: 'There was a problem creating the key',
                    }
                }

                return {
                    code: 201,
                    message: 'Signup successfully',
                    status: 'success',
                    metadata: {
                        shop: getInfoData(newShop, ['name', 'email', '_id']),
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken,

                    }
                }
            }
            return {
                code: 200,
                metadata: null
            }

        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }

    /* Logout function */
    static signout = async(keyStore) =>{


        // console.log('sigout:',keyStore)
        const abandon = await KeyTokenService.removeKey(keyStore._id)
        return abandon

        
    }
}

module.exports = AccessService;
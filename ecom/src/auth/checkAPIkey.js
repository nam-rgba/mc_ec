const { findBykey } = require('../services/apikey.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

//middleware to check the API key
const apiKey = async (req, res, next) => {
    try {
        // check if the key in the header?
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) return res.status(403).json({
            message: 'Forbidden error'
        })

        // check if the key in the database?
        const apikey = await findBykey(key);
        if (!apikey) return res.status(403).json({
            message: 'Forbidden error'
        })

        req.apikey = apikey;
        return next();

    } catch (error) {
        console.error('Error in apiKey:', error);
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}

// check permission
const checkPermission = (permission) => (req, res, next) => {
    try {
        // check if the permission in the apikey?
        const apikey = req.apikey
        if (!apikey.permission.includes(permission)) return res.status(403).json({
            message: 'Forbidden error: permission denied'
        })

        return next();
    } catch (error) {
        console.error('Error in checkPermission:', error);
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}

module.exports = { apiKey, checkPermission };
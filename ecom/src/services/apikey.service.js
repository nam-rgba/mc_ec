const Apikey = require('../models/apikey.model');
const crypto = require('crypto');

const findBykey = async (key) => {

    try {
        const apikey = await Apikey.findOne({
            key, status: true
        }).lean();
        return apikey;
    } catch (error) {
        console.error('Error in findBykey:', error);
        throw new Error(error);
    }
}

module.exports = {
    findBykey};
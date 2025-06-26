const express = require('express');
const router = express.Router();
const { apiKey, checkPermission } = require('../auth/checkAPIkey');
const {pushToLogServer} = require('../middlewares/index')


// send log to discord server
router.use(pushToLogServer)
// middleware to check the API key
router.use(apiKey);
//midelware to check the permission
router.use(checkPermission('0000'));


// routes for the access controller
router.use('/v1/api', require('./access'));
router.use('/v1/api/tag', require('./tag'))
router.use('/v1/api/product', require('./product'));
router.use('/v1/api/customer', require('./customer'))
router.use('/v1/api/notification', require('./notification'))


module.exports = router;
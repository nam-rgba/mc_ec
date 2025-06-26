const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const NotificationController = require('../../controllers/notification.controller')

router.get('', asyncHandler(NotificationController.getNotiByUser))
module.exports = router
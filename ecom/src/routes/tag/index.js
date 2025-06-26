const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const TagController = require('../../controllers/tag.controller')

router.post('', asyncHandler(TagController.addNewTag))
module.exports = router
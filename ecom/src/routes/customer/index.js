const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const CustomerController = require('../../controllers/customer.controller')

router.post('', asyncHandler(CustomerController.addCustomer))
router.get('',asyncHandler(CustomerController.getAllCustomer))
router.patch('/settag',asyncHandler(CustomerController.setTag))
router.patch('/unsettag',asyncHandler(CustomerController.unsetTag))
router.get('/listbytag', asyncHandler(CustomerController.listByTag))
module.exports = router
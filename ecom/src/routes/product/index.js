const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router();
const {asyncHandler} = require('../../helpers/asyncHandler');


router.get('/search/:key', asyncHandler(productController.searchProduct))



/* Authentication */
// router.use(authentication)

router.post('', asyncHandler(productController.createProduct))
router.get('/all', asyncHandler(productController.getDataAllProduct))
module.exports = router;

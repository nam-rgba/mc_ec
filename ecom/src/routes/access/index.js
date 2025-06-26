const express = require('express');
const accessController = require('../../controllers/access.controller');
const router = express.Router();
const {asyncHandler} = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/auth');


router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/signin', asyncHandler(accessController.signin));

/* Authentication */
router.use(authentication)

router.post('/shop/signout', asyncHandler(accessController.signout))
module.exports = router;

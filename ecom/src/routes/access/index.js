const express = require('express');
const accessController = require('../../controllers/access.controller');
const router = express.Router();
const {asyncHandler} = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/auth');


router.post('/user/signup', asyncHandler(accessController.signUp));
router.post('/user/signin', asyncHandler(accessController.signin));

/* Authentication */
router.use(authentication)

router.post('/user/signout', asyncHandler(accessController.signout))
module.exports = router;

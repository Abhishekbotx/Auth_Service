const express = require('express');

const UserController = require('../../controllers/user-controller');
const {AuthRequestValidators} = require('../../middlewares/index');

const router = express.Router();

router.post(
    '/signup', 
    AuthRequestValidators.validateUserAuth,
    UserController.createUser
);
router.post(
    '/signin',
    AuthRequestValidators.validateUserAuth,
    UserController.signin
);

router.get(
    '/isAuthenticated',
    UserController.isAuthenticated
);

router.get(
    '/isAdmin',
    AuthRequestValidators.validateIsAdminRequest,
    UserController.isAdmin
);

router.post(
    '/addEmployee', 
    AuthRequestValidators.validateUserAuth,
    UserController.createUser
);
router.post(
    '/generateOtp', 
    
    UserController.generateOtp
);
router.post(
    '/resetPassword', 
    
    UserController.resetPassword
);


module.exports = router;
const { Router } = require('express');
const router = new Router();
const authController = require('../controllers/api/authController'); 

router.post('/login', authController.handleUserLogin);
router.post('/manager-access', authController.handleAdminLogin);
router.post('/register', authController.handleRegistration);
router.post('/logout', authController.handleLogout);

module.exports = router;
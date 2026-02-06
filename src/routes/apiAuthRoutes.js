const { Router } = require('express');
const router = new Router();
const authController = require('../controllers/api/authController'); 
router.post('/login', authController.handleLogin);
router.post('/register', authController.handleRegistration);
router.post('/logout', authController.handleLogout);
router.post('/refresh', authController.handleRefresh);

module.exports = router;
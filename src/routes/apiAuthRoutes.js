const { Router } = require('express');
const router = new Router();
const authController = require('../controllers/api/authController'); 

const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validations/authValidation');

router.post('/register', validate(registerSchema), authController.handleRegistration);

router.post('/login', validate(loginSchema), authController.handleUserLogin);
router.post('/admin/login', validate(loginSchema), authController.handleAdminLogin);

router.post('/logout', authController.handleLogout);

module.exports = router;
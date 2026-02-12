const { Router } = require('express');
const router = new Router();

const authViewCtrl = require('../controllers/view/authViewController'); 
const checkAuth = require('../middleware/authMiddleware'); 

router.get('/login', authViewCtrl.showLogin); 
router.get('/admin_login', authViewCtrl.showAdminLogin); 

router.get('/register', authViewCtrl.showRegister);
router.get('/error403', authViewCtrl.showError403);

router.get('/admin/dashboard', checkAuth('ADMIN'), authViewCtrl.showDashboard);
module.exports = router;
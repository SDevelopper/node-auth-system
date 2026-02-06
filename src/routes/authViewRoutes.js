const { Router } = require('express');
const router = new Router();

const authViewCtrl = require('../controllers/view/authViewController'); 

router.get('/login', authViewCtrl.showLogin); 
router.get('/register', authViewCtrl.showRegister);

module.exports = router;
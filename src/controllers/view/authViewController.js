const path = require('path');
const getHtmlPath = (file) => path.join(process.cwd(), 'public', file);

exports.showLogin = (req, res) => {
    res.sendFile(getHtmlPath('login.html'));
};


exports.showAdminLogin = (req, res) => {
    res.sendFile(getHtmlPath('admin_login.html'));
};

exports.showRegister = (req, res) => {
    res.sendFile(getHtmlPath('register.html'));
};

exports.showError403 = (req, res) => {
    res.status(403).render('error403',  { user: req.user }); 
};

exports.showDashboard = (req, res) => {
    res.render('admin/dashboard', { user: req.user });
};

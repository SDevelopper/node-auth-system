const path = require('path');
const getHtmlPath = (file) => path.join(process.cwd(), 'public', file);

exports.showLogin = (req, res) => {
    res.sendFile(getHtmlPath('login.html'));
};

exports.showRegister = (req, res) => {
    res.sendFile(getHtmlPath('register.html'));
};

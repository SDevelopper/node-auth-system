const express = require('express');
const path = require('path');

const cookieParser = require('cookie-parser');
const app = express();


app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

const authViewRoutes = require('./routes/authViewRoutes');
const apiRoutes = require('./routes/apiAuthRoutes');
const globalErrorHandler = require('./middleware/globalErrorHandler');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use(cookieParser());

app.use('/', authViewRoutes);
app.use('/api/auth', apiRoutes);

app.use(globalErrorHandler);
module.exports = app;
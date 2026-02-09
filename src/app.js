const express = require('express');
const path = require('path');
const app = express();


const authViewRoutes = require('./routes/authViewRoutes');
const apiRoutes = require('./routes/apiAuthRoutes');
const globalErrorHandler = require('./middleware/globalErrorHandler');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));


app.use('/', authViewRoutes);
app.use('/api/auth', apiRoutes);

app.use(globalErrorHandler);
module.exports = app;
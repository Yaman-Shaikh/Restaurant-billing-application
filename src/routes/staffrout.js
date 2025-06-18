const express = require("express");
const app = express.Router();
const dashboardController = require("../controller/staffcont");
app.get('/', dashboardController.getDashboardData);

app.get('/dashboard', (req, res) => res.render('staff/staffdashboard'));
app.get('/tables', (req, res) => res.render('staff/tables'));
app.get('/menus', (req, res) => res.render('staff/menus'));
app.get('/orders', (req, res) => res.render('staff/orders'));
app.get('/reports', (req, res) => res.render('staff/reports'));

module.exports = app;


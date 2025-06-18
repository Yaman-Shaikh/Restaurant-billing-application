const express = require("express");
const app = express.Router();
const dashboardController = require("../controller/staffcont");
app.get('/', dashboardController.getDashboardData);

app.get('/dashboard', (req, res) => res.render('staffdashboard'));
app.get('/tables', (req, res) => res.render('tables'));
app.get('/menus', (req, res) => res.render('menus'));
app.get('/orders', (req, res) => res.render('orders'));
app.get('/reports', (req, res) => res.render('reports'));

module.exports = app;


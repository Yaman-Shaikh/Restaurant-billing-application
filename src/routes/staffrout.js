const express = require("express");
const app= express.Router(); // ✅ Use router
const staffController = require("../controller/staffcont"); // ✅ Correct controller

// Dashboard
app.get('/', staffController.getDashboardData);
app.get('/dashboard', staffController.getDashboardData);

// ✅ Dynamic tables with data
app.get('/tables', staffController.getTablesPage);
app.get('/menus', staffController.getMenusPage);
// Static pages
//app.get('/menus', (req, res) => res.render('staff/menus'));
app.get('/orders', (req, res) => res.render('staff/orders'));
app.get('/reports', (req, res) => res.render('staff/reports'));

module.exports = app;

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

app.get('/reports', (req, res) => res.render('staff/reports'));




app.get("/staffdashboard", staffController.getStaffDashboard);
app.post('/save-order', staffController.saveOrder);
app.get('/orders', staffController.getAllOrders);

app.get('/orders/:id/bill', staffController.viewBill);
app.get('/orders/:id/bill/pdf', staffController.downloadBillPDF);


app.get('/ViewBills', staffController.viewBills);

module.exports = app;

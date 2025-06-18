const db = require("../config/db");

exports.getDashboardData = (req, res) => {
const queries = {
  categories: "SELECT COUNT(*) AS count FROM category",
  menus: "SELECT COUNT(*) AS count FROM menu",
  tables: "SELECT COUNT(*) AS count FROM dinning_table",
  availableTables: "SELECT COUNT(*) AS count FROM dinning_table WHERE availability_status = 'Available'",
  occupiedTables: "SELECT COUNT(*) AS count FROM dinning_table WHERE availability_status = 'Occupied'",
  orders: "SELECT COUNT(*) AS count FROM order_master",
  completedOrders: "SELECT COUNT(*) AS count FROM order_master WHERE ord_status = 'Completed'",
  pendingOrders: "SELECT COUNT(*) AS count FROM order_master WHERE ord_status = 'Pending'"
};


  const sql = `
    ${queries.categories};
    ${queries.menus};
    ${queries.tables};
    ${queries.availableTables};
    ${queries.occupiedTables};
    ${queries.orders};
    ${queries.completedOrders};
    ${queries.pendingOrders};
  `;
db.query(sql, (err, results) => {
  if (err) {
    console.error("DB error:", err);
    return res.status(500).send("Database error");
  }

  res.render("staff/staffdashboard", {
    totalCategories: results[0][0].count,
    totalMenus: results[1][0].count,
    totalTables: results[2][0].count,
    availableTables: results[3][0].count,
    occupiedTables: results[4][0].count,
    totalOrders: results[5][0].count,
    completedOrders: results[6][0].count,
    pendingOrders: results[7][0].count
  });
});
}




exports.getTablesPage = (req, res) => {
  const query = "SELECT * FROM dinning_table";
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).send("Error fetching tables");
    }

    res.render("staff/tables", { tables: results }); // pass table data to view
  });
};
exports.getMenusPage = (req, res) => {
  const tableId = req.query.table_id;

  const menuQuery = "SELECT * FROM menu";
  db.query(menuQuery, (err, menus) => {
    if (err) {
      console.error("Error loading menus:", err);
      return res.status(500).send("Menu load error");
    }

    res.render("staff/menu", {
      tableId,
      menus,
      currentDate: new Date().toLocaleDateString()
    });
  });
};

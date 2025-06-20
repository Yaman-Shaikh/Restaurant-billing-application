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
exports.getStaffDashboard = (req, res) => {
  const query = "SELECT * FROM staff";

  db.query(query, (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).send("Error fetching staff data");
    }

    res.render("StaffDashBord.ejs"); // ← This must exist and be spelled correctly
  });
}

exports.saveOrder = (req, res) => {
  console.log("Incoming order data:", req.body);

  const { tableId, staffId, date, items } = req.body;

  const total_amt = items.reduce((sum, item) => sum + item.total, 0);

  const orderData = {
    table_id: tableId,
    staff_id: staffId,
    ord_date: date,
    total_amt,
    ord_status: "Pending"
  };

  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting DB connection:", err);
      return res.status(500).send("Database error");
    }

    // 1. Insert into order_master
    const insertOrder = "INSERT INTO order_master SET ?";
    connection.query(insertOrder, orderData, (err, result) => {
      if (err) {
        connection.release();
        console.error("Error inserting into order_master:", err);
        return res.status(500).send("Failed to create order");
      }

      const order_id = result.insertId;

      // 2. Prepare and insert items
      const insertItems = `
        INSERT INTO order_items (order_id, item_name, item_price, quantity, total)
        VALUES ?
      `;
      const values = items.map(item => [
        order_id,
        item.name,
        item.price,
        item.quantity,
        item.total
      ]);

      connection.query(insertItems, [values], (err2) => {
        connection.release();
        if (err2) {
          console.error("Error inserting order items:", err2);
          return res.status(500).send("Failed to save order items");
        }

        res.json({ message: "Order stored" });
      });
    });
  });
};




exports.getTables = (req, res) => {
  const query = 'SELECT * FROM tables';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching tables:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
};


exports.getAllOrders = (req, res) => {
  const ordersQuery = `
    SELECT om.order_id, om.table_id, om.staff_id, s.name AS staff_name,
           om.ord_date, om.ord_status
    FROM order_master om
    JOIN staff s ON om.staff_id = s.staff_id
    ORDER BY om.order_id DESC
  `;

  db.query(ordersQuery, (err, orders) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).send('Error fetching orders');
    }

    const orderIds = orders.map(o => o.order_id);
    if (orderIds.length === 0) {
      return res.render('staff/order_list', { orders: [], itemsByOrder: {} });
    }

    const placeholders = orderIds.map(() => '?').join(',');
    const itemsQuery = `
      SELECT * FROM order_items WHERE order_id IN (${placeholders})
    `;

    db.query(itemsQuery, orderIds, (err, items) => {
      if (err) {
        console.error('Error fetching items:', err);
        return res.status(500).send('Error fetching items');
      }

      // Group items by order_id
      const itemsByOrder = {};
      items.forEach(item => {
        if (!itemsByOrder[item.order_id]) {
          itemsByOrder[item.order_id] = [];
        }
        itemsByOrder[item.order_id].push(item);
      });

      res.render('staff/order_list', { orders, itemsByOrder });
    });
  });
};



exports.getBillView = (req, res) => {
  const orderId = req.params.id;

  const orderQuery = `
    SELECT om.*, s.name AS staff_name, t.table_no
    FROM order_master om
    JOIN staff s ON om.staff_id = s.staff_id
    JOIN dinning_table t ON om.table_id = t.table_id
    WHERE om.order_id = ?
  `;
  const itemsQuery = `
    SELECT * FROM order_items WHERE order_id = ?
  `;

  db.query(orderQuery, [orderId], (err, orderResults) => {
    if (err || orderResults.length === 0) {
      console.error(err);
      return res.status(500).send("Order not found");
    }

    const order = orderResults[0];
    db.query(itemsQuery, [orderId], (err2, itemsResults) => {
      if (err2) {
        console.error(err2);
        return res.status(500).send("Items not found");
      }

      const gst = (order.total_amt * 0.07).toFixed(2); // 7% GST
      const discounted = (order.total_amt * 0.05).toFixed(2); // 5% discount
      const grandTotal = order.total_amt - discounted + 2 * gst;

      res.render("staff/bill", {
        order,
        items: itemsResults,
        gst,
        discounted,
        grandTotal: grandTotal.toFixed(2),
        currentTime: new Date()
      });
    });
  });
};



const ejs = require('ejs');
const path = require('path');
const pdf = require('html-pdf');

exports.viewBill = async (req, res) => {
  const orderId = req.params.id;

  try {
    // Get order details with table_id and ord_status
    const [orderResults] = await db.promise().execute(`
      SELECT om.order_id, om.table_id, om.total_amt, om.ord_status, om.ord_date 
      FROM order_master om 
      WHERE om.order_id = ?
    `, [orderId]);

    if (orderResults.length === 0) {
      return res.status(404).send("Order not found");
    }

    const order = orderResults[0];

    // Get items for that order
    const [itemResults] = await db.promise().execute(`
      SELECT item_name, item_price, quantity, total 
      FROM order_items 
      WHERE order_id = ?
    `, [orderId]);

    res.render("bill", {
      order,
      items: itemResults
    });

  } catch (err) {
    console.error("View Bill Error:", err);
    res.status(500).send("Server error");
  }
};
exports.downloadBillPDF = async (req, res) => {
  const orderId = req.params.id;

  try {
    const [orderRows] = await db.promise().execute(
      'SELECT * FROM order_master WHERE order_id = ?',
      [orderId]
    );

    if (orderRows.length === 0) return res.status(404).send('Order not found');

    const order = orderRows[0];

    const [items] = await db.promise().execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );
const filePath = path.join(__dirname, '../../views/bill.ejs');


    ejs.renderFile(filePath, { order, items }, (err, html) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error generating bill');
      }

      const options = {
        format: 'A4',
        orientation: 'portrait',
        border: '10mm'
      };

      pdf.create(html, options).toStream((err, stream) => {
        if (err) return res.status(500).send('Error generating PDF');
        res.setHeader('Content-disposition', `attachment; filename=bill-${orderId}.pdf`);
        res.setHeader('Content-type', 'application/pdf');
        stream.pipe(res);
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

exports.viewBills = async (req, res) => {
  try {
    const [orders] = await db.promise().query(`
      SELECT om.*, s.name 
      FROM order_master om
      JOIN staff s ON om.staff_id = s.staff_id
      
      ORDER BY om.order_id DESC
    `);
console.log(orders);
    // For each order, fetch items
    for (let order of orders) {
      const [items] = await db.promise().query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.order_id]
      );
      order.items = items;
    }

    res.render('ViewBills', { orders });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

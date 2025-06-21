const e = require("express");
let conn=require("../config/db.js");
exports.log = (username, password) => {
    return new Promise((resolve, reject) => {
        if (username === "admin") {
        conn.query("SELECT * FROM users WHERE username = ? AND password = ?",[username, password],(err, result) =>{
                    if (err) return reject(err);
                    resolve({ result, role: "admin" });
                }
            );
        } else {
            conn.query(
                "SELECT * FROM staff WHERE name = ? AND password = ?",
                [username, password],
                (err, result) => {
                    if (err) return reject(err);
                    resolve({ result, role: "staff" });
                }
            );
        }
    });
};



exports.searchMenuByName = (name, callback) => {
    const sql = `
        SELECT menu.*, category.name AS category_name
    FROM menu 
    JOIN category ON menu.category_id = category.id 
    WHERE item_name LIKE ?
    `;

    conn.query(sql, [`%${name}%`], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};


exports.addcatagory=(categoryName)=>{
    let flag=true;
    conn.query("insert into category values(0,?)",[categoryName],(err,result)=>{
        if(err){
            flag=false;
            console.log(err);
        }
        else{
            flag=true;
        
        }
    });return flag;
}

exports.ViewCatagory=(callback)=>{
    
    conn.query("select * from category",(err,result)=>{
        if(err)
        {   
            callback(err,null);
        }
        else{
            callback(null,result);
        }
       
    });

};
exports.UpdateCategory=(id,callback)=>{
    conn.query("select * from category where id=?",[id],(err,result)=>{
       if(err)
       {
        return callback(err,null);
       }
       else{
        return callback(null,result);
       }
    });
}   
exports.updatecategory = (name, id, callback) => {
    conn.query("UPDATE category SET name=? WHERE id=?", [name, id], (err, result) => {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    });
};


exports.DeleteCategory=(id,callback)=>{
    
    conn.query("delete from category where id=?",[id],(err,result)=>{
        if(err)
        {   
            callback(err,null);
        }
        else{
            callback(null,result);
        }
    });
}

exports.Search=(name,callback)=>{

    let sql="select * from category where name like '%"+name+"%'";
    conn.query(sql,(err,result)=>{
        if(err)
            {
                callback(err,null);
            }    
            else{
                callback(null,result);
            }
    });
}


exports.getCategories = (callback) => {
    conn.query("SELECT  id ,name FROM category", (err,result)=>{
        if(err)
        {   
            callback(err,null);
        }
        else{
            callback(null,result);
        }
       
    });
};


exports.AddMenu = (name, price, category_id, description, image, callback) => {
    conn.query(
        "INSERT INTO menu (item_name, price, category_id, description, image) VALUES (?, ?, ?, ?, ?)",
        [name, price, category_id, description, image],
        (err, result) => {
            if (err) return callback(err, null);
            return callback(null, result);
        }
    );
};

exports.ViewMenu = (callback) => {
    conn.query("SELECT m.id, m.item_name, m.price, c.name AS category_name, m.description, m.image FROM menu m JOIN category c ON m.category_id = c.id", (err, result) => {
        if (err) {
            console.error("View Menu Error:", err);
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    });
};

exports.SearchAjax = (sname, callback) => {
    let sql = "SELECT m.id, m.item_name, m.price, c.name AS category_name, m.description, m.image FROM menu m JOIN category c ON m.category_id = c.id WHERE m.item_name LIKE ?";
    conn.query(sql, [`%${sname}%`], (err, result) => {
        if (err) {
            console.error("Search Ajax Error:", err);
            
            return callback(err, null);
        } else {
            console.log("Search Result:", result);
            return callback(null, result);
        }
    });
}
exports.SearchStaff = (sname, callback) => {
    const searchPattern = `%${sname}%`;
    const sql = "SELECT * FROM staff WHERE name LIKE ? or email LIKE ? or contact_no LIKE ? or salary LIKE ? or password LIKE ?";
   conn.query(sql, [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern], (err, result) => {
        if (err) {
            console.error("Search Staff Error:", err);
            return callback(err, null);
        }
        console.log("Search Staff Result:", result);
        callback(null, result);
});
};

exports.SearchTable = (sname, callback) => {
    const searchPattern = `%${sname}%`;
    const sql = "SELECT * FROM dinning_table WHERE table_id LIKE ? or capacity LIKE ? or availability_status LIKE ?";
    conn.query(sql, [searchPattern, searchPattern, searchPattern], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};


exports.getAllCategories = (callback) => {
    conn.query("SELECT name FROM category", (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result); 
    });
};
exports.getMenuItemById = (id, callback) => {
    const sql = "SELECT * FROM menu WHERE id = ?";
    conn.query(sql, [id], callback);
};

exports.DeleteMenu = (id, callback) => {
    const sql = "DELETE FROM menu WHERE id = ?";
    conn.query(sql, [id], (err, result) => {
        if (err) return callback(err, null);
        return callback(null, result);
    });
};


exports.updateMenu = (data, callback) => {
    const { id, name, category, description, price, image } = data;
    let sql, params;

    if (image) {
        sql = "UPDATE menu SET item_name=?, category_id=?, description=?, price=?, image=? WHERE id=?";
        params = [name, category, description, price, image, id];
    } else {
        sql = "UPDATE menu SET item_name=?, category_id=?, description=?, price=? WHERE id=?";
        params = [name, category, description, price, id];
    }

    conn.query(sql, params, (err, result) => {
        if (err) {
            console.error("Error in updateMenu:", err);
            return callback(err);
        }
        return callback(null, result);
    });
};



// exports.updateMenu = (id, name, price, category_id, description, image, callback) => {
//     const sql = "UPDATE menu SET item_name = ?, price = ?, category_id = ?, description = ?, image = ? WHERE id = ?";
//     conn.query(sql, [name, price, category_id, description, image, id], (err, result) => {
//         if (err) return callback(err, null);
//         return callback(null, result);
//     });
// };

exports.AddStaff = (name, email, contact_no, salary, password) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO staff (name, email, contact_no, salary, password) VALUES (?, ?, ?, ?, ?)";
        conn.query(sql, [name, email, contact_no, salary, password], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};



exports.ViewStaff=(callback)=>{
    conn.query("select * from staff",(err,result)=>{
        if(err)
        {   
            callback(err,null);
        }
        else{
            callback(null,result);
        }
       
    });
}

exports.GetStaffById = (id, callback) => {
    conn.query("SELECT * FROM staff WHERE staff_id = ?", [id], (err, result) => {
        callback(err, result);
    });
};

exports.UpdateStaff = (id, name, email, contact_no, salary, password, callback) => {
    const sql = `
        UPDATE staff SET name = ?, email = ?, contact_no = ?, salary = ?, password = ?
        WHERE staff_id = ?
    `;
    conn.query(sql, [name, email, contact_no, salary, password, id], callback);
};

exports.DeleteStaff = (id, callback) => {
    conn.query("DELETE FROM staff WHERE staff_id = ?", [id], callback);
};


exports.AddTable = (tableNumber, capacity, availability) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO dinning_table (table_id, capacity, availability_status) VALUES (?, ?, ?)";
        conn.query(sql, [tableNumber, capacity, availability], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.affectedRows); 
            }
        });
    });
};


exports.ViewTables=(callback)=>{
    conn.query("select * from dinning_table",(err,result)=>{
        callback(err, result);
    });
}

exports.UpdateTable = (id, callback) => {
    conn.query("SELECT * FROM dinning_table WHERE table_id = ?", [id], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};


exports.updatetable = (id, capacity, availability_status, callback) => {
    const sql = "UPDATE dinning_table SET capacity = ?, availability_status = ? WHERE table_id = ?";
    conn.query(sql, [capacity, availability_status, id], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};


exports.DeleteTable = (id, callback) => {
    const sql = "DELETE FROM dinning_table WHERE table_id = ?";
    conn.query(sql, [id], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};
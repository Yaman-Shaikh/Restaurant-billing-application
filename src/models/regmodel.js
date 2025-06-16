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

// Example: get all categories
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
// exports.AddMenu = (name, price, category, description, image, callback) => {
//     conn.query(
//         "INSERT INTO menu (item_name, category_id,price,  description, image) VALUES (?, ?, ?, ?, ?)",
//         [name, price, category, description, image],
//         (err, result) => {
//             if (err) {
//                 console.error("Insert Error:", err);
//                 return callback(err, null);
//             } else {
//                 return callback(null, result);
//             }
//         }
//     );
// };

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
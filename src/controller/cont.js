let regservice=require("../services/regservices.js");
let model=require("../models/regmodel.js");
let session =require("express-session");
const upload = require("../middlewares/uplode.js");


exports.homepage=(req,res)=>{
    res.render("home.ejs");
}
exports.loginpage=(req,res)=>{
    res.render("login.ejs",{msg:""});
}
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const { result, role } = await model.log(username, password);
        console.log("user name ",username);
        console.log("password ",password);
        console.log("Query result ",result);

        if (result.length === 0) {
            return res.redirect("/register");
        }

        const userId = result[0].id || result[0].staff_id;

        // Set session
        req.session.userid = userId;

        // Set a cookie
        res.cookie("user_id", userId, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: false, // set to true if using HTTPS
        });

        // Set dashboard view
        const dashboard = role === "admin" ? "AdminDashBord" : "StaffDashBord";
        res.render(dashboard, { user: result[0] });

    } catch (err) {
        console.error("Login error:", err);
        res.render("error", { error: "Internal Server Error" });
    }
};
exports.register=(req,res)=>{
    res.render("login.ejs",{msg:"invalid username or password"});
}
 
exports.homepage1=(req,res)=>{
    res.render("homepage.ejs");
}
exports.About=(req,res)=>{
    res.render("AboutUs.ejs");
}
exports.Menu=(req,res)=>{
    res.render("Menu.ejs");
}
exports.Gallery=(req,res)=>{
    res.render("Gallery.ejs")
}

exports.Contact=(req,res)=>{ 
    res.render("Contact.ejs");
}
exports.AdCatagory=(req,res)=>{
   res.render("addcategory.ejs",{msg:" "});
}

exports.addcatagory=(req,res)=>{
    let{categoryName}=req.body;
    let result=model
    .addcatagory(categoryName);
    if(result==true)
    {
        res.render("addcategory.ejs",{msg:"category add successfully"});
    }
    else{
        res.render("addcategory.ejs",{msg:"category not added ........................"});
    }
}
exports.ViewCatagory=(req,res)=>{
   model.ViewCatagory((err,result)=>{
    if(err)
    {
        res.render("ViewCategory.ejs",{data:[]});
    }
    else{
        res.render("ViewCategory.ejs",{data:result});

    }
   });

}
exports.UpdateCategory=(req,res)=>{
    let {id}=req.query;
    model.UpdateCategory(id,(err,result)=>{
        if(err)
        {
            return res.send("database error");
        }   
        if(result.length==0)
        {
            return res.send("category not found");
        }
        res.render("UpdateCategory.ejs",{record:result[0],msg:" "});
    });
}
exports.updatecategory = (req, res) => {
    let { name, id } = req.body;

    model.updatecategory(name, id, (err, result) => {
        if (err) {
           
            model.UpdateCategory(id, (err2, result2) => {
                return res.render("ViewCategory.ejs", {
                    data: result2,
                });
            });
        } else {
            model.UpdateCategory(id, (err2, result2) => {
                return res.render("ViewCategory.ejs", {
                    data: result2,
                   
                });
            });
        }
    });
};


exports.DeleteCategory=(req,res)=>{
    let {id}=req.query;
        model.DeleteCategory(id,(err1,result1)=>{
            
                if(err1)
                {
                    console.log("errer while delete ");
                    res.redirect("/ViewCatagory");
                }
                else{
                    res.redirect("/ViewCatagory");
                }
        });
}



exports.Search=(req,res)=>{
    let name=req.query.sname;
    model.Search(name,(err1,result1)=>{
        if(err1)
        {
            return res.sent("database error");
        }
        res.json(result1);
    });

}

exports.addmenu=(req,res)=>{
    console.log("addmenu called");
    model.getCategories((err, categories) => {
        if (err) {
            console.error("Error loading categories:", err);
            return res.status(500).send("Internal Server Error");
        }
        console.log("Categories fetched:", categories);
        res.render("AddMenu.ejs", { categories, msg: "" });
    });
 };
exports.AddMenu = (req, res) => {
    const { name, price, category, description } = req.body;
    const image = req.file.filename;

    model.AddMenu(name, price, category, description, image, (err, result) => {
        if (err) {
            console.error("Insert error:", err);
            return res.status(500).send("Failed to add menu");
        }

        model.getCategories((err, categories) => {
            res.render("AddMenu.ejs", { categories, msg: "Data entered successfully" });
        });
    });
};

exports.ViewMenu=(req,res)=>{
    model.ViewMenu((err,result)=>{
        if(err)
        {
            return res.render("ViewMenu.ejs",{data:[]});
        }
        res.render("ViewMenu.ejs",{data:result});
    });
}

exports.SearchAjax = (req, res) => {
    const sname = req.query.sname;
    model.SearchAjax(sname, (err, result) => {
        if (err) {
            console.error("Search error:", err);
            return res.status(500).send("Database error");
        }
        res.json(result);
    });
};


exports.SearchMenu = (req, res) => {
    const name = req.query.name;

    model.searchMenuByName(name, (err, result) => {
        if (err) {
            console.error("Error in searchMenu:", err);
            return res.status(500).send("Internal server error");
        }

        res.json(result); // Send the menu data as JSON
    });
};




exports.SearchStaff = (req, res) => {
    const sname = req.query.sname || "";

    model.SearchStaff(sname, (err, result) => {
        if (err) {
            console.error("Search error:", err);
            return res.status(500).send("Database error");
        }
        res.json(result);
    });
};

exports.SearchTable=(req,res)=>{
const name=req.query.sname||"";
    model.SearchTable(name,(err,result)=>{
        if(err)
        {
            console.log(err);
            
        }
        else{
            res.json(result);
        }

    
    });
}
exports.section=(req, res) => {
    
  const name = req.params.name;
  res.render(name); // render about.ejs, menu.ejs, etc.
}



// Show Update Form
// controller/cont.js



// Show Update Form
exports.showUpdateForm = (req, res) => {
  const id = req.query.id;

  model.getMenuItemById(id, (err, result) => {
    if (err) {
      console.error("Error fetching menu item:", err);
      return res.status(500).send("Server error");
    }

    if (result.length === 0) {
      return res.status(404).send("Menu item not found");
    }

    const record = result[0];

    model.getAllCategories((err2, categories) => {
      if (err2) {
        console.error("Error fetching categories:", err2);
        return res.status(500).send("Server error");
      }

      res.render("UpdateMenu", { record, categories });
    });
  });
};

// Handle Update POST
exports.updateMenu = (req, res) => {
    const { id, name, category, description, price } = req.body;
    const image = req.file ? req.file.filename : null;

    // Validate inputs
    if (!id || !name || !category || !description || !price) {
        return res.status(400).send("All fields are required.");
    }
    console.log(req.body);

    // Forward to model
    model.updateMenu({ id, name, category, description, price, image }, (err, result) => {
        if (err) {
            console.error("Update error:", err);
            return res.status(500).send("Failed to update menu");
        }

        res.redirect("/ViewMenu");
    });
};


// exports.UpdateMenu = (req, res) => {
//     const { id } = req.query;

//     model.getMenuItemById(id, (err1, menuResult) => {
//         if (err1) {
//             return res.status(500).send("Error fetching menu item");
//         }

//         if (!menuResult || menuResult.length === 0) {
//             return res.status(404).send("Menu item not found");
//         }

//         model.getAllCategories((err2, categoryResult) => {
//             if (err2) {
//                 return res.status(500).send("Error fetching categories");
//             }

//             res.render("UpdateMenu.ejs", {
//                 record: menuResult[0],         // ✅ Now defined correctly
//                 categories: categoryResult,
//                 msg: ""
//             });
//         });
//     });
// };

exports. DeleteMenu = (req, res) => {
    const { id } = req.query;
    model.DeleteMenu(id, (err, result) => {
        if (err) {
            console.error("Delete error:", err);
            return res.status(500).send("Failed to delete menu item");
        }
        model.ViewMenu((err1, result1) => {
            if (err1) {
                return res.status(500).send("Error fetching updated menu");
            }
            res.render("ViewMenu.ejs", { data: result1 });
        });
    });
};



exports.Staff=(req,res)=>{
    res.render("Staff.ejs",{msg:" "});
}

exports.AddStaff = async (req, res) => {
    let { name, email, contact_no, salary, password } = req.body;

    try {
        await model.AddStaff(name, email, contact_no, salary, password);
        res.render("staff.ejs", { msg: "Staff added successfully" });
    } catch (err) {
        console.error("Error adding staff:", err); 
        res.render("staff.ejs", { msg: "Error adding staff. Please try again." });
    }
};


exports.updateMenu = (req, res) => {
    let { id, name, price, category, description } = req.body;
    let image = req.file ? req.file.filename : null;


    const category_id = parseInt(category);
    if (isNaN(category_id)) {
        return res.status(400).send("Invalid category selected.");
    }

    model.updateMenu(id, name, price, category_id, description, image, (err, result) => {
        if (err) {
            console.error("Update error:", err);
            return res.status(500).send("Failed to update menu");
        }

        model.ViewMenu((err1, result1) => {
            if (err1) {
                return res.status(500).send("Error fetching updated menu");
            }
            res.render("ViewMenu.ejs", { data: result1 });
        });
    });
};


exports.ViewStaff = (req, res) => {
    model.ViewStaff((err, result) => {
        if (err) {
            console.error("Error fetching staff:", err);
            return res.status(500).send("Database error");
        }
        res.render("ViewStaff.ejs", { data: result});
    });
};

// Render update form
exports.GetUpdateStaffForm = (req, res) => {
    const id = req.query.id;

    model.GetStaffById(id, (err, result) => {
        if (err) {
            return res.status(500).send("Error fetching staff");
        }

        if (!result || result.length === 0) {
            return res.status(404).send("Staff not found");
        }

        res.render("updateStaffForm", { staff: result[0] });
    });
};


// Handle update form submission
exports.UpdateStaff = (req, res) => {
    const { id, name, email, contact_no, salary, password } = req.body;
    model.UpdateStaff(id, name, email, contact_no, salary, password, (err, result) => {
        if (err) {
            return res.status(500).send("Error updating staff");
        }
        res.redirect("/ViewStaff"); // or wherever your staff list page is
    });
};

// Handle deletion
exports.DeleteStaff = (req, res) => {
    const id = req.query.id;
    model.DeleteStaff(id, (err, result) => {
        if (err) {
            return res.status(500).send("Error deleting staff");
        }
        res.redirect("/ViewStaff");
    });
};



exports.table=(req,res)=>{
    res.render("Tables.ejs",{msg:"..."});
}// In controller.js

exports.AddTable = (req, res) => {
    const { tableNumber, capacity, availability } = req.body;

    console.log("Incoming data:", tableNumber, capacity, availability); // helpful debug

    model.AddTable(tableNumber, capacity, availability)
        .then((affectedRows) => {
            console.log("Affected rows:", affectedRows);
            if (affectedRows > 0) {
                res.render("Tables", { msg: "Data added to database" });
            } else {
                res.render("Tables", { msg: "Failed to add data to database" });
            }
        })
        .catch((err) => {
            console.error("Database error:", err);
            res.render("Tables", { msg: "Internal server error" });
        });
};


exports.ViewTables=(req,res)=>{
    model.ViewTables((err,result)=>{
        if(err)
        {
            console.log("database error");
             return res.status(500).send("Database error");
        }
        res.render("ViewTables.ejs",{data:result});

    });
}
exports.UpdateTable = (req, res) => {
    let id = req.query.id;
console.log("UpdateTable called with id:",id);
    model.UpdateTable(id, (err, result) => {
        if (err) {
            return res.status(500).send("Error updating table");
        }

        if (!result || result.length === 0) {
            return res.status(404).send("Table not found");
        }

        res.render("UpdateTable.ejs", { data: result[0], msg: " " });
    });
};
// cont.js
exports.updatetable = (req, res) => {
  
    const { id, capacity, availability_status } = req.body;

    if (!id || !capacity || !availability_status) {
        return res.status(400).send("Missing data in request body");
    }

    model.updatetable(id, capacity, availability_status, (err, result) => {
        if (err) {
            return res.status(500).send("Failed to update table");
        }

        model.ViewTables((err1, result1) => {
            if (err1) {
                return res.status(500).send("Failed to fetch updated tables");
            }
            res.render("ViewTables.ejs", { data: result1 });
        });
    });
};


exports.DeleteTable=(req,res)=>{
    let id=req.query.id;
    model.DeleteTable(id, (err, result) => {
        if (err) {
            console.error("Error deleting table:", err);
            return res.status(500).send("Failed to delete table");
        }
        model.ViewTables((err1, result1) => {
            if (err1) {
                return res.status(500).send("Failed to fetch updated tables");
            }
            res.render("ViewTables.ejs", { data: result1 });
        });
    });

}



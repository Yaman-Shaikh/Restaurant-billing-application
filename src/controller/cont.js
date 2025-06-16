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

        req.session.userid = result[0].id || result[0].staff_id;

        const dashboard = role === "admin" ? "AdminDashBord" : "sheffdashboard";
        res.render(dashboard, {user: result[0] });

    } catch (err) {
        console.error("Login error:", err);
        res.render("error", {error: "Internal Server Error" });
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
    let result=model.addcatagory(categoryName);
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
// exports.AddMenu = (req, res) => {
//     try {
//         const { name, price, category, description } = req.body;
//         const image = req.file ? req.file.filename : null;

        
//         if (!name || !price || !category || !description || !image) {
//             return res.status(400).send("All fields are required");
//         }

//         model.AddMenu(name, category,price,  description, image, (err, result) => {
//             if (err) {
//                 console.error("Model Error:", err);
//                 return res.status(500).send("Database error");
//             }

//             model.getCategories((err, categories) => {
//                 if (err) {
//                     console.error("Category Fetch Error:", err);
//                     return res.status(500).send("Error loading categories");
//                 }

//                 res.render("AddMenu.ejs", {
//                     categories,
//                     msg: "Menu added successfully"
//                 });
//             });
//         });
//     } catch (error) {
//         console.error("AddMenu Controller Error:", error);
//         res.status(500).send("Server Error");
//     }
// };

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



exports.section=(req, res) => {
    
  const name = req.params.name;
  res.render(name); // render about.ejs, menu.ejs, etc.
}



exports.UpdateMenu = (req, res) => {
    const { id } = req.query;
    model.UpdateMenu(id, (err, result) => {
        if (err) {
            console.error("Error fetching menu for update:", err);
            return res.status(500).send("Database error");
        }
        if (result.length === 0) {
            return res.status(404).send("Menu item not found");
        }
        res.render("UpdateMenu.ejs", { record: result[0], msg: "" });
    });
};

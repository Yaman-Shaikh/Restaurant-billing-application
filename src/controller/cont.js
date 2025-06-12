let regservice=require("../services/regservices.js");
let model=require("../models/regmodel.js");
let session =require("express-session");

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
        res.render("error", { error: "Internal Server Error" });
    }
};
exports.register=(req,res)=>{
    res.render("login.ejs",{msg:"invalid username or password"});
}
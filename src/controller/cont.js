let regservice=require("../services/regservices.js");
let model=require("../models/regmodel.js");

exports.homepage=(req,res)=>{
    res.render("home.ejs");
}
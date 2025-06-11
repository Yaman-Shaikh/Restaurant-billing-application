let regservice=require("../services/regservices.js");
let model=require("../models/regmodel.js");
let session =require("express-session");

exports.homepage=(req,res)=>{
    res.render("home.ejs");
}
exports.loginpage=(req,res)=>{
    res.render("login.ejs");
}
exports.login=(req,res)=>{
    let{username,password}=req.body;
    let result=model.log(username,password);
    result.then=((r)=>{
        if(r.length>0)
        {
            req.session.yid=r[0].id;
              console.log("session number is "+r[0].rid);
            res.render("dashbord.ejs");
        }
        else{
            res.render("login.ejs",{msg:"invalid username or password"});
        }
    });
    result.catch((err)=>{
        res.render("Error.ejs");
    });
        
   
};
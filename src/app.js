let express=require("express");
let app=express();
let reg=require("../src/routes/rout.js");
let conn=require("../src/config/db.js");
let bodyparser=require("body-parser");

let session=require("express-session");

app.use(bodyparser.urlencoded({extended:false}));


app.use(bodyparser.json());

app.set("view engine","ejs");
app.use(express.static("public"));
app.use("/",reg);


module.exports=app;

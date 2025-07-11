let express=require("express");
let app=express();
let reg=require("../src/routes/rout.js");
let conn=require("../src/config/db.js");
let bodyparser=require("body-parser");
let path=require("path");
let expressLayouts = require("express-ejs-layouts");

let session=require("express-session");
app.set("views",path.join(__dirname,"..","views"));
app.use(express.urlencoded({ extended: true })); 

app.use(expressLayouts);
app.set("layout","layout");
app.use(express.json());
app.use(express.static("public"));
app.use(bodyparser.json());
app.use(session({ 
    secret:"8748u43",
    resave:false,
    saveUninitialized:false
}));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));

app.set("view engine","ejs");
app.use(express.static("public"));
// ✅ Correctly import staff router
const staffrout = require('./routes/staffrout.js');

// ✅ Use the router
app.use("/dashboard", staffrout);
app.use("/",reg);


module.exports=app;

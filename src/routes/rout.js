let routs=require("express");
let reg=require("../controller/cont.js");
let router=routs.Router();

router.get("/",reg.homepage);
router.get("/log",reg.loginpage);
router.post("/login",reg.login);


module.exports=router;
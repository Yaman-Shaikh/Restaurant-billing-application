let routs=require("express");
let reg=require("../controller/cont.js");
let router=routs.Router();

router.get("/",reg.homepage);

module.exports=router;
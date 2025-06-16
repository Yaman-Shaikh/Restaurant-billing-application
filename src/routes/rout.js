let routs=require("express");
let reg=require("../controller/cont.js");
let router=routs.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.get("/",reg.homepage);
router.get("/log",reg.loginpage);
router.post("/login",reg.login);
router.get("/About",reg.About);
router.get("/homepage",reg.homepage1);
router.get("/register",reg.register);
router.get("/Menu",reg.Menu);
router.get("/gallery",reg.Gallery);
router.get("/Contact",reg.Contact);
router.get("/AddCatagory",reg.AdCatagory);
router.post("/addcatagory",reg.addcatagory);
router.get("/ViewCatagory",reg.ViewCatagory);
router.get("/UpdateCategory",reg.UpdateCategory);
router.post("/updatecategory",reg.updatecategory);
router.get("/DeleteCategory",reg.DeleteCategory);

router.get("/Search",reg.Search);
router.get("/addmenu", upload.single('image'), reg.addmenu);
// router.post("/AddMenu",reg.AddMenu);
module.exports=router;
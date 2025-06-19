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
router.get("/SearchStaff",reg.SearchStaff);

router.get("/SearchAjax",reg.SearchAjax);



router.get("/addmenu", upload.single('image'), reg.addmenu);
router.post("/AddMenu", upload.single('image'), reg.AddMenu);

router.get("/ViewMenu",reg.ViewMenu);
// router.get("/UpdateMenu",reg.UpdateMenu);
// router.post("/updateMenu", upload.single('image'), reg.updateMenu);

router.get('/UpdateMenu', reg.showUpdateForm);
router.post('/updatemenu', upload.single("image"), reg.updateMenu);



router.get("/SearchMenu", reg.SearchMenu);

 router.get("/DeleteMenu",reg.DeleteMenu);


router.get("/Staff",reg.Staff);
router.post("/AddStaff",reg.AddStaff);
router.get("/ViewStaff",reg.ViewStaff);


router.get("/DeleteStaff", reg.DeleteStaff);
router.get("/UpdateStaff", reg.GetUpdateStaffForm);
router.post("/updatestaff", reg.UpdateStaff);




router.get("/table",reg.table);
router.post("/add-table",reg.AddTable);
router.get("/ViewTables",reg.ViewTables);


router.get("/UpdateTable",reg.UpdateTable);
router.post("/updatetable", reg.updatetable);
router.get("/DeleteTable", reg.DeleteTable);




module.exports=router;
let mysql=require("mysql2");
let conn=mysql.createConnection({
    host :"localhost",
    user:"root",
    password:"root",
    database:"BillingApplication",
});

conn.connect((err)=>{
    if(err)
    {
        console.log("database not connected ");
    }
    else{
     console.log("database connected ");
    }
});
module.exports=conn;
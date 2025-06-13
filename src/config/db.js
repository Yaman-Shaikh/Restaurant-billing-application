let mysql=require("mysql2");
require("dotenv").config({path:__dirname + "/../../.env"});
let conn=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
});
conn.connect((err)=>{
    if(err)
    {
        console.log("database not connected ",err.message);
    }
    else{
     console.log("database connected ");
    }
});
module.exports=conn;
let conn=require("../config/db.js");
exports.log = (username, password) => {
    return new Promise((resolve, reject) => {
        if (username === "admin") {
        conn.query("SELECT * FROM users WHERE username = ? AND password = ?",[username, password],(err, result) =>{
                    if (err) return reject(err);
                    resolve({ result, role: "admin" });
                }
            );
        } else {
            conn.query(
                "SELECT * FROM staff WHERE name = ? AND password = ?",
                [username, password],
                (err, result) => {
                    if (err) return reject(err);
                    resolve({ result, role: "staff" });
                }
            );
        }
    });
};


exports.AddCatagory=(categoryName)=>{
    let flag=true;
    conn.query("insert into category values(0,?)",[category],(err,result)=>{
        if(err){
            flag=false;
            console.log(err);
        }
        else{
            flag=true;
        }
    });return flag;
}
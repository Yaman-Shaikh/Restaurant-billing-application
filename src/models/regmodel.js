let conn=require("../config/db.js");
exports.log=(...info)=>{
 let promiss=new Promiss((resolve,reject)=>{
let{username,password}=req.body;
if(username=="admin")
{
    conn.query("select * from users where username=? and email=?",[username,password],(err,result)=>{
    if(err)
    {
       reject(err);
    }
    else{
        resolve(result);
    }
    });
}
else
{
     conn.query("select * from staff where name=? and email=?",[username,password],(err,result)=>{
    if(err)
    {
       reject(err);
    }
    else{
        resolve(result);
    }
    });
}

    
    });
    return promiss;
};
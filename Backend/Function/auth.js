const jsonwebtoken = require("jsonwebtoken");

const authorization = function (req,res,next){
    console.log(req.headers)
    const authHeader = req.headers['authorization']
    const token  = authHeader && authHeader.split(' ')[1]
   //const token = req.params.token
//    console.log(authHeader)
//    console.log("********")
   if(token==null) return res.sendStatus(401)
   try {
       let tokengen =  jsonwebtoken.verify(token,process.env.SECRET);
       //console.log(tokenResult.iat)
         
       if (tokengen) {
           req.id=tokengen.id
           req.email=tokengen.email
           req.name-tokengen.name
        //    req.user_name=tokengen.user_name
        //    req.user_email=tokengen.user_email
        //    req.role=tokengen.role
        //    req.tenant_id=tokengen.tenant_id
        //    req.tenant_name=tokengen.tenant_name
        //    req.admin_mail=tokengen.admin_mail
           
           next()  
       } else {
           res.status(500).json({
               message:"Something wrong"
           })
       }  
   } catch (error) {
       return res.status(401).json({
        message:error.message
    });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
   }
   
   
};
module.exports = authorization;
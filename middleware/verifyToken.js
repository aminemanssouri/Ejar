import jwt from "jsonwebtoken"

export const verifytoken = async (req,res,next)=>{
const token = req.cookies.token;
if(!token) return res.status(401).json({message : "No Authenticated !"})

    jwt.verify(token,process.env.JWT_SECRET_KEY,async (err,payload)=>{
        if(err) return res.status(403).json({message : "token is not valid !"})

            req.userId = payload.id;
            next();
    });
}
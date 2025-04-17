import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";


export const register = async(req,res)=>{
  const {username,email,password} = req.body;

  try{

  const hashPassword = await bcrypt.hash(password,10);
  
  const newUser = await prisma.users.create({
    data:{
       username,
       email,
       password:hashPassword,
    }
  })

  //console.log(newUser)

  res.status(201).json({message : "user added sccessfully"})
}catch(error)
{
  console.log(error)
  res.status(500).json({message :"faild adding user"})
}
}

export const login =async (req,res)=>{
  //see if user existe in db
  const {username,password} = req.body;
  try{
  const user = await prisma.users.findUnique({
    where:{
      username
    }
  })
  if(!user) return res.status(401).json({message : "ivalide credantial ! "})
  //check if password is correct 
  
  const isPasswordValid = await bcrypt.compare(password,user.password);
  if(!isPasswordValid) return res.status(401).json({message : "you can't login !"})
    //create token
  const age =1000 * 60 * 60 * 24 * 14 ;
  const token = jwt.sign({id:user.id},process.env.JWT_SECRET_KEY,{expiresIn:age})
  
    //add cookies 
   
    res.cookie("token", token,{
      maxAge:age,
      httpOnly:true,
      //secure:true  because we don't use https we add it when we deploy
    }).status(200).json({message :"login successfully"});
}catch(err)
{
  console.log(err);
  res.status(500).json({message : "faild to login !"})
}

}
//logout
export const logout = (req,res)=>{
   res.clearCookie("token").status(200).json({meesage : "user logout "});
}
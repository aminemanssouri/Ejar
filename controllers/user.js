import prisma from "../lib/prisma.js"
import bcrypt from "bcrypt"; 


export const getUsers = async(req,res)=>{
   try{
    const Users = await prisma.users.findMany();
    if(!Users) return res.status(400).json({message : "there is no users"})
    res.status(200).json(Users)
   }
   catch(err)
   {
     if(err) return res.status(500).json({message : "faild to get users !"})
   }
   
}

export const getUser = async (req,res)=>{
    try{
        const ID = req.params.id;
        const User = await prisma.users.findUnique({
            where:{
                id:ID
            }})
            if(!User) return res.status(400).json({message : "Not find !"})
                else return res.status(200).json(User);
    }
   catch(err){
    console.log(err)
        if(err) return res.status(500).json({message : "get user Faild !"})
    }
}

export const deleteUser = async(req,res)=>{

    const id = req.params.id;
    const tokenUserId = req.userId;
    if(id!==tokenUserId)
    {
        return res.status(403).json({message:"Not Authorized !"})
    }
    
    try{
        await prisma.users.delete({
            where:{id}
        })
        res.status(200).json({message : "user deleted "})
    }
    catch(err)
    {
        console.log(err)
        if(err) return res.status(500).json({message : "delete user faild !"})
    }
   
}

export const UpdateUser = async(req,res)=>{
    const id = req.params.id;
    const tokenUserId = req.userId;
    const{password,avatar,...input} = req.body
    

    if(id!==tokenUserId)
    {
        return res.status(403).json({message : "Not Authorized !"})
    }

    const UpdatePassword =null
try{
    if(password)
    {
        UpdatePassword = await bcrypt.hash(password,10);
    }

    const updateUser = await prisma.users.update({
        where:{id},
        data:{
            ...input,
            ...(UpdatePassword && {password:UpdatePassword}),
            ...(avatar && {avatar}),
        },
    })

    const {password:userPassord,...rest} = updateUser;

    return res.status(200).json(rest);
}
   catch(err)
   {
    console.log(err)
    return res.status(500).json({message :"update faild !"})
   } 
}

export const SavePost = async (req , res)=>{
  const PostId = req.body.PostId;
  const TokenUserID = req.userId; 
  try{
     const SavedPost = await prisma.savedPost.findUnique({
        where:{
            UserId_PostID:{
                id:TokenUserID,
                PostId
            },
        },
     });
     if(SavedPost)
        {
           await prisma.savedPost.delete({
            where:{
                id:savedPost.id,
            },
           });
           res.status(200).json({message:"remove from save liste"});
        }else{
            await prisma.savedPost.create({
                data:{
                    userId:TokenUserID,
                    PostId,
                },
            });
            res.status(200).json({message :"Post Saved"});
        }
  }catch(err)
  {
    console.log(err);
    res.status(500).json({message :"server faild !"});
  }
}

export const ProfilePosts = async (req,res)=>{
    const id = req.userId;
    try
    {
    const ProfilePost = await prisma.Post.findMany({
        where:{
            userId:id,
        }
    });

    const SavedPost= await prisma.SavedPost.findMany({
         where:{
            userId:id,
         },
         include:{
            post:true,   //object of post 
         }
    });

    const savedPostItem = SavedPost.map((item)=>item.post);

    res.status(200).json(ProfilePost,savedPostItem);

   }catch(err)
   {
    console.log(err);
    res.status(500).json({message : "Filed to get posts "});
   }
}


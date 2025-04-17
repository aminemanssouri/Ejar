import prisma from "../lib/prisma.js"
import jwt from "jsonwebtoken"


export const getAllPost = async(req,res)=>{
    const Query = req.query;


    try{
        const Posts = await prisma.post.findMany({
            where:{
                city: Query.City || undefined,
                type:Query.type || undefined,
                proprety : Query.proprety || undefined,
                badroom : parseInt(Query.badroom) || undefined,
                price:{
                    gle : parseInt(Query.minPrice) || undefined,
                    lte : parseInt(Query.MaxPrice) || undefined
                },
            },
        });

        res.status(200).json(Posts);

    }catch(err)
    {
        console.log(err);
        res.status(500).json({message : "faild to get Posts"})
    }
};

export const getPostById = async (req, res) => {
  const PostId = req.params.id;

  try {
    const Post = await prisma.post.findUnique({
      where: { id: PostId },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            Avatar: true,
          },
        },
      },
    });

    const token = req.cookies?.token;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const Saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: PostId,
              userId: payload.id,
            },
          },
        });
        // Respond and return to prevent multiple responses
        return res.status(200).json({ ...Post, isSaved: Saved ? true : false });
      } catch (err) {
        console.error("JWT verification failed:", err);
        // Optional: Handle JWT errors here, e.g., return an error or proceed without isSaved
      }
    }

    // Respond if there's no token or JWT verification failed
    res.status(200).json({ ...Post, isSaved: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};


export const addPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;
    if (!body.postData || !body.postDetail) {
        return res.status(400).json({ message: "postData and postDetail are required" });
    }
    try {
      const newPost = await prisma.post.create({
        data: {
          ...body.postData,
          userId: tokenUserId,
          postDetail: {
            create: body.postDetail,
          },
        },
      });
      
      res.status(200).json(newPost);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to create post" });
    }
};
  
export const updatePost = async (req, res) => {

    const PostId = req.params.id;
    const UpdatedData = req.body;
    const token = req.cookies.token;
    if(token)
    {
        jwt.verify(token,process.env.JWT_SECRET_KEY,async(err,payload)=>{
            if(!err){
                try{
                const Updatepost = await prisma.post.update({
                    where:{id:PostId},
                    data:UpdatedData
                });
                  res.status(200).json(Updatepost);
            }catch(err)
            {
                console.log(err);
                res.status(500).json({ message: "Failed to Update post" });
            }
            }
        })
    }

};
  
export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
  
    try {
      const post = await prisma.post.findUnique({
        where: { id },
      });
  
      if (post.userId !== tokenUserId) {
        return res.status(403).json({ message: "Not Authorized!" });
      }
      await prisma.postDetail.delete({
        where:{postId:id},
      })
  
      await prisma.post.delete({
        where: { id },
      });
  
      res.status(200).json({ message: "Post deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to delete post" });
    }
};
  
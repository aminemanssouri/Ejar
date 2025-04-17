import express from 'express'
import {verifytoken} from "../middleware/verifyToken.js"
import {getAllPost,getPostById,addPost,updatePost,deletePost} from "../controllers/Post.js"



const router = express.Router();

/**
 * @method GET
 * @root api/post/
 * @access private
 * @description get all post 
 */

router.get('/',getAllPost);

/**
 * @method GET
 * @root api/post/:id
 * @access private
 * @description get post by id 
 */

router.get('/:id',verifytoken,getPostById);

/**
 * @method POST
 * @root api/post/:id
 * @access private
 * @description add post new post
 */

router.post('/',verifytoken,addPost);


/**
 * @method put
 * @root api/post/:id
 * @access private
 * @description update post
 */

router.put('/:id',verifytoken,updatePost);

/**
 * @method DELETE
 * @root api/post/:id
 * @access private
 * @description delete post
 */

router.delete('/:id',verifytoken,deletePost);

export default router;


import express from 'express'
import {verifytoken} from "../middleware/verifyToken.js"
import {getUser,getUsers,deleteUser,UpdateUser,SavePost,ProfilePosts} from "../controllers/user.js"



const router = express.Router();

/**
 * @method GET
 * @root api/user/
 * @access private
 * @description get all users (for admin)
 */

router.get('/',getUsers);

/**
 * @method GET
 * @root api/user/:id
 * @access private
 * @description get user by id 
 */

router.get('/:id',verifytoken,getUser);

/**
 * @method put
 * @root api/user/:id
 * @access private
 * @description update user
 */

router.put('/:id',verifytoken,UpdateUser);

/**
 * @method DELETE
 * @root api/user/:id
 * @access private
 * @description delete user
 */

router.put('/:id',verifytoken,deleteUser);

/**
 * @method get
 * @root api/user/SavedPost
 * @access private
 * @description save post 
 */

router.post('/saved',verifytoken,SavePost);

/**
 * @method get
 * @root api/user/Profile_Post/
 * @access private
 * @description get all profile post save post and create post  
 */

router.get('/Profile_Post',verifytoken,ProfilePosts);

export default router;


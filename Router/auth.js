import express from "express";
import { login, register ,logout} from "../controllers/auth.js";

const router = express.Router();


/**
 * @method POST
 * @root api/user/registre
 * @access private
 * @description register new user
 */

router.post("/register",register)


/**
 * @method post
 * @root api/user/login
 * @access private
 * @description login  user
 */

router.post("/login",login)


/**
 * @method post
 * @root api/user/logout
 * @access private
 * @description logout  user
 */

router.post("/logout",logout)

export default router;



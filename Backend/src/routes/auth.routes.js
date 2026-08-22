import { Router } from "express";
import { validateRegisterUser , validateLoginUser } from "../validator/auth.validator.js";
import { getMe , googleCallback , register , login } from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { get } from "mongoose";

const router = Router() ;

router.post('/register' , validateRegisterUser , register )

router.post('/login' , validateLoginUser , login )

router.get('/google' ,
     passport.authenticate("google" , {scope : ["profile" , "email"] } ))

router.get('/google/callback' , 
    passport.authenticate("google" , 
        {session : false ,
            failureRedirect : config.NODE_ENV == "development" ? "http://localhost:5173/login" : "/login"      /* if its development then it will be on the port or its not then production (3000)*/
         }) , 
    googleCallback  ,)

/**
 * @route GET /api/auth/me
 * @description Get the authenticated user's profile
 * @access Private
 */

router.get('/me' , authenticateUser , getMe)

export default router
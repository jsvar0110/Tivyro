import { Router } from "express";
import { validateRegisterUser, validateLoginUser } from "../validator/auth.validator.js";
import { getMe, googleCallback, register, login } from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
// import { get } from "mongoose";

const router = Router();

router.post('/register', validateRegisterUser, register)

router.post('/login', validateLoginUser, login)

router.get('/google', (req, res, next) => {
    const state = req.query.role === "seller" ? "seller" : "buyer"
    passport.authenticate("google", { scope: ["profile", "email"], session: false, state })(req, res, next)
})

router.get('/google/callback',
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${config.FRONTEND_URL}/login?error=google_auth_failed`
    }),
    googleCallback)

/**
 * @route GET /api/auth/me
 * @description Get the authenticated user's profile
 * @access Private
 */

router.get('/me', authenticateUser, getMe)

export default router
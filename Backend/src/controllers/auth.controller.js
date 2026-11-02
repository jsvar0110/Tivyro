import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { config } from "../config/config.js";


const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
}


async function sendTokenResponse(user, res, message) {

    const token = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token, cookieOptions)

    res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })

}


export const register = async (req, res) => {

    const { email, contact, password, fullname, isSeller } = req.body

    try {

        const existingUser = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        })

        if (existingUser) {
            return res.status(400).json({ message: "User with this email or contact already exists" })
        }

        const user = await userModel.create({
            email,
            contact,
            password,
            fullname,
            role: isSeller ? "seller" : "buyer"
        })

        await sendTokenResponse(user, res, "User registered successfully")

    } catch (error) {

        console.log(error)
        return res.status(500).json({ message: "Server error" })

    }

}

export const login = async (req, res) => {

    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({ message: "invalid email or password" })
    }

    if (!user.password) {
        return res.status(400).json({ message: "This account uses Google sign-in. Please continue with Google." })
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
        return res.status(400).json({ message: "invalid email or password" })
    }

    await sendTokenResponse(user, res, "User logged in successfully")

}

export const googleCallback = async (req, res) => {

    const FE = config.FRONTEND_URL

    try {

        const { id, displayName, emails } = req.user
        const email = emails?.[0]?.value?.toLowerCase()

        if (!email || emails[0].verified === false) {
            return res.redirect(`${FE}/login?error=google_email_unverified`)
        }

        let user = await userModel.findOne({ googleId: id }) || await userModel.findOne({ email })

        if (!user) {
            // brand-new account: role comes from the OAuth state sent by the Register page
            const role = req.query.state === "seller" ? "seller" : "buyer"
            user = await userModel.create({ email, googleId: id, fullname: displayName, role })
        } else if (!user.googleId) {
            // account existed with email/password: link Google to it
            user.googleId = id
            await user.save()
        } else if (user.googleId !== id) {
            return res.redirect(`${FE}/login?error=google_account_mismatch`)
        }

        const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "7d" })
        res.cookie("token", token, cookieOptions)

        return res.redirect(user.role === "seller" ? `${FE}/seller/dashboard` : `${FE}/`)

    } catch (error) {
        console.error("Google Auth Error:", error)
        return res.redirect(`${FE}/login?error=google_auth_failed`)
    }
}


export const getMe = async (req, res) => {

    const user = req.user

    res.status(200).json({
        message: "User fetched successfully",
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })

}



export const logout = (req, res) => {

    const { maxAge, ...clearOptions } = cookieOptions

    res.clearCookie("token", clearOptions)

    return res.status(200).json({
        message: "Logged out successfully",
        success: true
    })

}
//Tivyro
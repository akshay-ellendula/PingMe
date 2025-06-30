import asyncHandler from 'express-async-handler'
import User from '../model/user.js'
import jwt from 'jsonwebtoken'
import { addStreamUser } from '../lib/stream.js'

//@dec auth signup
//@route /api/auth/signup
//@access public 
export const signup = asyncHandler(async (req, res) => {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
        return res.status(400).json({ message: 'All fileds are Required' })
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400).json({ message: `${email} is allReady registered, please use another email` })
    }

    const idx = Math.floor(Math.random() * 100) + 1; // generate a num between 1-100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    
    const user = await User.create({
        fullName,
        email,
        password,
        profilePic: randomAvatar
    })

    //creating a new account for stream account
    await addStreamUser({
        id: user._id.toString(),
        name: user.fullName,
        image: user.profilePic || ""
    })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h'
    })

    res.cookie("jwt", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === 'production'
    })

    res.status(201).json({ success: true })


})

//@dec auth sigin
//@route /api/auth/signin
//@access public 
export const signin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'All fileds are Required' })
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: `${email} is not registered` })
    }

    const isPasswordCorrect = await user.matchPassword(password)
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: `incorrect Password` })
    }


    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h'
    })

    res.cookie("jwt", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === 'production'
    })

    res.status(200).json({ success: true })
})
//@dec auth logout
//@route /api/auth/logout
//@access public 
export const logout = asyncHandler(async (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({ success: true })
})

//@dec on boarding
//@route /api/auth/onboarding
//@access private
export const onBoarding = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, location } = req.body;

    if (!fullName || !bio || !nativeLanguage || !location) {
        return res.status(400).json({ message: "all fields are required" })
    }

    const updatedUser = await User.findByIdAndUpdate(userId, {
        ...req.body,
        isOnboarded: true,
    }, {
        new: true
    })
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    try {
        await addStreamUser({
            id: updatedUser._id.toString(),
            name: updatedUser.fullName,
            image: updatedUser.profilePic || "",
        });
        console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
    } catch (streamError) {
        console.log("Error updating Stream user during onboarding:", streamError.message);
    }
    return res.status(200).json({ success: true })
})


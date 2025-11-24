import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14*24*60*60*1000; //14days

export const signUp = async (req, res) =>{
    try{
        const {username, password, email, displayName} = req.body;

        if (!username || !password || !email || !displayName) {
            return res.status(400).json({message: "All fields are required"});
        }

        //check if user already exists
        const duplicateUsername = await User.findOne({username});
        if (duplicateUsername) {
            return res.status(409).json({message: "Username already exists"});
        }

        //check if email already exists
        const duplicateEmail = await User.findOne({email});
        if (duplicateEmail) {
            return res.status(409).json({message: "Email already exists"});
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10); // salt rounds = 10


        //create new user
        await User.create({
            username,
            hashedPassword,
            email,
            displayName,
        });


        //return
        return res.sendStatus(204);

    }catch(error){
        console.log('Error in signUp',error);
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({message: `${field} already exists`});
        }
        res.status(500).json({message: 'System error'});
    }
};

export const signIn = async (req,res) => {
    try{
        //Take input
        const {username,password} = req.body;
        
        if (!username || !password){
            return res.status(400).json({message: "Missing username or password"});
        }

        //Compare hashed password in DB with input password
        const user = await User.findOne({username});
        if (!user) {
            return res.status(401).json({message: "Invalid username or password"});
        }

        //compare password
        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
        if(!passwordCorrect){
            return res.status(401).json({message: "Invalid username or password"});
        }
        //if match generate accessToken with JWT
        if (!process.env.ACCESS_TOKEN_SECRET) {
            return res.status(500).json({message: "Server configuration error"});
        }
        const accessToken = jwt.sign(
            {userId: user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: ACCESS_TOKEN_TTL}
        );

        //generate refreshToken
        const refreshToken = crypto.randomBytes(64).toString("hex");


        //create new session to store refreshToken
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
        });

        //send refreshToken through cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only secure in production
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax", //back-end,front-end deploy on different domain
            maxAge: REFRESH_TOKEN_TTL, // 14 days
        }); 

        //send accessToken through res
        return res.status(200).json({message : `User ${user.displayName} signed in successfully`,accessToken});
    }catch(error){
        console.log('Error in signIn',error);
        res.status(500).json({message: 'System error'});
    }
};

export const signOut = async (req,res) =>{
    try {
        //Take refreshToken from cookie
        const token = req.cookies?.refreshToken;

        if(token){
        //Delete refreshToken from session
            await Session.deleteOne({refreshToken: token});
        //Delete cookie
            res.clearCookie("refreshToken");
        }

        return res.sendStatus(204);
    } catch (error) {
        console.log('Error in signOut',error);
        res.status(500).json({message: 'System error'});
    }
};
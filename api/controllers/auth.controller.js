import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async(req, res, next)=>{
    try{
        const {username, email, password} = req.body;
        if(!username || !password || !email || username === ''|| email ==='' || password === ''){
            next(errorHandler(400, 'All fields are required'));
        }
        const hashedPassword = bcryptjs.hashSync(password,10);

        const newUser = User({
            username,
            email,
            password:hashedPassword,
        });
    
        await newUser.save();
        res.json("Signup Successful");

    }catch(e){
        next(e);
    }


}
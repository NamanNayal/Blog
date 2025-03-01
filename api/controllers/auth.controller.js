import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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
};

export const signin = async(req,res, next) => {
    try{
        const {email, password} = req.body;
        if(!email || !password || email === '' || password === ''){
            return next(errorHandler(400, 'All fields are required'));
        }  
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errorHandler(400, 'Invalid Credentials'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errorHandler(400, 'Invalid Credentials'));
        }
        const token = jwt.sign(
            {
                id: validUser._id,    
            }, process.env.JWT_SECRET,{expiresIn:'1week'},
        );
        const{ password: pass, ...rest} = validUser._doc;
        res.status(200).cookie('acess_token', token, {
            httpOnly: true,
        }).json(rest); 

    }catch(e){

    }

}
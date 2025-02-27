import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async(req, res)=>{
    try{
        const {username, email, password} = req.body;
        if(!username || !password || !email || username === ''|| email ==='' || password === ''){
            return res.status(400).json({message: 'All feilds are required'});
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
        res.status(500).send('SignUp Error : ' + e.message);
    }


}
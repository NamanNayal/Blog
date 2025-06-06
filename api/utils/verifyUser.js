import jwt from 'jsonwebtoken';
import {errorHandler} from './error.js';

export const verifyToken = (req, res, next) =>{
    console.log('cookies:', req.cookies);
    
    const token = req.cookies.access_token;
    console.log('access token',token);
    if(!token){
        return next(errorHandler(401, 'Unauthorized'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err){
            return next(errorHandler(401, 'Unauthorized'))
        }
        req.user = user;
        next();

    });
}

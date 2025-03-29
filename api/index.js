import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO)
.then(
    ()=>{console.log('connection established')}
).catch((err)=>{console.log(err)});

app.listen(3000, ()=>{
    try{
        console.log('listening on port 3000'); 
    }catch(e){
        console.log('Error :'+e.message);
    }
   
})



app.use('/api/user',userRoutes);
app.use('/api/auth', authRoutes );
app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        default:'https://imgs.search.brave.com/IWqRZpiAse9xKnvnOfBiTLYyThdE26j0R-o2JydFo9A/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNS8x/MC8wNS8yMi8zNy9i/bGFuay1wcm9maWxl/LXBpY3R1cmUtOTcz/NDYwXzY0MC5wbmc'
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    },{timestamps:true}
);

const User = mongoose.model('User', userSchema);
export default User;
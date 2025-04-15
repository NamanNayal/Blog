import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId:{
       type: String, 
       required: true,
    },
    content:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
        unique: true,
    },
    image:{
        type: String,
        default: "https://imgs.search.brave.com/G2_jF07fDVgKeTrUgt_DFB2EbYlcMYVeOAT-wmr4ry8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kaWdp/ZmxvYXQuaW8vd3At/Y29udGVudC91cGxv/YWRzLzIwMjQvMDYv/RnJlZS1JbWFnZXMt/Zm9yLUJsb2dzLmpw/Zw",
    },
    category:{
        type: String,
        default: 'uncategorized',
    },
    slug:{
        type: String,
        required: true,
        unique: true,
    },

},{timestamps: true});

const Post = mongoose.model('Post', postSchema);

export default Post;
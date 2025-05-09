import Post from "../models/post.model.js";

export const create = async(req, res, next)=>{

    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to create a post'))
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400, 'Title and content are required'))
    }
    const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase().
    replace(/[^a-zA-Z0-9\-]/g, '');

    const postData = new Post({
        title: req.body.title,
        content: req.body.content,
        category: req.body.category || 'uncategorized',
        slug,
        userId: req.user.id
    });
    if(req.body.image && req.body.image.trim() !== ''){
        postData.image = req.body.image;
    }

    const newPost = new Post(postData);

    try{
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);

    }catch(error){
        next(error);
    }
};


export const getposts = async(req, res, next)=>{
    try{
        const startIndex = parseInt(req.query.start) || 0;
        const limit = parseInt(req.query.limit)|| 9;
        const sortDirection = req.query.order === 'asc' ? 1: -1;

        const filters = ({
            ...(req.query.userId && {userId: req.query.userId}),
            ...(req.query.category && {category: req.query.category}),
            ...(req.query.slug && {slug: req.query.slug}),
            ...(req.query.postId && {_id: req.query.postId}),
            ...(req.query.searchTerm && {
                $or:[
                    {title: {$regex : req.query.searchTerm, $options: 'i'}},
                    {content: {$regex: req.query.searchTerm, $options: 'i'}},
                ],
            }),

        });

        const posts = await Post.find(filters)
        .sort({updatedAt: sortDirection})
        .skip(startIndex)
        .limit(limit);

        const totalPosts = await Post.countDocuments(filters);

        const now = new Date();
        const lastMonth = new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate(),
        );

        const lastMonthPosts = await Post.find({
            createdAt: {$gte : lastMonth},
        })

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });

        
    }catch(error){
        next(error);
    }
}

export const deletepost = async(req,res,next)=>{
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(errorHandler(403, 'You are not allowed to delete this post'))
    }
    try{
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('Post has been deleted successfully!');

    }catch(error){
        next(error);
    }
}

export const updatepost = async(req,res,next)=>{

    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(errorHandler(403, 'You are not allowed to update this post'));
    }
    try{

        const updateData = {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
        }

        if(req.body.image && req.body.image.trim() !== ''){
            updateData.image = req.body.image;
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $set:updateData
            },
            {new: true}
        );
        res.status(200).json(updatedPost);

    }catch(error){
        next(error);
    }
}
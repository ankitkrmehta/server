import mongoose from "mongoose";
import Blog from "../model/Blog";
import User from "../model/User";

export const getAllBlogs = async(req,res,next) => {
    let blogs;
    try {
        blogs = await Blog.find().populate("user");
    }
    catch(err){
        console.log(err);
    }
    if(!blogs){
        return res.status(404).json({message: "No blogs found"});
    }
    return res.status(200).json({blogs});
}


export const addBlog = async (req, res, next) => {
    const { title, description, image, user } = req.body
    let existingUser;
    try {
        existingUser = await User.findById(user)
    } catch (err) {
        return console.log(err)
    }

    const blog = new Blog({
        title,
        description,
        image,
        user
    })

    try {
        /*WE DONOT JUST SAVE THE BLOG, INSTEAD WE SAVE THE blog 
        //and also push the blog inside users's blogs array and save it
        //for this we create a session, so that we can use transaction time:  01:13:00*/
        const session = await mongoose.startSession();
        session.startTransaction()
        await blog.save({ session })
        existingUser.blogs.push(blog)
        await existingUser.save({ session })
        await session.commitTransaction();
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err })
    }

    if (!existingUser) {
        return res.status(400).json({ message: "Unable To Find User By Id" })
    }

    try {
        blog.save()
    } catch (err) {
        return console.log(err)
    }
    return res.status(200).json({ blog })
}




export const updateBlog = async (req,res,next) => {
    const {title,description}= req.body;
    const blogId = req.params.id;
    let blog;
    try {
        blog =await Blog.findByIdAndUpdate(blogId, {
            title, 
            description
        });
    } catch(err){
        return console.log(err);
    }

    if(!blog) {
        return res.status(500).json({message: "Unable to update the blog"});
    }
    return res.status(200).json({blog});
}

export const getById = async (req, res, next) => {
    const id = req.params.id;

    let blog;

    try {
        blog = await Blog.findById(id);
    } catch (err) {
        return console.log(err)
    }

    if (!blog) {
        return res.status(404).json({ message: "No Blog Found" })
    }
    return res.status(200).json({ blog })
}

export const deleteBlog = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try {
         //populate() method is used to replace the user ObjectId field with the
         // whole document consisting of all the user data
        blog = await Blog.findByIdAndRemove(id).populate('user'); 
        await blog.user.blogs.pull(blog);
        blog.user.save();
    } catch (err) {
        return console.log(err)
    }

    if (!blog) {
        return res.status(500).json({ message: "unable to delete" })
    }

    return res.status(200).json({ message: "Successfully deleted" })
}


export const getByUserId = async (req, res, next) => {
    const userId = req.params.id;
    let userBlogs
    try {
        userBlogs = await User.findById(userId).populate("blogs")
    } catch (err) {
        return console.log(err)
    }
    if (!userBlogs) {
        return res.status(404).json({ message: "No Blog Found" })
    }
    return res.status(200).json({ user: userBlogs })
}
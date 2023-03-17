const User  = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwt");
// const isValidObjectId = require("./utils/isValidObjectId");


const createUser = asyncHandler (async(req,res)=>{
    const email = req.body.email;
    const findUser = await User.findOne({email:email});
    if (!findUser) {
      const newUser = await User.create(req.body);
      res.json(newUser)
     }else{
    throw new Error("User already exists")
    };
 });

const login = asyncHandler (async(req,res) => {
const {email,password} = req.body;
// console.log(email,password);
const findUser = await User.findOne({email});
if(findUser && await findUser.ispasswordMethods(password)){
// res.json(findUser)
res.json({
    _id:findUser?._id,
    firstName:findUser?.firstName,
    lastName:findUser?.lastName,
    email:findUser?.email,
    mobile:findUser?.mobile,
    role:findUser?.role,
    token:generateToken(findUser?._id)
});
}else{
    throw new Error("Invalid password")
};
 });

 const getAllUser = asyncHandler(async(req,res)=>{
    try {
        const getAllUsers = await User.find();
        res.json(getAllUsers);
    } catch (error) {
      throw new Error(error);
    }
 });

 const getUser = asyncHandler(async(req,res) => {
    const {id} = req.params;
    // isValidObjectId(id)
    try {
        const getUser = await User.findById(id);
        res.json({
            getUser,
        });
    } catch (error) {
        throw new Error(error);
    }
 })

 const deletetUser = asyncHandler(async(req,res) => {
    const {id} = req.params;
    // isValidObjectId(id)
    try {
        const deletetUser = await User.findByIdAndDelete(id);
        res.json({
            deletetUser,
        });
    } catch (error) {
        throw new Error(error);
    }
 })

 const updateUser = asyncHandler(async(req,res) => {
    const {id} = req.user;
    // isValidObjectId(_id);
    try {
        const updateUser = await User.findOneAndUpdate(id,{
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            mobile:req.body.mobile,
            email:req.body.email
        },{
            new:true
        });
        res.json(updateUser);
    } catch (error) {
        throw new Error(error);
    }
 })

 const blockUser = asyncHandler(async(req,res)=>{
    const {id} = req.params
    // isValidObjectId(id)
    try {
        const blockuser =  await User.findByIdAndUpdate(id,
            {
                isBlocked:true
            },{
                new:true
            },
            );
            res.json(blockuser)
    } catch (error) {
        throw new Error(error)
    }

 })
 const unblokUser = asyncHandler(async(req,res)=>{
    const {id} = req.params
    // isValidObjectId(id);
    try {
        const unlock =  await User.findByIdAndUpdate(id,
            {
                isBlocked:false
            },{
                new:true
            },
            );
            res.json({
                massage:"User is Unlocked"
            })
    } catch (error) {
        throw new Error(error)
    }

 })

 
module.exports = {
    createUser,
    login,
    getAllUser,
    getUser,
    deletetUser,
    updateUser,
    blockUser,
    unblokUser,
}
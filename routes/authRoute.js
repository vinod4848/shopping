const express = require('express');
const { createUser, login, getAllUser, getUser,deletetUser,updateUser, blockUser, unblokUser } = require('../controllers/userCtrl');
const {authmiddleware,isAdmin} = require('../middleware/authmiddleware');
const router =  express.Router();
router.post("/register",createUser)
router.post("/login",login) 
router.get("/getAllUser",getAllUser)
// router.get("/:id",getUser)
router.get("/:id",authmiddleware,isAdmin,getUser)
router.delete("/:id",deletetUser) 
router.put("/edit-user",authmiddleware,isAdmin,updateUser)
router.put("/block-user/:id",authmiddleware,isAdmin,blockUser)
router.put("/unblok-user/:id",authmiddleware,isAdmin,unblokUser) 
module.exports = router;


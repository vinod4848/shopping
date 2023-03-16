const express = require('express');
const { createUser, login, getAllUser, getUser,deletetUser,updateUser } = require('../controllers/userCtrl');
const router =  express.Router();
router.post("/register",createUser)
router.post("/login",login) 
router.get("/getAllUser",getAllUser)
router.get("/:id",getUser)
router.delete("/:id",deletetUser) 
router.put("/:id",updateUser) 
module.exports = router;


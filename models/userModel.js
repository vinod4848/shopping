const mongoose = require('mongoose'); 
const bcrypt = require("bcrypt");
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user"
    }
},{ timestamps: true })

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password,salt);
});

userSchema.methods.ispasswordMethods = async function (enterpassword) {
    return await bcrypt.compare(enterpassword,this.password)
};

module.exports = mongoose.model('User', userSchema);
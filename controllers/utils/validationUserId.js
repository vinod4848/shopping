const ObjectId = require('mongoose').Types.ObjectId;

function isValidObjectId(id){
    
    if(ObjectId.isValid(id)){
        if((String)(new ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
}
module.exports = {isValidObjectId};

// const  mongoose  = require("mongoose");
// const isValidObjectId =  (id) =>{
//     const isValid = mongoose.Schema. Types.ObjectId.isValid(id);
//     if(!isValid) throw new Error("This id is not valid");
// };

// module.exports = {isValidObjectId};
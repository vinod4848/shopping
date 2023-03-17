// let mongoose = require('mongoose'); 
// const ObjectId = require('mongoose').Types.ObjectId;
// const validationUserId = (id) => {
//     const isvalid = mongoose.Types.ObjectId.isvalid(id);
//     if(!isvalid) throw new Error("This Id is not Vaild or not found")
// };
// module.exports = validationUserId;


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

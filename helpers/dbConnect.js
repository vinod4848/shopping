const { mongoose } = require("mongoose")
const dbConnect =()=>{
try {
    const conn = mongoose.connect(process.env.MONGODB_URI);
    console.log("database is connected successfully");
} catch (error) {
    console.log("database is not connected");
}
};

module.exports = dbConnect;
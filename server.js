const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const bodyparser = require("body-parser");
const dotenv = require("dotenv").config()
const authRouter = require('./routes/authRoute');
const { notfound, errorHandler } = require('./middleware/errorhandler');
const PORT = process.env.PORT||4000;
dbConnect();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use('/api/user',authRouter)

app.use(notfound);
app.use(errorHandler)

// app.use('/',(req,res)=>{
//     res.send("Hello from server side");
// })

app.listen(PORT, () => {
     console.log('Server listening on PORT ' + PORT);
     });


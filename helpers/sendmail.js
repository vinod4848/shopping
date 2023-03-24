const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const sendmail = asyncHandler(async (data, req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MP,
    },
  });

  try {
    await transporter.sendMail({
      from: "Fred Foo 👻",
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = { sendmail };


// const nodemailer = require("nodemailer");
// const asyncHandler = require("express-async-handler");
// const sendmail = asyncHandler(async (req,data, res) => {
//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.MAIL_ID,
//       pass: process.env.MP,
//     },
//   });

//   let info = await transporter.sendMail({
//     from: 'vinodsoftmind@gmail.com',
//     to: data.to,
//     subject: data.subject,
//     text: data.text,
//     html: data.html,
//   });

//   console.log("Message sent: %s", info.messageId);

//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// });
// module.exports = { sendmail };

import nodemailer from "nodemailer";

console.log({
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS?.slice(0, 4) + "****"
});

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
console.log(transporter.options);

transporter.verify((error, success) => {
  if (error) {
    console.log("MAIL ERROR:", error);
  } else {
    console.log("Mail server ready");
  }
}); 
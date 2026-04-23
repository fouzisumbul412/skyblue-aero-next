import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // replace with SMTP provider in production
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
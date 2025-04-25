import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

export default class Mailer {
  static async sendMail(to, subject, text) {
    // Generate an OTP if the subject contains "OTP"
    let otp = null;
    if (subject.toLowerCase().includes('otp')) {
      otp = Math.floor(100000 + Math.random() * 900000);
      text = text.replace('${otp}', otp);
    }
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      }
    });

    let mailOptions = {
      from: `"AttendMateApp" <${process.env.EMAIL}>`,
      to: to,
      subject: subject,
      text: text,
    };
    
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Mailer Error:", error);
          reject(error);
        } else {
          console.log("Email sent successfully");
          resolve({ success: true, info, otp });
        }
      });
    });
  }
}

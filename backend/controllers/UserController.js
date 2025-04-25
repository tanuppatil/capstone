import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import { Student } from "../model/Student.js";
import { Teacher } from "../model/Teacher.js";
import JWT from "../middleware/JWT.js";

// Debug environment variables in development mode
if (process.env.NODE_ENV === 'development') {
  console.log('===== ENVIRONMENT VARIABLES =====');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('EMAIL:', process.env.EMAIL);
  console.log('PASSWORD exists:', !!process.env.PASSWORD);
  console.log('CLIENT_URL:', process.env.CLIENT_URL);
  console.log('PORT:', process.env.PORT);
  console.log('================================');
}

//login
async function Login(req, res) {
  const { email, password } = req.body;
  let type = "student";
  //check if user is a student
  let user = await Student.findOne({ email });
  if (!user) {
    type = "teacher";
    user = await Teacher.findOne({ email });
  }

  if (user) {
    if (user.password === password) {
      const token = JWT.generateToken({ email: user.email });
      user.type = type;
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({ user: user, type: type, token: token });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } else {
    res.status(400).json({ message: "No such User" });
  }
}
// Create a new user
async function Signup(req, res) {
  const { name, email, pno, dob, password, type } = req.body;
  if (type === "student") {
    const user = new Student({
      name: name,
      email: email,
      pno: pno,
      dob: dob,
      password: password,
    });
    try {
      const existingUser = await Student.findOne({ email: email }).exec();
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      } else {
        const newUser = await user.save();
        res.status(201).json(newUser);
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    const user = new Teacher({
      name: name,
      email: email,
      pno: pno,
      dob: dob,
      password: password,
    });
    try {
      const existingUser = await Teacher.findOne({ email: email }).exec();
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      } else {
        const newUser = await user.save();
        res.status(201).json(newUser);
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}
//change password
async function ForgotPassword(req, res) {
  const { email, password } = req.body;
  //check if user is a student
  let user = await Student.findOneAndUpdate({ email }, { password }).exec();
  if (!user) {
    user = await Teacher.findOneAndUpdate({ email }, { password }).exec();
  }
  if (user) {
    res.status(200).json({ message: "Password changed successfully" });
  } else {
    res.status(400).json({ message: "No such User" });
  }
}

//edit user details
async function EditUserDetails(req, res) {
  const { email, name, pno, dob } = req.body;
  //check if user is a student
  let user = await Student.findOne
    .findOneAndUpdate({ email }, { name, pno, dob })
    .exec();
  if (!user) {
    user = await Teacher.findOneAndUpdate
      .findOneAndUpdate({ email }, { name, pno, dob })
      .exec();
  }
  if (user) {
    res.status(200).json({ message: "User updated" });
  }
}

//send mail
function SendMail(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  
  const otp = Math.floor(100000 + Math.random() * 900000);
  
  // Create a transporter using nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    }
  });

  const mailOptions = {
    from: `"AttendMateApp" <${process.env.EMAIL}>`,
    to: email,
    subject: "OTP for Registration - AttendMate",
    text: `Your OTP for registration is ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4285f4;">AttendMateApp - Registration OTP</h2>
        <p>Hello,</p>
        <p>Your OTP for registration is:</p>
        <h1 style="font-size: 32px; font-weight: bold; color: #333; text-align: center; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">${otp}</h1>
        <p>This OTP is valid for a short period of time.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
        <p style="margin-top: 20px; font-size: 12px; color: #777;">This is an automated message, please do not reply to this email.</p>
      </div>
    `
  };

  // Normal email flow
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Email Error:", error);
      return res.status(400).json({ message: "Failed to send OTP email. Please try again." });
    } else {
      console.log("Email sent successfully");
      res.status(200).json({ message: "OTP sent successfully", otp: otp });
    }
  });
}

const UserController = {
  Login,
  Signup,
  ForgotPassword,
  EditUserDetails,
  SendMail,
};

export default UserController;

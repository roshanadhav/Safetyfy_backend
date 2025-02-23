import express from 'express'
import User from '../models/user.js';
import bycript from 'bcryptjs'
import jwt from 'jsonwebtoken'
import transpoter from '../config/nodemailer.js';
import { login, logout, register, sendVerifyOTp, verifyEmail ,isAuthenticated, resetPasswordOtpSender, verifyOtpTochengePassword } from '../controllers/authController.js';
import  userAuth from '../middelwears/userAuth.js';

const authRouter = express.Router({mergeParams:true})

authRouter.post('/register' , register);

authRouter.post('/login' , login) ;

authRouter.post('/logout' , logout) ; 

authRouter.post('/send-verify-otp' , userAuth , sendVerifyOTp) ; 

authRouter.post('/verify-account' , userAuth, verifyEmail) ; 

authRouter.post('/is-auth' , userAuth, isAuthenticated) ; 

authRouter.post('/reset-pass-otp-send' , resetPasswordOtpSender) ; 

authRouter.post('/verify-otp-change-pass' , verifyOtpTochengePassword) ; 


export default authRouter ;

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js';
import transpoter from '../config/nodemailer.js';

//signup

export const  register = async (req  , res ) =>{
        const {name , password , email } = req.body ; 
        if (!email || !name || !password) {
            return res.json({success : false , message : 'Missing Details'}) ;
        }
        try {
            const existingUser = await User.findOne({email : email}) ;
            if(existingUser){
                return res.json({success : false , message : 'User alredy exists'}) ;
            }
            const hashPassword = await bcrypt.hash(password , 10) ; 

            const user = new User({
                name , email , password : hashPassword 
            })

            await user.save() ; 

            const tokan = jwt.sign({id : user._id}, process.env.JWT_SECREAT , {expiresIn : '7d'}) ;
            res.cookie('token', tokan, {
                httpOnly: true,
                secure: true, 
                sameSite: 'None' 
              });

            // Sending Welcome Email  :  

            const mailOptions = {
                from : process.env.SENDER_EMAIL ,
                to : email ,
                subject : 'Welcome To Heartly' ,
                html: `
                        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
                        <div style="text-align: center;">
                            <img src="${"logo"}" alt="Heartly Logo" style="max-width: 150px; margin-bottom: 15px;">
                        </div>
                        <h2 style="color: #007bff; text-align: center;">Welcome, ${name}!</h2>
                        <p style="font-size: 16px; text-align: center;">We're thrilled to have you at <strong>Heartly</strong>! Your account has been successfully created.</p>
                        
                        <div style="background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); text-align: center;">
                            <p style="font-size: 14px; margin: 10px 0;"><strong>Email:</strong> ${email}</p>
                        </div>

                        <p style="text-align: center; font-size: 16px; margin-top: 20px;">Start exploring now and enjoy our services!</p>

                        <div style="text-align: center; margin-top: 20px;">
                            <a href="https://yourwebsite.com" style="display: inline-block; padding: 12px 24px; background: #007bff; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;">Go to Heartly</a>
                        </div>

                        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #ddd;">

                        <p style="font-size: 12px; color: #777; text-align: center;">If you did not sign up for Heartly, please ignore this email.</p>
                    </div>
                `
            }
            
            await transpoter.sendMail(mailOptions) ; 
            return res.json({success : true , message : 'user signup Successfully'})

        } catch (error) {
            res.json({success : false , mmessage : error.message})
        }
}

//login

export const login = async (req, res) => { 
    const {email , password}  = req.body ; 
    if (!email || !password) {
        return res.json({success : false , message : 'email and password are required' })
    }

    try {
        const user = await User.findOne({email}) ; 
        if (!user) {
            return res.json({success : false , message : 'user dose not exists with the given email'})
        }
        const isMache = await bcrypt.compare(password , user.password ) 
        
        if (!isMache) {
            return res.json({success : false , message : 'Invalid Password'})
        }

        const tokan = jwt.sign({id : user._id}, process.env.JWT_SECREAT , {expiresIn : '7d'}) ;
        res.cookie('token', tokan, {
            httpOnly: true,
            secure: true, 
            sameSite: 'None' 
          });
        
        return res.json({success : true , message : 'user signin Successfully'})

    } catch (error) {
        return res.json({success : false , message : error.message }) ;
    }

}

//logout
export const logout = async (req, res) =>{
     try {
        res.clearCookie('token',{
                httpOnly : true ,
                secure: (process.env.NODE_ENV == 'production') ? true : false ,
                sameSite : process.env.NODE_ENV == 'production' ? 'none' : 'strict' ,
        })
        return res.json({success : true , message : 'user logged out successfully'})
     } catch (error) {
        return res.json({success : false , message : error.message}) ;
     }
}


// send Verification Otp To Users Email : 
export const sendVerifyOTp = async (req,res)=>{
    try {
        const {userId} = req.body ; 

        const user = await User.findById(userId) ;

        if (user.isveriFied) {
            return res.json({success : false , message : 'Account alredy verified'})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyOtp = otp ; 
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000 ; 

        await user.save() ; 

        const mailOptions = {
            from : process.env.SENDER_EMAIL ,
            to : user.email ,
            subject : 'Account Varification OTP' ,
            html: `
                    <div style="max-width: 600px; margin: 20px auto; padding: 20px; background: #ffffff; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                    <!-- OTP at the top -->
                    <p style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 10px;">Your OTP for email verification:</p>
                    <div style="background: #007bff; color: #ffffff; font-size: 24px; font-weight: bold; padding: 15px; border-radius: 8px; display: inline-block; margin-bottom: 20px;">
                        ${otp}
                    </div>
                    <p style="font-size: 14px; color: #555; margin-bottom: 20px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
                    
                    <!-- Branding -->
                    <div style="margin-bottom: 20px;">
                        <img src="${"logo"}" alt="Heartly Logo" style="max-width: 150px;">
                    </div>
                    <!-- Greeting & Message -->
                    <h2 style="color: #007bff; margin-bottom: 10px;">Welcome, ${user.name}!</h2>
                    <p style="font-size: 16px; color: #333;">Thank you for signing up with <strong>Heartly</strong>! Please verify your email to continue.</p>
                    <!-- Email Info -->
                    <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; font-size: 14px; color: #333; margin: 20px auto; display: inline-block;">
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
                    </div>
                    <!-- CTA Button -->
                    <div style="margin-top: 20px;">
                        <a href="https://yourwebsite.com" style="display: inline-block; padding: 12px 24px; background: #007bff; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;">Verify Now</a>
                    </div>
                    <hr style="margin: 20px 0; border: 0; border-top: 1px solid #ddd;">
                    <p style="font-size: 12px; color: #777;">If you did not request this, please ignore this email.</p>
                </div>

            `
        }

        await transpoter.sendMail(mailOptions) ;
        
        return res.json({success : true , message : 'otp sent sucessfully'})

    } catch (error) {
        return res.json({success : false , message : error.message})
    }
}



// verify the otp : 
export const verifyEmail  = async (req , res )=>{
    const {userId , otp }  = req.body ; 

    if (! userId || ! otp ) {
        return res.json({success : false , message : 'Missing Details'}) ; 
    }


    try {
        const user = await User.findById(userId) ; 
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({success : false , message : 'Invalid Otp'})
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({success : false , message : 'OTP Expired'}) ; 
        }

        user.isveriFied = true ; 
        user.verifyEmail = '' ; 
        user.verifyOtpExpireAt = 0 ; 

        await user.save() ; 

        return res.json({success : true , message : 'email verified sucessfully'})

    } catch (error) {
        return res.json({success : false , message : error.message })
    }
}


// isAuthenticated : 
export const isAuthenticated = async (req , res)=>{
    try {
        return res.json({success : true }) ; 

    } catch (error) {
        return res.json({success : false , message : error.message })
    }
}

// Password reset otp : 
export const resetPasswordOtpSender = async (req , res) =>{

    const {email} = req.body ; 
    if (!email) {
        return res.json({success : false , message : 'Missing Email'})
    }
    try {
        const user = await User.findOne({email}) ; 
        if (!user) {
            return res.json({success : false , message : 'The account does not exists with the provided email'})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.resetOtp = otp ; 
        user.restOtpExpireAt = Date.now() + 15 * 60 * 1000 ; 
        await user.save() ;

        const mailOptions = {
            from : process.env.SENDER_EMAIL ,
            to : user.email ,
            subject : 'Password Reset OTP' ,
            html: `
                    <div style="max-width: 600px; margin: 20px auto; padding: 20px; background: #ffffff; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); text-align: center;">
                    <!-- OTP at the top -->
                    <p style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 10px;">Password Reset OTP:</p>
                    <div style="background: #007bff; color: #ffffff; font-size: 24px; font-weight: bold; padding: 15px; border-radius: 8px; display: inline-block; margin-bottom: 20px;">
                        ${otp}
                    </div>
                    <p style="font-size: 14px; color: #555; margin-bottom: 20px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
                    
                    <!-- Branding -->
                    <div style="margin-bottom: 20px;">
                        <img src="${"logo"}" alt="Heartly Logo" style="max-width: 150px;">
                    </div>
                    <!-- Greeting & Message -->
                    <h2 style="color: #007bff; margin-bottom: 10px;">Welcome, ${user.name}!</h2>
                    <p style="font-size: 16px; color: #333;">Thank you for signing up with <strong>Heartly</strong>! Please verify your email to continue.</p>
                    <!-- Email Info -->
                    <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; font-size: 14px; color: #333; margin: 20px auto; display: inline-block;">
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
                    </div>
                    <!-- CTA Button -->
                    <div style="margin-top: 20px;">
                        <a href="https://yourwebsite.com" style="display: inline-block; padding: 12px 24px; background: #007bff; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;">Verify Now</a>
                    </div>
                    <hr style="margin: 20px 0; border: 0; border-top: 1px solid #ddd;">
                    <p style="font-size: 12px; color: #777;">If you did not request this, please ignore this email.</p>
                </div>

            `
        }
        await transpoter.sendMail(mailOptions) ;
        return res.json({success : true , message : 'otp sent sucessfully'})

        
    } catch (error) {
        return res.json({success : false , message : error.message})
    }



}


// verify otp to chenge password : 
export const verifyOtpTochengePassword = async (req,res) => {
    const {otp , email , password} = req.body ; 

    if (!email || !otp ||!password) {
        return res.json({success : false , message : 'missing credintials'})
    }

    try {
        const user = await User.findOne({email}) ; 
        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({success : false , message : 'Invalid Otp'})
        }

        if (user.restOtpExpireAt < Date.now()) {
            return res.json({success : false , message : 'OTP Expired'}) ; 
        }
        const hashPassword  = await bcrypt.hash(password , 15) ; 
        user.password = hashPassword ;
        user.resetOtp = '' ; 
        user.restOtpExpireAt = 0 ; 
        await user.save() ; 
        return res.json({success : true , message : 'password changed sucessfully'})

    } catch (error) {
        return res.json({success : false , message : error.message })
    }
}
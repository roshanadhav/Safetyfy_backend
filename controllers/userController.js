import { alertEmail } from "../config/alertEmail.js";
import User from "../models/user.js"
import transporter from "../config/nodemailer.js"
import {sendWhatsAppMessage} from "../config/sendWhatsApp.js";

export const getUserData  = async (req , res) =>{
    const {userId} = req.body ; 
    if (!userId) {
        return res.json({success : false , message : 'user not logged in'}) ;
    }
    try {
        const user = await User.findById(userId) ;
        if (!user) {
            return res.json({success : false , message : 'User Does Not Exists With Provided UserId'}) ; 
        }
        return res.json({success : true , message : 'returning the user data' , id : user._id , name : user.name , email : user.email , isveriFied : user.isveriFied})
    } catch (error) {
        return res.json({success : false , message : error.message})
    }
}


export const getHelp = async (req , res)=>{
    const {id , latitude , longitude} = req.body ; 
    if (!id) {
        return res.json({success : false , message : "missing credintials" }) ; 
    }
    try {
        const user = await User.findById(id) ; 
        const numbers = user.emergencyPhonenumber ; 
        const emails = user.emergencyEmail ; 
        const whnumbers = user.emergencyWhNumber ;
        let URL = `http://10.20.10.31:3000/${id}/requiredHelp`  ; 
        for (const email of emails) {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: `Emergency | ${user.name} is in danger`,
                html: alertEmail.replace('{{name}}', user.name).replace('{{name}}', user.name).replace('{{url}}', URL)
            };
            await transporter.sendMail(mailOptions);
        }
        for (const num of whnumbers) {
            if (num) {
                console.log(num);
                await sendWhatsAppMessage(num , URL , user.name);
            } 
        }
    } catch (error) {
        return res.json({success : false , message : error.message })
    }

}
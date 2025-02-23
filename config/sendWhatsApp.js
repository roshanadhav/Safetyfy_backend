import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


export const sendWhatsAppMessage = async (to, url , userName) => {
    try {
        const formattedPhone = `whatsapp:+91${to}`;
        const message = `🚨 *Emergency Alert!* 🚨\n\n${userName} is in danger!\n🔗 *Check location:* ${url}`;
      const response = await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,  // Twilio Sandbox Number
        to: formattedPhone,  // Recipient’s WhatsApp number
        body: message
      });
      console.log("WhatsApp Message Sent:", response.sid);
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
    }
  };
  
  export default sendWhatsAppMessage;
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
// import nodemailerSendgrid from "nodemailer-sendgrid";

export const mailSend = async(email,title,body)=>{
    try
    {
        // create a SMTP transport service
        // let transporter = nodemailer.createTransport(nodemailerSendgrid({
        //     apiKey:process.env.SENDGRID_API_KEY
        // }));
        let transporter = nodemailer.createTransport({
            service:"gmail",
            secure:true,
            port:465,
            auth:{
                user:"codecollab.inc@gmail.com",
                pass:process.env.SMPT_GMAIL_KEY,
            }
        });
        // Send a mail
        const info = await transporter.sendMail({
            from:"Verify OTP",
            to:email,
            subject:"Registered Successfully",
            html:`<p>Now, you can login with these credientials</p><br>
                    <p> ${email}</p>
                    <p>${title} </p>
                    <p>${body}</p>
                `,
        });
        if(!info)
        {
            console.log("Check credientials");
        }

        
    }
    catch(error)
    {
        console.log("Something went wrong when sending mail",error);
    }
        

}
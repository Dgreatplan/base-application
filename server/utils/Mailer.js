import nodemailer from "nodemailer";
import chalk from 'chalk';
/**
 * 
 * @description global email sending
 */

let transporter;

export default class Mailer {

    static async init() {
        transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
              user: process.env.SENDER_EMAIL,
              pass: process.env.SENDER_PW,
            },
        });
    
        await new Promise((resolve, reject) => {
            console.log("Initializing Mailer..");
            transporter.verify((error, success) => {
                if(error) {
                    console.log("verify error :>> ", error);
                    reject(error);
                } else {
                    resolve(success);
                    console.log(chalk.cyan('Mailer has been initialized.'));
                }
            });
        });
    }

    static async sendMail(mailOptions = {}) {

        try {

            if(!Array.isArray(mailOptions.to)) mailOptions.to = [mailOptions.to];
    
            const response = await transporter.sendMail(mailOptions);
            console.log("Email sent successfully :>> ", response);

        } catch (error) {
            console.log('error sending email :>> ', error);
        }

    }

}
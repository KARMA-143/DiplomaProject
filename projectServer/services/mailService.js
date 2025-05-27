const {ActivationLink} = require("../models/models");
const uuid=require('uuid')
const {createTransport} = require("nodemailer");

class MailService {

    constructor(){
        this.transporter=createTransport({
            host:process.env.SMTP_HOST,
            port:process.env.SMTP_HOST,
            secure:false,
            auth:{
                user:process.env.SMTP_USER,
                pass:process.env.SMTP_PASSWORD,
            }
        })
    }

    async createActivationLink(userId, transaction){
        const activationLink=await ActivationLink.findOne({where:{UserId:userId}});
        if(activationLink){
            activationLink.link=uuid.v4();
            await activationLink.save({transaction});
            return activationLink;
        }
        const newActivationLink=uuid.v4();
        return await ActivationLink.create({UserId:userId, link:newActivationLink}, {transaction});
    };

    async sendActivationLink(to, link){
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Account activation on "+process.env.API_URL,
            text:"",
            replyTo: process.env.SMTP_USER,
            headers: {
                "X-Mailer": "Nodemailer",
            },
            html:
            `<div>
                <h1>Activation link</h1>
                <a href=${link}>${link}</a>
            </div>`
        });
    };

    async activate(link, transaction){
        const activationLink=await ActivationLink.findOne({where:{link:link}});
        if(activationLink){
            const userId=activationLink.UserId;
            await activationLink.destroy({transaction});
            return userId;
        }
        throw new Error(`Activation link expired or account was activated!`);
    }
}

module.exports = new MailService();
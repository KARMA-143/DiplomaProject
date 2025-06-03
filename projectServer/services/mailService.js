const {ActivationLink} = require("../models/models");
const uuid=require('uuid')
const {createTransport} = require("nodemailer");
const courseService = require("./courseService");

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

    async createPostInform(post) {
        const members = await courseService.getCourseMembers(post.CourseId);
        const courseInfo = await courseService.getCourseInfo(post.CourseId);

        for (const member of members) {
            const { email, name } = member.User;

            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to: email,
                subject: `New post in course: "${courseInfo.name}"`,
                replyTo: process.env.SMTP_USER,
                headers: {
                    "X-Mailer": "Nodemailer",
                },
                html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px;">
            <p>Hello${name ? `, ${name}` : ''}!</p>
            <p>A new post has been published in the course <strong>"${courseInfo.name}"</strong>:</p>
            <p>${post.text?.slice(0, 200) || 'No content available'}...</p>
            <p>
                You can view it at:
                <br />
                <a href="${process.env.CLIENT_URL}/course/${post.CourseId}/feed" style="color: #3366cc;">
                    View Post
                </a>
            </p>
            <hr />
            <p style="font-size: 14px; color: #888;">This is an automated notification. Please do not reply to this email.</p>
        </div>
    `
            });
        }
    }

    async createTaskInform(task) {
        const members = await courseService.getCourseMembers(task.CourseId);
        const courseInfo = await courseService.getCourseInfo(task.CourseId);

        for (const member of members) {
            const { email, name } = member.User;

            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to: email,
                subject: `New assignment in course: "${courseInfo.name}"`,
                replyTo: process.env.SMTP_USER,
                headers: {
                    "X-Mailer": "Nodemailer",
                },
                html: `
                <div style="font-family: Arial, sans-serif; font-size: 16px;">
                    <p>Hello${name ? `, ${name}` : ''}!</p>
                    <p>A new task <strong>"${task.title}"</strong> has been added to the course <strong>"${courseInfo.name}"</strong>.</p>
                    <p>
                        You can view the task at:
                        <br />
                        <a href="${process.env.CLIENT_URL}/course/${task.CourseId}/task/${task.id}" style="color: #3366cc;">
                            View task
                        </a>
                    </p>
                    <hr />
                    <p style="font-size: 14px; color: #888;">This is an automated notification. Please do not reply to this email.</p>
                </div>
            `
            });
        }
    }

    async createTestInform(test) {
        const members = await courseService.getCourseMembers(test.CourseId);
        const courseInfo = await courseService.getCourseInfo(test.CourseId);

        for (const member of members) {
            const { email, name } = member.User;

            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to: email,
                subject: `New test in course: "${courseInfo.name}"`,
                replyTo: process.env.SMTP_USER,
                headers: {
                    "X-Mailer": "Nodemailer",
                },
                html: `
                <div style="font-family: Arial, sans-serif; font-size: 16px;">
                    <p>Hello${name ? `, ${name}` : ''}!</p>
                    <p>A new test <strong>"${test.title}"</strong> has been added to the course <strong>"${courseInfo.name}"</strong>.</p>
                    <p>
                        You can view the test at:
                        <br />
                        <a href="${process.env.CLIENT_URL}/course/${test.CourseId}/test/${test.id}" style="color: #3366cc;">
                            View Test
                        </a>
                    </p>
                    <hr />
                    <p style="font-size: 14px; color: #888;">This is an automated notification. Please do not reply to this email.</p>
                </div>
            `
            });
        }
    }

    async createInvitationInform(invitation) {
        const { user, courseId, isMentor } = invitation;
        const courseInfo = await courseService.getCourseInfo(courseId);

        const { email, name } = user;

        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: `You have a new invitation to the course: "${courseInfo.name}"`,
            replyTo: process.env.SMTP_USER,
            headers: {
                "X-Mailer": "Nodemailer",
            },
            html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px;">
            <p>Hello${name ? `, ${name}` : ''}!</p>
            <p>You have been invited to join the course <strong>"${courseInfo.name}"</strong> as a ${isMentor ? 'mentor' : 'member'}.</p>
            <p>
                You can view the course and accept the invitation here:
                <br />
                <a href="${process.env.CLIENT_URL}/invitation" style="color: #3366cc;">
                    Go to Invitation page
                </a>
            </p>
            <hr />
            <p style="font-size: 14px; color: #888;">This is an automated notification. Please do not reply to this email.</p>
        </div>
        `
        });
    }

    async createMarkInform(userTaskDTO) {
        const { user, mark, taskTitle, courseName } = userTaskDTO;
        const { email, name } = user;

        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: `Your task "${taskTitle}" in course "${courseName}" has been graded`,
            replyTo: process.env.SMTP_USER,
            headers: {
                "X-Mailer": "Nodemailer",
            },
            html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px;">
            <p>Hello${name ? `, ${name}` : ''}!</p>
            <p>Your task <strong>"${taskTitle}"</strong> in the course <strong>"${courseName}"</strong> has been graded.</p>
            <p><strong>Mark received:</strong> ${mark !== null && mark !== undefined ? mark : 'Not yet graded'}</p>
            <p>
                You can view your task and feedback at:
                <br />
                <a href="${process.env.CLIENT_URL}/course/${userTaskDTO.TaskId || ''}/task/${userTaskDTO.id}" style="color: #3366cc;">
                    View Task Details
                </a>
            </p>
            <hr />
            <p style="font-size: 14px; color: #888;">This is an automated notification. Please do not reply to this email.</p>
        </div>
        `
        });
    }
}

module.exports = new MailService();
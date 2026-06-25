const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "85d53bac0a389f", // Replace with your MailTrap user
            pass: "c2a56858f927a9"  // Replace with your MailTrap password
        }
    });

    const mailOptions = {
        from: '"WanderLust Support" <support@wanderlust.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

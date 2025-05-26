// utils/emailService.ts
import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  mailContent: string;
}

const sendEmail = async (
  to: string,
  subject: string,
  mailContent: string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: to,
      subject,
      html: mailContent,
    };

  const info = await transporter.sendMail(mailOptions);
  console.log("✅ Email Subject:", subject);
};

export {sendEmail};

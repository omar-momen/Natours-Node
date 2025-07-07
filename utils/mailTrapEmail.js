import nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';

export const sendEmail = async (options) => {
  const transport = nodemailer.createTransport(
    MailtrapTransport({
      token: process.env.MAILTRAP_API_TOKEN,
      testInboxId: 3489240,
    }),
  );

  const sender = {
    address: process.env.SENDER_EMAIL,
    name: process.env.SENDER_NAME,
  };
  const recipients = [options.email];

  transport
    .sendMail({
      from: sender,
      to: recipients,
      subject: options.subject,
      text: options.message,
      category: 'Integration Test',
      sandbox: true,
    })
    .then(console.log, console.error);
};

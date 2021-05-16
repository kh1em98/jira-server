import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { redis } from '../redis';

export const PREFIX_VERIFY_EMAIL = 'VERIFY_EMAIL';

export async function createConfirmationUrl(userId: number): Promise<string> {
  const id = uuidv4();
  await redis.set(`${PREFIX_VERIFY_EMAIL}${id}`, userId, 'ex', 60 * 60);

  return id;
}

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(email: string, url: string) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: `<a href="${url}">${url}</a>`, // html body
  });

  console.log('Message sent: %s', info.messageId);

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

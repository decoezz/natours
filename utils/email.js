const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
require('dotenv').config();
// new Email(user, url).sendWelcome();
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Ezz el dien Ahmed <${process.env.EMAIL_FROM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //Sendgrid
      return nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: process.env.BREVO_PORT,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: process.env.BREVO_USERNAME,
          pass: process.env.BREVO_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: false, //SSL configuration you can switch it to true if we change the port and you get an error
    });
  }
  //Send the actual email
  async send(template, subject) {
    // 1)render HTML basend on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    //2)Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.htmlToText(html),
    };

    //3)Create a transport and send email

    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }
  async sendpasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
};

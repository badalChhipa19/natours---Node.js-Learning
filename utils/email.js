const mailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = mailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define the email options
  const mailOptions = {
    from: 'Natours <badal.chhipa@mail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

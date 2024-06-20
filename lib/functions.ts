import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendMail = async (email: string, message: string) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `Website activity of ${email}`,
    html: `
            <p>Email: ${email} </p>
            <p>Message: ${message} </p>
            `,
  };
  const res = await transporter.sendMail(mailOptions);
  return res;
};

export const verificationMessage = (name: string, _id: string) =>
  `Hello ${name}!\n\nYour account has been created successfully. \n\nPlease click on the link below to verify your email. <a href="http://localhost:3000/verify/${_id}">Click here</a> \n\nRegards, \nDream Team`;

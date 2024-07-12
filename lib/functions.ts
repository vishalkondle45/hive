import { ObjectCannedACL, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import dayjs from 'dayjs';
import nodemailer from 'nodemailer';
import Todo from '@/models/Todo';
import '@/models/TodoList';

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

//? TODO QUERIES
export const getTodaysTodos = async (user: any) =>
  Todo.find({
    user,
    date: { $gte: dayjs().startOf('day').toDate(), $lte: dayjs().endOf('day').toDate() },
  })
    .populate({ path: 'list', select: 'title color' })
    .sort({ isCompleted: -1 });
export const getUpcomingTodos = async (user: any) =>
  Todo.find({ user, date: { $gt: dayjs().startOf('day').toDate() } })
    .populate({ path: 'list', select: 'title color' })
    .sort({ isCompleted: -1 });
export const getRecentTodos = async (user: any) =>
  Todo.find({ user, date: { $lt: dayjs().startOf('day').toDate() } })
    .populate({ path: 'list', select: 'title color' })
    .sort({ isCompleted: -1 });
export const getImportantTodos = async (user: any) =>
  Todo.find({ user, isImportant: true })
    .populate({ path: 'list', select: 'title color' })
    .sort({ isCompleted: -1 });
export const getListTodos = async (user: any, list: string) =>
  Todo.find({ user, list })
    .populate({ path: 'list', select: 'title color' })
    .sort({ isCompleted: -1 });
export const getAllTodos = async (user: any) =>
  Todo.find({ user })
    .populate({
      path: 'list',
      select: 'title color',
    })
    .sort({ isCompleted: -1 });

const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function uploadImageToS3(file: Buffer, name: string) {
  try {
    const fileBuffer = file;
    const params = {
      Key: name,
      Body: fileBuffer,
      ACL: ObjectCannedACL.public_read,
      Bucket: 'dream-by-vishal',
      ContentType: 'image/*',
    };
    const command = new PutObjectCommand(params);
    const result = await s3Client.send(command);
    return result;
  } catch (error) {
    return '';
  }
}

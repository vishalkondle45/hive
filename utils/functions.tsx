import { rem } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { ObjectCannedACL, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import https from 'https';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(isToday);
dayjs.extend(isTomorrow);
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);

export const getInitials = (name: string | undefined | null) => {
  if (name) {
    const nameArray = name.trim()?.split(' ');
    return nameArray?.length < 2
      ? nameArray[0][0]
      : nameArray[0][0] + nameArray[nameArray.length - 1][0];
  }
  return 'XY';
};

function isPrime(n: number) {
  if (n === 0 || n === 1) return false;
  for (let i = 2; i * i <= n; i += 1) if (n % i === 0) return false;

  return true;
}

function getSum(n: number) {
  let sum = 0;
  while (n > 0 || sum > 9) {
    if (n === 0) {
      n = sum;
      sum = 0;
    }
    sum += n % 10;
    n = Math.floor(n / 10);
  }
  return sum;
}

export function getDigitByString(str: string | undefined | null) {
  if (!str) return 0;
  let sum = 0;
  for (let i = 0; i < str?.length; i += 1) {
    if (isPrime(i + 1)) sum += str.charCodeAt(i);
  }
  return getSum(sum);
}

export const getDueDate = (date: any) => {
  if (dayjs(date).isToday()) return 'Today';
  if (dayjs(date).isTomorrow()) return 'Tomorrow';
  return dayjs(date).format('ddd, MMM D');
};

export const removeSpaces = (string: string | undefined) => string?.split('\n').join(' ').trim();

export const convertToSingleSpace = (string: string | undefined) =>
  string?.split('  ').join(' ').trim();

export const displayUserFirstName = (string: string) => string.split(' ')[0];

export const getFormattedDate = (date: any) => dayjs(date).format('Do MMM YYYY');

export const timeFromNow = (date: string) => dayjs(date).fromNow();

export const getFormattedDateWithTime = (date: any) => dayjs(date).format('Do MMM YYYY HH:MM A');

export const textToSpeech = (
  string: string,
  open: () => void = () => {},
  close: () => void = () => {}
) => {
  if (window.speechSynthesis.speaking) {
    speechSynthesis.cancel();
    close();
  } else {
    open();
    const msg = new SpeechSynthesisUtterance(string);
    // eslint-disable-next-line prefer-destructuring
    msg.voice = speechSynthesis.getVoices()[1];
    msg.lang = 'en-IN';
    window.speechSynthesis.speak(msg);
    // eslint-disable-next-line func-names
    window.onbeforeunload = function (e) {
      if (window.speechSynthesis.speaking) {
        e.preventDefault();
        msg.addEventListener('end', () => {
          speechSynthesis.cancel();
          close();
        });
      }
    };
    // eslint-disable-next-line func-names
    msg.onend = function () {
      speechSynthesis.cancel();
      close();
    };
  }
};

export function getRandomElements(arr: any[]) {
  return arr.sort(() => Math.random() - 0.5);
}

export const renderBoldText = (text: string) => {
  const boldRegex = /\*\*(.*?)\*\*/g;
  return text
    .split(boldRegex)
    .map((part, index) => (index % 2 === 0 ? part : `<strong>${part}</strong>`));
};

export const errorNotification = (error: string) => {
  notifications.show({
    message: error,
    icon: <IconX />,
    color: 'red',
  });
};

export const success = (payload: any) => {
  notifications.show({
    title: 'Success',
    color: 'green',
    autoClose: 3000,
    icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
    message: '',
    ...payload,
  });
};

export const error = (payload: any) => {
  notifications.show({
    title: 'Error',
    color: 'red',
    autoClose: 3000,
    icon: <IconX style={{ width: rem(18), height: rem(18) }} />,
    ...payload,
  });
};

const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function uploadToS3(file: any, name: string, type = 'image/*') {
  try {
    const fileBuffer = file;
    const params = {
      Key: name,
      Body: fileBuffer,
      ACL: ObjectCannedACL.public_read,
      Bucket: 'vishal-nextjs',
      ContentType: type,
    };
    const command = new PutObjectCommand(params);
    const result = await s3Client.send(command);
    return result;
  } catch (e: any) {
    return '';
  }
}

export const fetchImageBuffer = (url: any) =>
  new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to get image. Status code: ${res.statusCode}`));
          return;
        }

        const chunks: any[] = [];
        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });

export function markdownToHTML(markdown: string) {
  // Convert headers: # Header to <h1>, ## Header to <h2>, etc.
  markdown = markdown.replace(/^(#{1,6})\s*(.*)$/gm, (_, hashes, title) => {
    const level = hashes.length;
    return `<h${level}>${title}</h${level}>`;
  });

  // Convert bold: **text** or __text__ to <strong>text</strong>
  markdown = markdown.replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1$2</strong>');

  // Convert italics: *text* or _text_ to <em>text</em>
  // markdown = markdown.replace(/\*(.*?)\*|_(.*?)_/g, '<em>$1$2</em>');
  markdown = markdown.replace(/(\*+)(.*?)\1|_(.*?)_/g, '<em>$1$2</em>');

  // Convert inline code: `code` to <code>code</code>
  markdown = markdown.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Convert code blocks: ```lang\ncode\n``` to <pre><code class="lang">code</code></pre>
  markdown = markdown.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    // Escape HTML characters inside code blocks
    code = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<pre><code class="${lang}">${code}</code></pre>`;
  });

  // Convert blockquotes: > quote to <blockquote>quote</blockquote>
  markdown = markdown.replace(/^>\s+(.*)$/gm, '<blockquote>$1</blockquote>');

  // Convert unordered lists: - item to <ul><li>item</li></ul>
  markdown = markdown.replace(/^- (.*)$/gm, '<ul><li>$1</li></ul>');

  // Convert horizontal rules: --- to <hr>
  markdown = markdown.replace(/^---$/gm, '<hr>');

  // Convert links: [text](url) to <a href="url">text</a>
  // markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
  markdown = markdown.replace(/\[(.*?)\]\((.*?)(?:\)|$)/g, '<a href="$2">$1</a>');

  // Convert new lines: \n\n to <br><br> for paragraph breaks
  markdown = markdown.replace(/\n\n/g, '<br><br>');

  // Convert new lines: \n to <br> for line breaks
  markdown = markdown.replace(/\n/g, '<br>');

  // Convert Single * to <em> and it may have anything before *
  markdown = markdown.replace(/\*(.*?)\*/g, '<em>$1</em>');
  markdown = markdown.replace(/\*(.*?)/g, '<em>$1</em>');
  return markdown;
}

import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

export const CODE_REGEX = /```([\s\S]*?)```/g;

export const API_ENDPOINTS = {
  REGISTER_USER: '/api/users/register',
};

export const MUSIC_ENDPOINTS = {
  ALBUMS: '/api/music/album',
  SONGS: '/api/music/song',
  SONG: '/api/music/get-song',
};

export const ROBOT_ENDPOINTS = {
  CHATS: '/api/robot/chats',
  LIST: '/api/robot/chats/list',
};

export const AWS_URL = 'https://vishal-nextjs.s3.eu-north-1.amazonaws.com/';

export const BG_IMAGES = [
  'https://www.icloud.com/system/icloud.com/current/wallpaper.webp',
  'https://wallpapercave.com/wp/wp8466808.jpg',
  'https://images.pexels.com/photos/3721941/pexels-photo-3721941.jpeg?cs=srgb&dl=pexels-daniel-reche-718241-3721941.jpg&fm=jpg',
  'https://static.vecteezy.com/system/resources/previews/002/414/405/original/abstract-colorful-fun-background-vector.jpg',
  'https://static.vecteezy.com/system/resources/previews/006/504/485/non_2x/abstract-wallpaper-using-blue-color-scheme-with-blob-shape-and-using-4k-resolution-suitable-for-all-used-free-photo.jpg',
  'https://static.vecteezy.com/system/resources/previews/009/362/398/original/blue-dynamic-shape-abstract-background-suitable-for-web-and-mobile-app-backgrounds-eps-10-vector.jpg',
];

export const geminiModelConfig = {
  model: 'gemini-pro',
  // model: 'gemini-1.5-flash',
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ],
};

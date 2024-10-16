import axios from 'axios';
import { MUSIC_ENDPOINTS } from '@/utils/constants';

export const getAlbums = async () => axios.get(MUSIC_ENDPOINTS.ALBUMS);

export const postAlbum = async (data: any) => axios.post(MUSIC_ENDPOINTS.ALBUMS, data);

export const getSongs = async (_id: string) => axios.get(`${MUSIC_ENDPOINTS.SONGS}?album=${_id}`);

export const postSongs = async (data: any) => axios.post(MUSIC_ENDPOINTS.SONGS, data);

export const getSong = async (link: string) =>
  axios.get(`${MUSIC_ENDPOINTS.SONG}?link=${encodeURI(link)}`);

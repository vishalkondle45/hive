import axios from 'axios';
import { ROBOT_ENDPOINTS } from '@/utils/constants';

export const getChat = async (_id: string) => axios.get(`${ROBOT_ENDPOINTS.CHATS}?_id=${_id}`);

export const getChats = async () => axios.get(ROBOT_ENDPOINTS.CHATS);

export const postChat = async (data: any) => axios.post(ROBOT_ENDPOINTS.CHATS, data);

export const putChat = async (_id: string, data: any) =>
  axios.put(`${ROBOT_ENDPOINTS.CHATS}?_id=${_id}`, data);

export const deleteChat = async (_id: string) =>
  axios.delete(`${ROBOT_ENDPOINTS.CHATS}?_id=${_id}`);

export const deleteAllChats = async () => axios.delete(ROBOT_ENDPOINTS.LIST);

export const getAllChats = async () => axios.get(ROBOT_ENDPOINTS.LIST);

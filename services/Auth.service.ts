import axios from 'axios';
import { API_ENDPOINTS } from '@/utils/constants';

export const registerUser = async (data: any) => axios.post(API_ENDPOINTS.REGISTER_USER, data);

import axios from 'axios';
import type { User } from '@/features/users/domain/types';
import type { UsersApiResponse } from '@/features/users/api/types';

export const fetchUsers = async (token: string): Promise<User> => {
  const url = `${import.meta.env.VITE_API_URL}/authToken`;

  try {
    const response = await axios.post<UsersApiResponse>(url, { token });
    const json = response.data;

    if (json.success === false) {
      throw new Error(`[${json.error}] ${json.message}`);
    }

    const data = json.user ?? {};

    return data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        `네트워크 오류: ${error.message} (status: ${error.response?.status ?? 'N/A'})`
      );
    }
    throw error;
  }
};

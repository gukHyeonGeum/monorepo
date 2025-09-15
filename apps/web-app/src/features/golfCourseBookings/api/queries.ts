import type { GolfCourseBookingsApiResponse } from '@/features/golfCourseBookings/api/types';
import type { Booking } from '@/features/golfCourseBookings/domain/types';
import { mapBooking } from '@/features/golfCourseBookings/domain/mappers';
import axios from 'axios';

export const fetchGolfCourseBookings = async (user_id: number): Promise<Booking[]> => {
  const url = `${import.meta.env.VITE_API_URL}/erpBooking/sbs/myReservations?user_id=${user_id}`;

  try {
    const response = await axios.get<GolfCourseBookingsApiResponse>(url);
    const json = response.data;

    if (json.success === false) {
      throw new Error(`[${json.error}] ${json.message}`);
    }

    const data = json.data.map(mapBooking) ?? [];

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `네트워크 오류: ${error.message} (status: ${error.response?.status ?? 'N/A'})`
      );
    }
    throw error;
  }
};

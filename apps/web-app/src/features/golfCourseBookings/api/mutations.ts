import type {
  GolfCourseBookingCancelApiResponse,
  GolfCourseBookingCreateApiResponse,
} from '@/features/golfCourseBookings/api/types';
import axios from 'axios';

export interface CreateBookingPayload {
  mbr_key: number;
  golf_plc_no: number;
  book_cours_no: string;
  book_dt: string;
  time_seq: string;
  book_tm: string;
  rsrv_psnn: number;
  cp_rsrvr_name: string;
  cp_rsrvr_phone: string;
  wkday_wkend_dv: string;
}

/**
 * 예약을 생성하는 API 함수 (예시)
 * @param payload - 예약 생성에 필요한 데이터
 * @returns 성공 여부와 생성된 예약 ID를 포함하는 객체
 */
export const createBooking = async (
  payload: CreateBookingPayload
): Promise<{ success: boolean; bookingId: string }> => {
  const url = `${import.meta.env.VITE_API_URL}/erpBooking/sbs/booking`;

  try {
    const response = await axios.post<GolfCourseBookingCreateApiResponse>(url, payload);
    const json = response.data;

    if (json.success === false) {
      throw new Error(`[${json.error}] ${json.message}`);
    }

    const data = json.data ?? {};

    if (data.RESULT !== 'SUCCESS') {
      throw new Error(`[${data.RESULT}] ${data.MSG}`);
    }

    return { success: true, bookingId: data.BOOK_NO };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `네트워크 오류: ${error.message} (status: ${error.response?.status ?? 'N/A'})`
      );
    }
    throw error;
  }
};

/**
 * 예약을 취소하는 API 함수
 * @param bookingId - 취소할 예약의 ID
 * @returns 성공 여부를 포함하는 객체
 */
export const cancelBooking = async (
  bookingId: string,
  userId: number
): Promise<{ success: boolean }> => {
  const url = `${import.meta.env.VITE_API_URL}/erpBooking/sbs/cancel`;

  try {
    const response = await axios.post<GolfCourseBookingCancelApiResponse>(url, {
      book_no: bookingId,
      mbr_key: userId,
    });
    const json = response.data;

    if (json.success === false) {
      throw new Error(`[${json.error}] ${json.message}`);
    }

    const data = json.data ?? {};

    if (data.RESULT !== 'SUCCESS') {
      throw new Error(`[${data.RESULT}] ${data.MSG}`);
    }

    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `네트워크 오류: ${error.message} (status: ${error.response?.status ?? 'N/A'})`
      );
    }
    throw error;
  }
};

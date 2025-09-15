import { mapCourse, mapTeeTimeDtoToTeeTime } from '@/features/golfCourses/domain/mappers';
import type {
  GolfCourseTimesApiResponse,
  GolfCourseApiResponse,
} from '@/features/golfCourses/api/types';
import type { GolfCourse, TeeTimes } from '@/features/golfCourses/domain/types';
import { formatYmd } from '@/shared/utils/date';
import axios from 'axios';

export const fetchGolfCourses = async (date: Date): Promise<GolfCourse[]> => {
  const ymd = formatYmd(date);
  const url = `${import.meta.env.VITE_API_URL}/erpBooking/sbs/search?from_book_dt=${ymd}&to_book_dt=${ymd}`;

  try {
    const response = await axios.get<GolfCourseApiResponse>(url);
    const json = response.data;

    if (json.success === false) {
      throw new Error(`[${json.error}] ${json.message}`);
    }

    const data = json.data.map(mapCourse) ?? [];

    return data.sort((a, b) => a.MIN_SALE_FEE - b.MIN_SALE_FEE);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `네트워크 오류: ${error.message} (status: ${error.response?.status ?? 'N/A'})`
      );
    }
    throw error;
  }
};

export const fetchGolfCourseTimes = async (date: Date, no: number): Promise<TeeTimes[]> => {
  const ymd = formatYmd(date);
  const url = `${import.meta.env.VITE_API_URL}/erpBooking/sbs/times?book_dt=${ymd}&golf_plc_no=${no}`;

  try {
    const response = await axios.get<GolfCourseTimesApiResponse>(url);
    const json = response.data;

    if (json.success === false) {
      throw new Error(`[${json.error}] ${json.message}`);
    }

    const timeList = json.data?.timeList ?? [];
    const data = timeList.map(mapTeeTimeDtoToTeeTime);

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

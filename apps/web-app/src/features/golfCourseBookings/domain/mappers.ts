import type { BookingDto } from '@/features/golfCourseBookings/api/types';
import type { Booking } from '@/features/golfCourseBookings/domain/types';
import { toNumber } from '@/shared/utils/common';

export const mapBooking = (dto: BookingDto): Booking => ({
  dto,
  id: dto.book_no.toString(),
  status: dto.book_stat_cd,
  courseName: dto.golf_plc_nm,
  date: dto.book_dt,
  time: dto.book_tm,
  courseLayout: dto.book_cours_nm,
  conditions: dto.rsrv_psnn,
  greenFee: toNumber(dto.sale_fee),
  cancellationDeadline: dto.rsrv_cncl_rule_dt,
  bookerName: dto.rsrvr_nm,
  bookerPhone: dto.rsrvr_mobile,
});

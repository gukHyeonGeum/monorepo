export interface BookingDto {
  book_no: number;
  user_id: number;
  golf_plc_no: number;
  book_dt: string;
  book_cours_no: number;
  time_seq: number;
  rsrv_psnn: number;
  rsrvr_nm: string;
  rsrvr_mobile: string;
  rsrv_dttm: string;
  cncl_dttm: string;
  golf_plc_nm: string;
  rsrv_cncl_rule_dt: string;
  book_cours_nm: string;
  normal_fee: string;
  sale_fee: string;
  book_tm: string;
  book_stat_cd: number;
  canceled_at: string;
  create_at: string;
}

export interface BookingCreateDto {
  RESULT: string;
  MSG: string;
  BOOK_NO: string;
}

export interface BookingCancelDto {
  RESULT: string;
  MSG: string;
}

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: string;
  message: string;
};

export type GolfCourseBookingsApiResponse = ApiSuccess<BookingDto[]> | ApiError;
export type GolfCourseBookingCancelApiResponse = ApiSuccess<BookingCancelDto> | ApiError;
export type GolfCourseBookingCreateApiResponse = ApiSuccess<BookingCreateDto> | ApiError;

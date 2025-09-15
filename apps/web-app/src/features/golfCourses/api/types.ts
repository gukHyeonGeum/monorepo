export interface TimeDetailDto {
  BOOK_TM: string;
  SALE_FEE: number;
  BOOK_COURS_NO: string;
  BOOK_COURS_NM: string;
  TIME_SEQ: string;
  NORMAL_FEE: string;
  WKDAY_WKEND_DV: string;
  BOOK_DT: string;
  HOLE_SCALE: string;
  RECOMM_YN: 'Y' | 'N';
  PREPAY_YN: 'Y' | 'N';
}

export interface GolfCourseDto {
  GOLF_PLC_NO: string;
  GOLF_PLC_NM: string;
  REGN_NM: string;
  BOOK_DT: string;
  MIN_SALE_FEE: number;
  ADDR_TRANS: string;
  TIME_COUNT: number;
  TIME_LIST: TeeTimeDto[];
}

export interface GolfCourseTimesDto {
  EVENT_YN: 'Y' | 'N';
  SALE_FEE_TRAN: string;
  WKDAY_WKEND_DV: string;
  ETC_MEMO: string;
  BOOK_TM: string;
  GOLF_PLC_NM: string;
  TIME_SEQ: string;
  GOLF_PLC_NO: string;
  BOOK_COURS_NO: string;
  NORMAL_FEE_TRAN: string;
  BOOK_COURS_NM: string;
  PREPAY_YN: 'Y' | 'N';
}

export interface GolfCourseTimeDto {
  timeList: TeeTimeDto[];
  noticeList: unknown[];
  infoList: unknown[];
  RESULT: string;
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

export type GolfCourseApiResponse = ApiSuccess<GolfCourseDto[]> | ApiError;
export type GolfCourseTimesApiResponse = ApiSuccess<GolfCourseTimeDto> | ApiError;
export type TeeTimeDto = TimeDetailDto | GolfCourseTimesDto;

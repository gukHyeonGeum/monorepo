import type { TeeTimeDto } from '@/features/golfCourses/api/types';

export interface TeeTimes {
  SALE_FEE: number;
  NORMAL_FEE: number;
  GOLF_PLC_NO?: number;
  BOOK_DT?: string;
  BOOK_TM: string;
  BOOK_COURS_NM: string;
  TIME_SEQ: string;
  dto: TeeTimeDto;
}

export interface GolfCourse {
  GOLF_PLC_NO: number;
  GOLF_PLC_NM: string;
  REGN_NM: string;
  BOOK_DT: string;
  MIN_SALE_FEE: number;
  ADDR_TRANS: string;
  TIME_COUNT: number;
  TIME_LIST: TeeTimes[];
  images?: string[];
}

export interface Filters {
  regions: string[];
  teeTimes: string[];
  greenFees: string[];
  players: number[];
  paymentMethods: string[];
}

export type SortOption = 'default' | 'teeTime' | 'name';

import type {
  GolfCourseDto,
  GolfCourseTimesDto,
  TeeTimeDto,
} from '@/features/golfCourses/api/types';
import type { GolfCourse, TeeTimes } from '@/features/golfCourses/domain/types';
import { toNumber } from '@/shared/utils/common';

const isGolfCourseTimesDto = (dto: TeeTimeDto): dto is GolfCourseTimesDto => {
  return (dto as GolfCourseTimesDto).GOLF_PLC_NO !== undefined;
};

export const mapCourse = (dto: GolfCourseDto): GolfCourse => ({
  ...dto,
  GOLF_PLC_NO: toNumber(dto.GOLF_PLC_NO),
  TIME_LIST: dto.TIME_LIST.map(mapTeeTimeDtoToTeeTime),
});

export const mapTeeTimeDtoToTeeTime = (dto: TeeTimeDto): TeeTimes => {
  if (isGolfCourseTimesDto(dto)) {
    // GolfCourseTimesDto 처리
    return {
      SALE_FEE: toNumber(dto.SALE_FEE_TRAN),
      NORMAL_FEE: toNumber(dto.NORMAL_FEE_TRAN),
      GOLF_PLC_NO: toNumber(dto.GOLF_PLC_NO),
      BOOK_TM: dto.BOOK_TM,
      BOOK_COURS_NM: dto.BOOK_COURS_NM,
      TIME_SEQ: dto.TIME_SEQ,
      dto,
    };
  } else {
    // TimeDetailDto 처리
    return {
      SALE_FEE: dto.SALE_FEE,
      NORMAL_FEE: toNumber(dto.NORMAL_FEE),
      BOOK_TM: dto.BOOK_TM,
      BOOK_COURS_NM: dto.BOOK_COURS_NM,
      TIME_SEQ: dto.TIME_SEQ,
      dto,
    };
  }
};

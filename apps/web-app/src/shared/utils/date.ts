export const getMonthsRange = (startDate: Date, count: number): Date[] => {
  const months: Date[] = [];
  for (let i = 0; i < count; i++) {
    months.push(new Date(startDate.getFullYear(), startDate.getMonth() + i, 1));
  }
  return months;
};

export const getDaysRange = (startDate: Date, count: number): Date[] => {
  const days: Date[] = [];
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const newDate = new Date(start);
    newDate.setDate(start.getDate() + i);
    days.push(newDate);
  }
  return days;
};

export const isSameDay = (date1: Date, date2: Date): boolean =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

export const formatMonth = (date: Date): string => `${date.getMonth() + 1}월`;

export const formatDay = (date: Date): string => `${date.getDate()}`;

export const formatTime = (strTime: string) => {
  if (strTime.length !== 4) {
    return strTime;
  }
  const hours = strTime.substring(0, 2);
  const minutes = strTime.substring(2, 4);
  return `${hours}:${minutes}`;
};

export const getDayOfWeek = (date: Date): string => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[date.getDay()] || '';
};

export const formatYmd = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
};

export const dateStringToDate = (dateStr: string) => {
  const cleanedDateStr = dateStr.replace(/[-.]/g, '');
  const year = cleanedDateStr.substring(0, 4);
  const month = cleanedDateStr.substring(4, 6);
  const day = cleanedDateStr.substring(6, 8);
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  return date;
};

/**
 * 날짜와 시간 문자열을 'YYYY.MM.DD (요일) HH:mm' 형식으로 변환합니다.
 * 다양한 입력 형식('YYYYMMDD', 'YYYY-MM-DD')과 시간 형식('HHmm', 'HH:mm')을 처리합니다.
 * @param dateStr - 'YYYYMMDD', 'YYYY-MM-DD', 'YYYY.MM.DD' 형식의 날짜 문자열
 * @param timeStr - 'HHmm' 또는 'HH:mm' 형식의 시간 문자열
 * @returns 포맷팅된 날짜 및 시간 문자열. 변환 실패 시 원본 값을 반환합니다.
 */
export const formatFullDateTimeWithDay = (dateStr: string, timeStr: string): string => {
  if (!dateStr || !timeStr) {
    return '';
  }

  const date = dateStringToDate(dateStr);
  if (isNaN(date.getTime())) {
    return `${dateStr} ${timeStr}`;
  }

  // 2. 시간 파싱 (HHmm, HH:mm)
  const cleanedTimeStr = timeStr.replace(/:/g, '');
  if (cleanedTimeStr.length !== 4) {
    // 지원하지 않는 시간 형식이면 원본 반환
    return `${dateStr} ${timeStr}`;
  }
  const hour = cleanedTimeStr.substring(0, 2);
  const minute = cleanedTimeStr.substring(2, 4);

  // 3. 최종 포맷팅
  const dayOfWeek = getDayOfWeek(date);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}.${month}.${day} (${dayOfWeek}) ${hour}:${minute}`;
};

/**
 * 예약일과 취소 규칙을 바탕으로 취소 마감 일시를 계산하고 포맷팅합니다.
 * @param baseDateStr - 'YYYYMMDD' 형식의 예약일 문자열 (예: '20250707')
 * @param cancellationRule - 'DDHHmm' 형식의 취소 규칙 문자열 (예: '031700' -> 3일 전 17:00)
 * @returns 'YYYY.MM.DD (요일) HH:mm' 형식의 취소 마감 일시. 변환 실패 시 빈 문자열을 반환합니다.
 */
export const calculateCancellationDeadline = (
  baseDateStr: string,
  cancellationRule: string
): string => {
  baseDateStr = baseDateStr.trim();
  cancellationRule = cancellationRule.trim();

  // 입력값 유효성 검사
  if (
    !baseDateStr ||
    baseDateStr.length !== 8 ||
    !cancellationRule ||
    cancellationRule.length !== 6
  ) {
    return '';
  }

  try {
    // 1. 예약일 파싱
    const baseDate = dateStringToDate(baseDateStr);

    // 2. 취소 규칙 파싱
    const daysBefore = parseInt(cancellationRule.substring(0, 2), 10);
    const hour = parseInt(cancellationRule.substring(2, 4), 10);
    const minute = parseInt(cancellationRule.substring(4, 6), 10);

    // 3. 마감일 계산
    const deadlineDate = new Date(baseDate);
    deadlineDate.setDate(baseDate.getDate() - daysBefore);
    deadlineDate.setHours(hour, minute, 0, 0);

    // 4. 이전에 만든 공통 함수를 재사용하여 최종 포맷팅
    return formatFullDateTimeWithDay(
      `${deadlineDate.getFullYear()}${(deadlineDate.getMonth() + 1).toString().padStart(2, '0')}${deadlineDate.getDate().toString().padStart(2, '0')}`,
      `${deadlineDate.getHours().toString().padStart(2, '0')}${deadlineDate.getMinutes().toString().padStart(2, '0')}`
    );
  } catch (error) {
    console.error('Failed to calculate cancellation deadline:', error);
    return ''; // 에러 발생 시 빈 문자열 반환
  }
};

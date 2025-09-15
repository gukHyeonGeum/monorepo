import React, { useState } from 'react';
import { ChevronRightIcon } from '@/shared/components/icons';
import { useGolfStore } from '@/shared/store/createStore';
import { Button, Checkbox } from '@/shared/components/ui';
import { dateStringToDate, formatFullDateTimeWithDay } from '@/shared/utils/date';
import { useUserStore } from '@/shared/store/userStore';
import { phoneFormat } from '@/shared/utils/common';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBooking,
  type CreateBookingPayload,
} from '@/features/golfCourseBookings/api/mutations';
import { fetchGolfCourses, fetchGolfCourseTimes } from '@/features/golfCourses/api/queries';
import type { GolfCourse, TeeTimes } from '@/features/golfCourses/domain/types';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { showAlert } from '@/shared/store/alertStore';
import BookingConfirmationModal from '../components/BookingConfirmationModal';
import TermsModal from '@/features/golfCourseBookings/components/TermsModal';
import InfoRow from '@/features/golfCourseBookings/components/InfoRow';
import PaymentRow from '@/features/golfCourseBookings/components/PaymentRow';

const AgreementRow = ({
  checked,
  onToggle,
  onView,
  label,
  isMain = false,
}: {
  checked: boolean;
  onToggle: () => void;
  onView?: () => void;
  label: React.ReactNode;
  isMain?: boolean;
}) => {
  return (
    <div className={`flex items-center ${isMain ? '' : 'pl-4'}`}>
      <Checkbox checked={checked} onClick={onToggle} aria-checked={checked} />
      <button
        onClick={isMain ? onToggle : onView}
        className="flex-1 flex justify-between items-center ml-2 text-left"
        aria-label={isMain ? 'Agree to all terms' : 'View terms details'}
      >
        <span className={`cursor-pointer ${isMain ? 'font-bold' : 'text-sm text-gray-600'}`}>
          {label}
        </span>
        {!isMain && <ChevronRightIcon className="w-5 h-5 text-gray-400" />}
      </button>
    </div>
  );
};

const ReservationPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { golfCourseId, bookDt, teeTimeSeq } = useParams<{
    golfCourseId: string;
    bookDt: string;
    teeTimeSeq: string;
  }>();

  const initialCourse = useGolfStore((state) => state.reservationDetails?.course);
  const initialTeeTime = useGolfStore((state) => state.reservationDetails?.teeTime);
  const bookingConfirmedDetails = useGolfStore((state) => state.bookingConfirmedDetails);
  const { viewTerms, confirmBooking, closeBookingConfirmation } = useGolfStore.getState();

  const user = useUserStore((state) => state.user);

  const [isTerms, setIsTerms] = useState(false);
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
  });

  const { data: courseData, isPending: isCourseLoading } = useQuery({
    queryKey: ['golfCourse', bookDt],
    queryFn: () => fetchGolfCourses(dateStringToDate(bookDt!)),
    enabled: !!bookDt,
    staleTime: 5 * 60 * 1000,
    select: (courses: GolfCourse[]) => {
      const course = courses.find((c) => c.GOLF_PLC_NO === parseInt(golfCourseId!, 10));
      return course;
    },
    initialData: () => {
      const cachedCourses = queryClient.getQueryData<GolfCourse[]>(['golfCourses', bookDt]);
      if (cachedCourses) return cachedCourses;
      return undefined;
    },
  });

  const { data: teeTimesData, isPending: isTeeTimesLoading } = useQuery({
    queryKey: ['golfCourseTimes', parseInt(golfCourseId!, 10), bookDt],
    queryFn: () => fetchGolfCourseTimes(dateStringToDate(bookDt!), parseInt(golfCourseId!, 10)),
    enabled: !!golfCourseId && !!bookDt,
    staleTime: 5 * 60 * 1000,
    select: (teeTimes: TeeTimes[]) => {
      const teeTime = teeTimes.find((t) => t.TIME_SEQ === teeTimeSeq);
      return teeTime;
    },
    initialData: () => {
      const cachedTimes = queryClient.getQueryData<TeeTimes[]>([
        'golfCourseTimes',
        parseInt(golfCourseId!, 10),
        bookDt,
      ]);
      if (cachedTimes) return cachedTimes;
      return undefined;
    },
  });

  const data = { course: courseData, teeTime: teeTimesData };
  const { course, teeTime } = data || { course: initialCourse, teeTime: initialTeeTime };

  const { mutateAsync: bookTeeTimeAsync, isPending } = useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['golfCourseBookings', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['golfCourses', bookDt] });
      confirmBooking(data.bookingId);
    },
    onError: (error) => {
      showAlert({
        title: '예약 신청 불가',
        message: error.message,
      });
    },
  });

  if (isCourseLoading || isTeeTimesLoading || !course || !teeTime || !user) {
    return null;
  }

  const caddyFee = 0;
  const players = 4;
  const greenFeeTotal = teeTime.SALE_FEE * players;
  const totalAmount = greenFeeTotal + caddyFee;

  const dateString = formatFullDateTimeWithDay(bookDt!, teeTime.BOOK_TM);

  const handleAgreementChange = (type: 'all' | 'terms' | 'privacy') => {
    setAgreements((currentAgreements) => {
      if (type === 'all') {
        const newValue = !currentAgreements.all;
        return { all: newValue, terms: newValue, privacy: newValue };
      } else {
        const newAgreements = { ...currentAgreements, [type]: !currentAgreements[type] };
        const allChecked = newAgreements.terms && newAgreements.privacy;
        return { ...newAgreements, all: allChecked };
      }
    });
  };

  const handleBooking = async () => {
    if (user && course && teeTime) {
      const payload: CreateBookingPayload = {
        mbr_key: user.id,
        golf_plc_no: course.GOLF_PLC_NO,
        book_cours_no: teeTime.dto.BOOK_COURS_NO,
        book_dt: bookDt!,
        time_seq: teeTime.dto.TIME_SEQ,
        book_tm: teeTime.BOOK_TM.replace(':', ''),
        rsrv_psnn: players,
        cp_rsrvr_name: user.realname,
        cp_rsrvr_phone: user.phone,
        wkday_wkend_dv: teeTime.dto.WKDAY_WKEND_DV,
      };
      await bookTeeTimeAsync(payload);
    }
  };

  const handleConfirm = () => {
    if (!agreements.terms || !agreements.privacy) {
      showAlert({
        title: '필수 약관 동의',
        message: '예약을 위해서는 필수 약관에 동의하셔야 합니다.',
      });
      return;
    }

    showAlert({
      title: '예약 신청 확인',
      message: '예약을 진행하시겠습니까?',
      onConfirm: handleBooking,
      cancelText: '취소',
      confirmText: '예약하기',
    });
    return;
  };

  const handleBookingConfirmationClose = () => {
    queryClient.invalidateQueries({
      queryKey: ['golfCourseTimes', parseInt(golfCourseId!, 10), bookDt],
    });
    closeBookingConfirmation();
    navigate('/golf-courses/booking', { replace: true });
  };

  const handleAgreementOpen = (type: 'cancellation' | 'privacy') => {
    viewTerms(type);
    setIsTerms(true);
  };

  return (
    <div className="absolute inset-0 bg-gray-100 z-30 font-sans overflow-y-auto">
      <PageHeader title="예약하기" onBackClick={() => navigate(-1)} className="sticky top-0 z-20" />

      <main className="pb-24">
        {/* Booking Info */}
        <div className="bg-white p-4">
          <div className="flex items-center">
            <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded">
              현장결제
            </span>
            <h2 className="text-xl font-bold ml-2">{course.GOLF_PLC_NM}</h2>
          </div>
          <div className="mt-4 space-y-2">
            <InfoRow label="티타임" value={`${dateString}`} />
            <InfoRow label="코스 정보" value={teeTime.BOOK_COURS_NM} />
            <InfoRow label="그린피(1인)" value={`${teeTime.SALE_FEE.toLocaleString()}원`} />
            <InfoRow label="내장조건" value={`${players}인`} isValueBold={true} />
          </div>
        </div>

        {/* Booker Info */}
        <div className="bg-white p-4 mt-2">
          <h3 className="font-bold text-lg">예약자 정보</h3>
          <div className="mt-4 space-y-2">
            <InfoRow label="이름" value={user.realname} />
            <InfoRow label="연락처" value={phoneFormat(user.phone)} />
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white p-4 mt-2">
          <h3 className="font-bold text-lg">결제정보</h3>
          <div className="mt-4 space-y-2">
            <PaymentRow label="현장 결제 예상 금액" amount={totalAmount} isTotal={true} />
            <PaymentRow label="ㄴ 그린피" amount={greenFeeTotal} />
            {/* <PaymentRow label="ㄴ 카트피" amount={0} />
            <PaymentRow label="ㄴ 캐디피" amount={caddyFee} /> */}
            <InfoRow label="결제방식" value="현장결제" />
          </div>
          <p className="text-xs text-gray-400 mt-4 bg-gray-100 p-3 rounded-md">
            *티샷 실시간 예약은,{' '}
            <img
              src={`${import.meta.env.BASE_URL}/sbsGolf-logo.png`}
              alt="sbsGolf"
              className="h-2.5 inline-block"
            />{' '}
            제휴 부킹타임을 통해 제공됩니다. 예약 확정 및 취소/위약에 대한 규정은 해당 골프장 및
            SBS골프 정책을 따릅니다.
          </p>
        </div>

        {/* Notices */}
        <div className="bg-white p-4 mt-2">
          <h3 className="font-bold text-lg">골프장 예약 공지</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
            <li>금액구성: 그린피(카트피, 캐디피 제외)</li>
            <li>내장기준: 4인필수 (인원 미충족시 4인 요금 발생)</li>
            <li>기상악화로 인한 홀 아웃 시 &apos;골프장 정상가 기준&apos; 홀별 정산</li>
            <li>지역주민, 회원권, 기타 골프장 할인 이벤트 중복 적용 불가</li>
          </ul>
        </div>

        {/* Terms */}
        <div className="bg-white p-4 mt-2">
          <div className="space-y-2">
            <AgreementRow
              checked={agreements.all}
              onToggle={() => handleAgreementChange('all')}
              label="골프장 위약규정과 티샷 서비스 개인정보 이용 전체 동의"
              isMain={true}
            />
            <div className="pt-1 space-y-1">
              <AgreementRow
                checked={agreements.terms}
                onToggle={() => handleAgreementChange('terms')}
                onView={() => handleAgreementOpen('cancellation')}
                label={
                  <span>
                    <span className="text-blue-500">[필수]</span> 골프장 취소/위약규정 동의
                  </span>
                }
              />
              <AgreementRow
                checked={agreements.privacy}
                onToggle={() => handleAgreementChange('privacy')}
                onView={() => handleAgreementOpen('privacy')}
                label={
                  <span>
                    <span className="text-blue-500">[필수]</span> 개인정보 제3자 제공 동의
                  </span>
                }
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            *상기 동의 사항은 예약 서비스 이용을 위한 최소한의 정보로써, 미동의 시 예약이
            불가합니다.
          </p>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t">
        <Button onClick={handleConfirm} disabled={isPending} size="lg" className="w-full">
          {isPending ? '예약 중...' : '현장결제 예약하기'}
        </Button>
      </footer>

      <BookingConfirmationModal
        isOpen={!!bookingConfirmedDetails}
        onOpenChange={(isOpen) => !isOpen && handleBookingConfirmationClose()}
      />

      <TermsModal isOpen={isTerms} onOpenChange={setIsTerms} />
    </div>
  );
};

export default ReservationPage;

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CopyIcon } from '@/shared/components/icons';
import { Button } from '@/shared/components/ui';
import { useUserStore } from '@/shared/store/userStore';
import { fetchGolfCourseBookings } from '@/features/golfCourseBookings/api/queries';
import type { Booking } from '@/features/golfCourseBookings/domain/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import CancelConfirmationModal from '@/features/golfCourseBookings/components/CancelConfirmationModal';
import { cancelBooking } from '@/features/golfCourseBookings/api/mutations';
import { calculateCancellationDeadline, formatFullDateTimeWithDay } from '@/shared/utils/date';
import { phoneFormat } from '@/shared/utils/common';
import { useGolfStore, type GolfState } from '@/shared/store/createStore';
import { showAlert } from '@/shared/store/alertStore';
import InfoRow from '@/features/golfCourseBookings/components/InfoRow';
import PaymentRow from '@/features/golfCourseBookings/components/PaymentRow';

const BookingDetailPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const copyToClipboard = useGolfStore((state: GolfState) => state.copyToClipboard);

  const user = useUserStore((state) => state.user);

  const {
    data: booking,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['golfCourseBookings', user?.id],
    queryFn: () => fetchGolfCourseBookings(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시
    select: (data: Booking[]) => {
      return data.find((b) => b.id.toString() === bookingId);
    },
  });

  const { mutate: performCancel, isPending: isCancelling } = useMutation({
    mutationFn: (variables: { id: string; userId: number }) =>
      cancelBooking(variables.id, variables.userId),
    onSuccess: () => {
      // 예약 목록 쿼리를 무효화하여 최신 데이터를 다시 가져옵니다.
      queryClient.invalidateQueries({ queryKey: ['golfCourseBookings', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['golfCourses'] });
      queryClient.invalidateQueries({ queryKey: ['golfCourseTimes'] });
      setIsCancelModalOpen(false);
      showAlert({
        title: '예약 취소 완료',
        message: `**예약이 취소되었습니다.**\n- ###### *예약취소 경고 안내\n- ###### 동일 사유로 예약 취소 누적 2회 발생시 예약이 제한될 수 있습니다. 예약에 신중을 기해주시기 바랍니다`,
      });
      useGolfStore.setState({ initialHistoryTab: 'cancelled' });
      navigate(-1);
    },
    onError: (error) => {
      showAlert({
        title: '예약 취소 실패',
        message: error.message,
      });
      setIsCancelModalOpen(false);
    },
  });

  const handleConfirmCancellation = () => {
    if (booking && user?.id) {
      performCancel({ id: booking.id, userId: user?.id });
    } else {
      showAlert({
        title: '예약 취소 실패',
        message: '사용자 정보가 없어 예약을 취소할 수 없습니다.',
      });
    }
  };

  return (
    <div className="absolute inset-0 bg-gray-100 z-40 font-sans overflow-y-auto">
      <PageHeader title="예약상세" />

      {isLoading ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center">
          예약 정보를 불러오는 중...
        </div>
      ) : isError || !booking ? (
        <div className="text-center text-red-500 p-8">데이터를 불러오는데 실패했습니다</div>
      ) : (
        <>
          <main className="pb-24">
            <div className="relative w-full">
              {booking.courseImage && (
                <img
                  src={booking.courseImage}
                  alt={`${booking.courseName} view`}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="relative bottom-0 left-0 right-0 p-4">
                <div className="flex items-center text-black text-sm">
                  <span className="px-2 py-1 bg-gray-700 bg-opacity-80 rounded-sm text-white text-xs font-semibold">
                    현장결제
                  </span>
                  <h2 className="text-xl font-bold ml-2">{booking.courseName}</h2>
                </div>
                <button
                  onClick={() => copyToClipboard(booking.id)}
                  className="flex items-center text-black text-sm mt-2 hover:text-gray-200 transition-colors"
                  aria-label="Copy reservation number"
                >
                  <span>예약번호: {booking.id}</span>
                  <CopyIcon className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>

            <div className="bg-white p-4 space-y-2">
              <InfoRow
                label="티타임"
                value={formatFullDateTimeWithDay(booking.date, booking.time)}
              />
              <InfoRow label="코스 정보" value={booking.courseLayout} />
              <InfoRow
                label="그린피(1인)"
                value={`${(booking.greenFee / booking.conditions).toLocaleString()}원`}
              />
              <InfoRow label="내장조건" value={`${booking.conditions}인`} isValueBold={true} />
            </div>

            <div className="bg-white p-4 mt-2">
              <p className="font-bold text-sm text-gray-800">예약 취소 가능 기한</p>
              <p className="font-semibold text-blue-500">
                {calculateCancellationDeadline(
                  booking.date.trim(),
                  booking.cancellationDeadline.trim()
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                *기한 경과 후 취소시, 위약금과 페널티가 발생합니다.
              </p>
            </div>

            <div className="bg-white p-4 mt-2 ">
              <h3 className="font-bold text-lg">예약자 정보</h3>
              <div className="mt-2 space-y-2">
                <InfoRow label="이름" value={booking.bookerName} />
                <InfoRow label="연락처" value={phoneFormat(booking.bookerPhone)} />
              </div>
            </div>

            <div className="bg-white p-4 mt-2">
              <h3 className="font-bold text-lg">결제정보</h3>
              <div className="mt-2 space-y-2">
                <PaymentRow label="현장 결제 예상 금액" amount={booking.greenFee} isTotal={true} />
                <PaymentRow label="ㄴ 그린피" amount={booking.greenFee} />
                {/* <PaymentRow label="ㄴ 카트피" amount={booking.cartFee || 0} />
                  <PaymentRow label="ㄴ 캐디피" amount={booking.caddyFee || 0} /> */}
                <InfoRow label="결제방식" value={booking.paymentMethod || '현장결제'} />
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
          </main>

          <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t">
            {booking.status === 1 ? (
              <Button
                onClick={() => setIsCancelModalOpen(true)}
                variant="outline"
                size="lg"
                className="w-full"
              >
                {isCancelling ? '예약 취소 중...' : '예약 취소하기'}
              </Button>
            ) : (
              <Button variant="secondary" size="lg" className="w-full bg-gray-400" disabled>
                예약 취소 완료
              </Button>
            )}
          </footer>
        </>
      )}

      <CancelConfirmationModal
        isOpen={isCancelModalOpen}
        onOpenChange={setIsCancelModalOpen}
        onConfirm={handleConfirmCancellation}
        booking={booking || null}
        isPending={isCancelling}
      />
    </div>
  );
};

export default BookingDetailPage;

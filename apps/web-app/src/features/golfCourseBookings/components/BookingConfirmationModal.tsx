import { ClipboardIcon } from '@/shared/components/icons';
import { useGolfStore } from '@/shared/store/createStore';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui';
import { formatFullDateTimeWithDay } from '@/shared/utils/date';
import { useUserStore } from '@/shared/store/userStore';
import { phoneFormat } from '@/shared/utils/common';
import InfoRow from '@/features/golfCourseBookings/components/InfoRow';
import PaymentRow from '@/features/golfCourseBookings/components/PaymentRow';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const BookingConfirmationModal = ({ isOpen, onOpenChange }: BookingConfirmationModalProps) => {
  const course = useGolfStore((state) => state.bookingConfirmedDetails?.course);
  const teeTime = useGolfStore((state) => state.bookingConfirmedDetails?.teeTime);
  const bookingId = useGolfStore((state) => state.bookingConfirmedDetails?.bookingId);
  const user = useUserStore((state) => state.user);

  if (!isOpen || !course || !teeTime) return null;

  const reservationNumber = bookingId;
  const caddyFee = 0;
  const players = 4;
  const greenFeeTotal = teeTime.SALE_FEE * players;
  const totalAmount = greenFeeTotal + caddyFee;

  const teeTimeDate = formatFullDateTimeWithDay(course.BOOK_DT, teeTime.BOOK_TM);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-100 rounded-xl shadow-2xl z-50 max-w-sm transform transition-transform duration-300 overflow-hidden">
        <DialogHeader className="pt-12 p-6 bg-white text-left">
          <DialogTitle>{course.GOLF_PLC_NM} 예약이 완료되었습니다.</DialogTitle>
          <p className="text-sm text-gray-600 mt-1">{teeTimeDate} 티오프 확정</p>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <InfoRow
              label="예약번호"
              value={
                <div className="flex items-center">
                  <span>{reservationNumber}</span>
                  <button className="ml-2 text-gray-500 hover:text-teal-600">
                    <ClipboardIcon className="w-4 h-4" />
                  </button>
                </div>
              }
            />
            <InfoRow
              label="예약자 정보"
              value={`${user?.realname} (${phoneFormat(user!.phone)})`}
            />
            <InfoRow label="티타임" value={teeTimeDate} />
            <InfoRow label="코스명/홀 정보" value={`${teeTime.BOOK_COURS_NM}`} />
            <InfoRow label="내장조건" value={`4인`} isValueBold={true} />
          </div>

          <div className="space-y-2 pt-4 border-t">
            <PaymentRow label="현장 결제 예상 금액" amount={totalAmount} isTotal={true} />
            <PaymentRow label="ㄴ 그린피" amount={greenFeeTotal} />
            {/* <PaymentRow label="ㄴ 카트피" amount={0} />
            <PaymentRow label="ㄴ 캐디피" amount={caddyFee} /> */}
            <InfoRow label="결제방식" value="현장결제" />
          </div>

          {/* <div className="bg-white p-3 rounded-lg mt-2">
              <p className="text-teal-600 font-bold text-sm">예약 취소 가능 기한</p>
              <p className="text-teal-600 font-bold text-sm"> 까지</p>
              <p className="text-xs text-gray-500 mt-1">*기한 경과 후 취소시, 위약금과 페널티가 발생합니다.</p>
          </div> */}
        </div>

        <DialogFooter className="bg-gray-200 p-4">
          <Button onClick={() => onOpenChange(false)} size="lg" className="w-full">
            예약내역 바로가기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmationModal;

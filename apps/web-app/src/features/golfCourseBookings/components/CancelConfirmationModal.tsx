import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui';
import type { Booking } from '../domain/types';
import { calculateCancellationDeadline, formatFullDateTimeWithDay } from '@/shared/utils/date';

interface CancelConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  booking: Booking | null;
  isPending: boolean;
}

const CancelConfirmationModal = ({
  isOpen,
  onOpenChange,
  onConfirm,
  booking,
  isPending,
}: CancelConfirmationModalProps) => {
  if (!isOpen || !booking) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>예약 취소 확인</DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-0 space-y-4">
          <div className="space-y-3 pt-4 text-sm text-gray-700 border-t-2 border-gray-100">
            <div className="flex justify-between">
              <span className="w-24 text-gray-600">골프장명</span>
              <strong>{booking.courseName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="w-24 text-gray-600">티타임</span>
              <strong>{formatFullDateTimeWithDay(booking.date, booking.time)}</strong>
            </div>
            <div className="flex justify-between">
              <span className="w-24 text-gray-600">코스명/홀 정보</span>
              <strong>{booking.courseLayout}</strong>
            </div>
            <div className="flex justify-between">
              <span className="w-24 text-gray-600">내장인원</span>
              <strong>4명</strong>
            </div>
            <div className="flex">
              <span className="w-24 text-gray-500">내장조건</span>
              <strong>4인</strong>
            </div>
          </div>

          <div className="space-y-3 text-sm border-t-2 border-gray-100 pt-4">
            <div className="flex justify-between">
              <p className="text-gray-600">결제방식</p>
              <p className="font-semibold text-gray-800">{booking.paymentMethod || '현장결제'}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">취소 가능 기한</p>
              <p className="font-semibold text-blue-500">
                {calculateCancellationDeadline(booking.date, booking.cancellationDeadline)}
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-500 bg-gray-100 p-3 rounded-md">
            * 취소 기한 이후 예약 취소 시, 위약금이 발생할 수 있습니다.
          </p>
        </div>

        <DialogFooter className="flex space-x-3 p-6 pt-0">
          <Button
            onClick={() => onOpenChange(false)}
            variant="secondary"
            className="flex-1"
            disabled={isPending}
          >
            닫기
          </Button>
          <Button onClick={onConfirm} className="flex-1" disabled={isPending}>
            {isPending ? '취소 처리 중...' : '취소하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelConfirmationModal;

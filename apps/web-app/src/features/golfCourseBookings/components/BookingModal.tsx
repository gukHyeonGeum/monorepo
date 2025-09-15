import type { GolfCourse, TeeTimes } from '@/features/golfCourses/domain/types';
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  Badge,
  SheetFooter,
} from '@/shared/components/ui';
import { XIcon } from '@/shared/components/icons';
import { formatFullDateTimeWithDay } from '@/shared/utils/date';

interface BookingModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  course: GolfCourse | null;
  teeTime: TeeTimes | null;
  selectDate: string;
}

const BookingModal = ({
  isOpen,
  onOpenChange,
  onConfirm,
  course,
  teeTime,
  selectDate,
}: BookingModalProps) => {
  if (!isOpen || !course || !teeTime || !selectDate || !teeTime.BOOK_DT) {
    return null;
  }

  const dateString = formatFullDateTimeWithDay(teeTime.BOOK_DT!, teeTime.BOOK_TM);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <div className="flex flex-col text-left">
            <SheetTitle className="mt-2">
              <Badge className="py-1 bg-black! text-white rounded-sm">현장결제</Badge>{' '}
              {course.GOLF_PLC_NM}
            </SheetTitle>
          </div>
          <SheetClose>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800 -mr-2">
              <XIcon className="w-6 h-6" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="px-4 space-y-4">
          <div className="pt-4">
            <p className="text-gray-800">{dateString}</p>
            <div className="flex justify-between items-end mt-1">
              <span className="text-sm text-gray-500">{teeTime.BOOK_COURS_NM}</span>
              <span className="text-lg font-bold text-orange-500">
                {teeTime.SALE_FEE.toLocaleString()}원
              </span>
            </div>
          </div>

          <div className="border-t pt-4 pb-8">
            <p className="text-sm font-semibold text-gray-800">내장조건</p>
            <div className="flex space-x-2 mt-2">
              <Badge variant="outline" className="rounded-sm py-1">
                4인이상
              </Badge>
            </div>
          </div>
        </div>

        <SheetFooter className="border-none">
          <Button onClick={onConfirm} size="lg" className="w-full">
            예약하기
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BookingModal;

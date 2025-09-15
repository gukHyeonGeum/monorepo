import type { Booking } from '@/features/golfCourseBookings/domain/types';
import { ClipboardIcon } from '@/shared/components/icons';
import { Button, Badge, Card, CardContent, CardFooter, CardHeader } from '@/shared/components/ui';
import { formatFullDateTimeWithDay } from '@/shared/utils/date';

interface BookingCardProps {
  booking: Booking;
  onViewDetails: (booking: Booking) => void;
}

const BookingCard = ({ booking, onViewDetails }: BookingCardProps) => {
  const statusInfo = [
    { text: '라운드예정', variant: 'scheduled' as const },
    { text: '라운드취소', variant: 'secondary' as const },
    { text: '라운드종료', variant: 'secondary' as const },
  ];
  const currentStatus = statusInfo[booking.status - 1];

  return (
    <Card className="mb-3">
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
          <Badge variant={currentStatus?.variant} className="rounded-sm py-1">
            {currentStatus?.text}
          </Badge>
          <div className="flex items-center text-sm text-gray-500">
            <ClipboardIcon className="w-4 h-4 mr-1" />
            <span>예약번호: {booking.id}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800">{booking.courseName}</h3>
            <p className="text-gray-600 mt-1">
              {formatFullDateTimeWithDay(booking.date, booking.time)}
            </p>
            <p className="text-sm text-gray-500">{booking.courseLayout}</p>
          </div>
          <div className="w-20 h-20 rounded-md overflow-hidden ml-4 flex-shrink-0">
            {booking.courseImage && (
              <img
                src={booking.courseImage}
                alt={booking.courseName}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-sm font-semibold text-gray-700">내장조건</p>
          <div className="flex space-x-2 mt-2">
            <Badge variant="outline" className="rounded-sm py-1">
              {booking.conditions}인
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={() => onViewDetails(booking)} variant="outline" className="w-full">
          예약상세
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingCard;

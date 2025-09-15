import type { TeeTimes } from '@/features/golfCourses/domain/types';
import { Button } from '@/shared/components/ui';

interface TeeTimeListProps {
  teeTimes: TeeTimes[];
}

const TeeTimeList = ({ teeTimes }: TeeTimeListProps) => {
  return (
    <div className="flex overflow-x-auto no-scrollbar space-x-2 px-4">
      {teeTimes.map((teeTime, index) => (
        <Button
          variant="outline"
          key={index}
          className="flex-shrink-0 flex flex-col items-center justify-center p-3 w-28 h-20 text-center hover:border-teal-500 hover:bg-teal-50"
        >
          <span className="font-semibold text-gray-800">{teeTime.BOOK_TM}</span>
          <span className="text-sm text-orange-500 font-bold mt-1">
            {teeTime.SALE_FEE.toLocaleString()}원
          </span>
        </Button>
      ))}
    </div>
  );
};

export default TeeTimeList;

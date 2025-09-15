import type { GolfCourse } from '@/features/golfCourses/domain/types';
import TeeTimeList from './TeeTimeList';
import { ChevronUpIcon } from '@/shared/components/icons';
import { Card } from '@/shared/components/ui';

interface GolfCourseItemProps {
  course: GolfCourse;
  onSelect: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const GolfCourseItem = ({ course, onSelect, isExpanded, onToggle }: GolfCourseItemProps) => {
  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <Card>
      <div
        className="p-4 cursor-pointer"
        onClick={onSelect}
        role="button"
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onSelect();
        }}
        tabIndex={0}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-gray-800">{course.GOLF_PLC_NM}</h3>
            <p className="text-sm text-gray-500">{course.ADDR_TRANS}</p>
          </div>
          <button
            onClick={handleToggleClick}
            className="flex items-center text-sm text-gray-600 p-2 -m-2 rounded-md hover:bg-gray-100 focus:outline-none"
            aria-label={isExpanded ? 'Hide tee times' : 'Show tee times'}
          >
            <span className="text-base font-bold text-green-900">{course.TIME_COUNT}팀</span>
            <ChevronUpIcon
              className={`w-5 h-5 ml-1 transition-transform duration-200 ${!isExpanded ? 'transform rotate-180' : ''}`}
            />
          </button>
        </div>
        <p className="mt-2 text-xl font-bold text-orange-500">
          {course.MIN_SALE_FEE.toLocaleString()}원~
        </p>
      </div>
      {isExpanded && (
        <div className="pb-4 border-gray-100" onClick={onSelect}>
          <TeeTimeList teeTimes={course.TIME_LIST} />
        </div>
      )}
    </Card>
  );
};

export default GolfCourseItem;

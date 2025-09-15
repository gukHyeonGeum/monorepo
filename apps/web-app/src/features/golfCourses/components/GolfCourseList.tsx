import { useRef, useCallback } from 'react';
import GolfCourseItem from './GolfCourseItem';
import { useGolfStore, type GolfState } from '@/shared/store/createStore';
import type { GolfCourse } from '../domain/types';
import { useNavigate } from 'react-router-dom';

const MoreCoursesLoader = () => (
  <div className="flex justify-center items-center p-4 text-gray-600">
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-teal-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <span>불러오는 중...</span>
  </div>
);

const GolfCourseList = () => {
  const navigate = useNavigate();
  const golfCourses = useGolfStore((state: GolfState) => state.golfCourses);
  const hasMore = useGolfStore((state: GolfState) => state.hasMore);
  const loadingMore = useGolfStore((state: GolfState) => state.loadingMore);
  const expandedCourseId = useGolfStore((state: GolfState) => state.expandedCourseId);

  const { selectCourse, toggleCourse, loadMoreCourses } = useGolfStore.getState();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastCourseElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasMore) {
          loadMoreCourses();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore, loadMoreCourses]
  );

  const handleSelectCourse = (course: GolfCourse) => {
    selectCourse(course);
    navigate(`/golf-courses/${course.GOLF_PLC_NO}/${course.BOOK_DT}/detail`);
  };

  if (golfCourses.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">이 날짜에 이용 가능한 골프장이 없습니다.</div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {golfCourses.map((course) => (
          <GolfCourseItem
            key={course.GOLF_PLC_NO}
            course={course}
            onSelect={() => handleSelectCourse(course)}
            isExpanded={expandedCourseId === course.GOLF_PLC_NO}
            onToggle={() => toggleCourse(course.GOLF_PLC_NO)}
          />
        ))}
      </div>
      <div ref={lastCourseElementRef} style={{ height: '1px' }} />
      {loadingMore && <MoreCoursesLoader />}
    </>
  );
};

export default GolfCourseList;

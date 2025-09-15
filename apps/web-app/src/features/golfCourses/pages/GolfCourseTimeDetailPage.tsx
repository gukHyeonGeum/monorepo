import { useState, useMemo, useRef, useEffect } from 'react';
import type { GolfCourse, TeeTimes } from '@/features/golfCourses/domain/types';
import { ShareIcon, PhoneIcon, MapPinIcon, ClockIcon } from '@/shared/components/icons';
import { dateStringToDate, formatTime, formatYmd, isSameDay } from '@/shared/utils/date';
import DateSelector from '@/features/golfCourses/components/DateSelector';
import BookingModal from '../../golfCourseBookings/components/BookingModal';
import { fetchGolfCourseTimes } from '@/features/golfCourses/api/queries';
import { useGolfStore } from '@/shared/store/createStore';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/shared/components/ui';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { useRequireAuth } from '@/shared/hooks/useRequireAuth';
import { useNavigate, useParams } from 'react-router-dom';

const ImageCarousel = ({
  images,
  currentImage,
  setCurrentImage,
}: {
  images: string[];
  currentImage: number;
  setCurrentImage: (index: number) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const debounce = (func: (...args: unknown[]) => void, delay: number) => {
    let timeout: number;
    return (...args: unknown[]) => {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => func.apply(this, args), delay);
    };
  };

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const handleScroll = debounce(() => {
      const imageWidth = scroller.clientWidth;
      const newIndex = Math.round(scroller.scrollLeft / imageWidth);
      setCurrentImage(newIndex);
    }, 150);

    scroller.addEventListener('scroll', handleScroll);
    return () => scroller.removeEventListener('scroll', handleScroll);
  }, [setCurrentImage]);

  return (
    images.length > 0 && (
      <div className="relative w-full aspect-[16/9] bg-gray-200">
        <div
          ref={scrollRef}
          className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
        >
          {images?.map((img, index) => (
            <img
              key={img}
              src={img}
              alt={`view ${index + 1}`}
              className="w-full h-full object-cover flex-shrink-0 snap-center"
            />
          ))}
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
          {currentImage + 1} / {images?.length}
        </div>
      </div>
    )
  );
};

const TimeFilterBar = ({
  course,
  timeFilters,
  activeTimeFilter,
  setActiveTimeFilter,
}: {
  course: GolfCourse;
  timeFilters: string[];
  activeTimeFilter: string;
  setActiveTimeFilter: (filter: string) => void;
}) => (
  <div className="px-4 py-3 flex justify-between items-center border-b">
    <span className="text-sm text-gray-500">
      티타임 <span className="font-bold text-teal-600">{course.TIME_LIST.length}</span>
    </span>
    <div className="flex space-x-1">
      {timeFilters.map((filter) => (
        <Button
          key={filter}
          size="sm"
          variant={activeTimeFilter === filter ? 'default' : 'outline'}
          onClick={() => setActiveTimeFilter(filter)}
          className="rounded-full text-xs font-normal h-8!"
        >
          {filter}
        </Button>
      ))}
    </div>
  </div>
);

const CourseInfoView = ({
  course,
  recommendations,
}: {
  course: GolfCourse;
  recommendations: GolfCourse[];
}) => (
  <div className="p-4">
    <h2 className="text-xl font-bold">{course.GOLF_PLC_NM}</h2>
    <p className="text-gray-500 mt-1">{course.ADDR_TRANS}</p>
    <p className="mt-4 text-gray-700 leading-relaxed">{course.REGN_NM}</p>
    <div className="hidden">
      <div className="grid grid-cols-3 gap-2 mt-6 text-center">
        <Button variant="outline" className="flex flex-col items-center justify-center p-3 h-auto">
          <PhoneIcon className="w-6 h-6 text-gray-600" />
          <span className="text-sm mt-1">전화</span>
        </Button>
        <Button variant="outline" className="flex flex-col items-center justify-center p-3 h-auto">
          <MapPinIcon className="w-6 h-6 text-gray-600" />
          <span className="text-sm mt-1">지도</span>
        </Button>
        <Button variant="outline" className="flex flex-col items-center justify-center p-3 h-auto">
          <ShareIcon className="w-6 h-6 text-gray-600" />
          <span className="text-sm mt-1">공유</span>
        </Button>
      </div>
    </div>

    <div className="mt-8 pt-6 border-t">
      <h3 className="text-lg font-bold">주변 골프장 추천</h3>
      <div className="flex overflow-x-auto no-scrollbar space-x-3 mt-4">
        {recommendations.map((rec) => (
          <div key={rec.GOLF_PLC_NO} className="flex-shrink-0 w-40">
            {rec.images !== undefined && rec.images.length > 0 && (
              <div className="w-full aspect-4/3 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={rec.images[0]}
                  alt={rec.GOLF_PLC_NM}
                  className="w-full h-28 object-cover"
                />
              </div>
            )}
            <h4 className="font-semibold mt-2 truncate">{rec.GOLF_PLC_NM}</h4>
            <p className="text-sm text-gray-500">{rec.ADDR_TRANS}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TeeTimeLoader = () => (
  <div className="p-4 space-y-2 bg-gray-100 min-h-[200px] flex items-center justify-center">
    <div className="flex items-center text-gray-500">
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
      <span>티타임 정보를 불러오는 중...</span>
    </div>
  </div>
);

const TeeTimeView = ({
  course,
  teeTimes,
  activeTimeFilter,
  onBook,
}: {
  course: GolfCourse;
  teeTimes: TeeTimes[];
  activeTimeFilter: string;
  onBook: (teeTime: TeeTimes) => void;
}) => {
  const timeRangeMap: { [key: string]: string } = {
    새벽: '~7시',
    오전: '7-12시',
    오후: '12-16시',
    야간: '16시~',
  };

  const filteredTeeTimes = useMemo(() => {
    return teeTimes.filter((tt) => {
      const hour = parseInt(tt.BOOK_TM.split(':')[0]!, 10);
      if (activeTimeFilter === '새벽' && hour < 7) return true;
      if (activeTimeFilter === '오전' && hour >= 7 && hour < 12) return true;
      if (activeTimeFilter === '오후' && hour >= 12 && hour < 16) return true;
      if (activeTimeFilter === '야간' && hour >= 16) return true;
      if (activeTimeFilter === '전체') return true;
      return false;
    });
  }, [teeTimes, activeTimeFilter]);

  return (
    <div>
      {/* Tee Time List */}
      <div className="p-4 space-y-2 bg-gray-100">
        <div className="flex items-center text-sm text-gray-500">
          <ClockIcon className="w-4 h-4 mr-2" />
          <span>
            {activeTimeFilter} {timeRangeMap[activeTimeFilter] || ''}
          </span>
          {/* <span className="ml-auto">29º 대체로 맑음</span> */}
        </div>
        {filteredTeeTimes.map((teeTime, index) => (
          <div
            key={index}
            onClick={() => onBook(teeTime)}
            className="flex justify-between items-center p-4 border rounded-lg bg-white"
          >
            <div>
              <p className="font-bold text-lg">{formatTime(teeTime.BOOK_TM)}</p>
              <p className="text-sm text-gray-600">
                {course.GOLF_PLC_NM} · {teeTime.BOOK_COURS_NM}
              </p>
              {/* <div className="flex space-x-2 mt-2">
                  {course.caddyRequired && <span className="text-xs px-2 py-1 text-gray-600 border border-gray-300 rounded">캐디동반</span>}
                  {course.playerOptions.includes(4) && <span className="text-xs px-2 py-1 text-gray-600 border border-gray-300 rounded">4인이상</span>}
              </div> */}
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-orange-500">
                {teeTime.SALE_FEE.toLocaleString()}원
              </p>
              {/* <Button size="sm" onClick={() => onBook(teeTime)} className="mt-2">예약</Button> */}
            </div>
          </div>
        ))}
        {filteredTeeTimes.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            선택한 조건에 맞는 티타임이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

const GolfCourseTimeDetailPage = () => {
  const requireAuth = useRequireAuth();
  const navigate = useNavigate();

  const { golfCourseId, bookDt } = useParams<{ golfCourseId: string; bookDt: string }>();

  const course = useGolfStore((state) => state.selectedCourse);
  const allGolfCourses = useGolfStore((state) => state.allGolfCourses);
  const initialDate = dateStringToDate(course?.BOOK_DT || bookDt!);
  const selectedDateForDetail = useGolfStore((state) => state.selectedDate);

  const [activeTab, setActiveTab] = useState<'teeTime' | 'info'>('teeTime');
  const [currentImage, setCurrentImage] = useState(0);
  const [bookingTeeTime, setBookingTeeTime] = useState<TeeTimes | null>(null);
  const [activeTimeFilter, setActiveTimeFilter] = useState('전체');

  const { setSelectedDate, startReservation } = useGolfStore.getState();

  const { data: coursesForNewDate, isPending: isLoadingTeeTimes } = useQuery({
    queryKey: ['golfCourseTimes', parseInt(golfCourseId!, 10), formatYmd(selectedDateForDetail)],
    queryFn: () => fetchGolfCourseTimes(selectedDateForDetail, parseInt(golfCourseId!, 10)),
    initialData: () => {
      if (course && isSameDay(selectedDateForDetail, initialDate)) {
        return course.TIME_LIST;
      }
      return undefined;
    },
    enabled: !!course,
    staleTime: 5 * 60 * 1000, // 5분 캐시 유지
  });

  const recommendations = useMemo(
    () =>
      allGolfCourses
        .filter((c) => c.GOLF_PLC_NO !== course?.GOLF_PLC_NO && c.REGN_NM === course?.REGN_NM)
        .slice(0, 5),
    [allGolfCourses, course]
  );

  useEffect(() => {
    if (!course) {
      navigate('/golf-courses', { replace: true });
    }
  }, [course, navigate]);

  const handleBookClick = (teeTime: TeeTimes) => {
    requireAuth(() => {
      setBookingTeeTime({ ...teeTime, BOOK_DT: formatYmd(selectedDateForDetail) });
    });
  };

  const handleConfirmBooking = () => {
    if (bookingTeeTime) {
      if (course) {
        startReservation(bookingTeeTime);
        navigate(
          `/golf-courses/${course?.GOLF_PLC_NO}/${formatYmd(selectedDateForDetail)}/reservation/${bookingTeeTime.TIME_SEQ}`
        );
      }
      setBookingTeeTime(null);
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="absolute inset-0 bg-gray-100 z-20 overflow-y-auto">
      <PageHeader title={course?.GOLF_PLC_NM} className="sticky top-0 z-20" />

      {!course ? (
        <div>골프장 정보가 없습니다.</div>
      ) : (
        <>
          <ImageCarousel
            images={course.images || []}
            currentImage={currentImage}
            setCurrentImage={setCurrentImage}
          />

          <div className="sticky top-[68px] bg-white z-10 shadow-sm">
            <div className="hidden">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('teeTime')}
                  className={`flex-1 py-3 text-center font-semibold ${activeTab === 'teeTime' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'}`}
                >
                  티타임
                </button>
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 py-3 text-center font-semibold ${activeTab === 'info' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'}`}
                >
                  골프장 정보
                </button>
              </div>
            </div>

            {activeTab === 'teeTime' && (
              <>
                <DateSelector
                  daysToShow={30}
                  controlledDate={selectedDateForDetail}
                  onDateChange={handleDateChange}
                />
                <TimeFilterBar
                  course={{ ...course, TIME_LIST: coursesForNewDate || [] }}
                  timeFilters={['전체', '새벽', '오전', '오후', '야간']}
                  activeTimeFilter={activeTimeFilter}
                  setActiveTimeFilter={setActiveTimeFilter}
                />
              </>
            )}
          </div>

          <div className="bg-white">
            {activeTab === 'teeTime' ? (
              isLoadingTeeTimes ? (
                <TeeTimeLoader />
              ) : (
                <TeeTimeView
                  course={course}
                  teeTimes={coursesForNewDate || []}
                  activeTimeFilter={activeTimeFilter}
                  onBook={handleBookClick}
                />
              )
            ) : (
              <CourseInfoView course={course} recommendations={recommendations} />
            )}
          </div>

          <BookingModal
            isOpen={!!bookingTeeTime}
            onOpenChange={(isOpen) => !isOpen && setBookingTeeTime(null)}
            onConfirm={handleConfirmBooking}
            course={course}
            teeTime={bookingTeeTime}
            selectDate={formatYmd(selectedDateForDetail)}
          />
        </>
      )}
    </div>
  );
};

export default GolfCourseTimeDetailPage;

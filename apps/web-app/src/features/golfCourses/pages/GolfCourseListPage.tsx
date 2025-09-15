import { useEffect } from 'react';
import DateSelector from '@/features/golfCourses/components/DateSelector';
import FilterBar from '@/features/golfCourses/components/FilterBar';
import FilterModal from '@/features/golfCourses/components/FilterModal';
import SortModal from '@/features/golfCourses/components/SortModal';
import CancelReasonModal from '@/features/golfCourseBookings/components/CancelReasonModal';
import SearchPage from '@/features/golfCourses/pages/SearchPage';
import { useGolfStore, selectIsFilterActive, selectIsSortActive } from '@/shared/store/createStore';
import { useQuery } from '@tanstack/react-query';
import { fetchGolfCourses } from '@/features/golfCourses/api/queries';
import { formatYmd } from '@/shared/utils/date';
import GolfCourseList from '@/features/golfCourses/components/GolfCourseList';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Button } from '@/shared/components/ui';
import { CalendarIcon, SearchIcon } from '@/shared/components/icons';
import { useNavigate } from 'react-router-dom';
import { useCloseBrowser } from '@/shared/hooks/useCloseBrowser';

const ListPageSkeleton = () => (
  <>
    <div className="sticky top-0 z-10 bg-white shadow-sm">
      <PageHeader title="실시간 예약" />
      <DateSelector />
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
      </div>
    </div>
    <main>
      <div className="bg-gray-100 p-4">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  </>
);

const MainContent = () => {
  const navigate = useNavigate();
  const closeBrowser = useCloseBrowser();

  const currentView = useGolfStore((state) => state.currentView);
  const selectedDate = useGolfStore((state) => state.selectedDate);
  const { setAllGolfCourses } = useGolfStore.getState();

  const {
    data: courses,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['golfCourses', formatYmd(selectedDate)],
    queryFn: () => fetchGolfCourses(selectedDate),
    enabled: currentView === 'list',
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (currentView === 'list') {
      if (courses) {
        setAllGolfCourses(courses);
      } else if (!isLoading) {
        setAllGolfCourses([]);
      }
    }
  }, [courses, isLoading, currentView, setAllGolfCourses]);

  const courseCount = useGolfStore((state) => state.processedCourses.length);
  const isFilterActive = useGolfStore(selectIsFilterActive);
  const isSortActive = useGolfStore(selectIsSortActive);
  const goToSearch = useGolfStore((state) => state.goToSearch);
  const { toggleFilterModal, toggleSortModal } = useGolfStore.getState();

  switch (currentView) {
    case 'search':
      return <SearchPage />;
    case 'list':
    default:
      if (isLoading) {
        return <ListPageSkeleton />;
      }
      if (isError) {
        return (
          <div className="text-center text-red-500 p-8">
            데이터를 불러오는데 실패했습니다: {error.message}
          </div>
        );
      }
      return (
        <>
          <div className="sticky top-0 z-10 bg-white shadow-sm">
            <PageHeader
              title="실시간 예약"
              onBackClick={() => closeBrowser('exit')}
              rightContent={
                <>
                  <Button variant="ghost" size="icon" onClick={goToSearch} className="hidden!">
                    <SearchIcon className="w-6 h-6 text-gray-800" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/golf-courses/booking')}
                  >
                    <CalendarIcon className="w-6 h-6 text-gray-800" />
                  </Button>
                </>
              }
            />

            <DateSelector />
            <div className="py-2 px-4">
              <FilterBar
                courseCount={courseCount}
                onFilterClick={() => toggleFilterModal(true)}
                isFilterActive={isFilterActive}
                onSortClick={() => toggleSortModal(true)}
                isSortActive={isSortActive}
              />
            </div>
          </div>
          <main>
            <div className="bg-gray-100 p-4">
              <GolfCourseList />
            </div>
          </main>
        </>
      );
  }
};

const GolfCourseListPage = () => {
  const isFilterModalOpen = useGolfStore((state) => state.isFilterModalOpen);
  const isSortModalOpen = useGolfStore((state) => state.isSortModalOpen);
  const isCancelReasonModalOpen = useGolfStore((state) => state.isCancelReasonModalOpen);

  const { toggleFilterModal, toggleSortModal, closeCancelReasonModal } = useGolfStore.getState();

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen font-sans shadow-lg relative">
      <MainContent />

      {/* Global Modals and Toasts */}
      <FilterModal isOpen={isFilterModalOpen} onOpenChange={toggleFilterModal} />
      <SortModal isOpen={isSortModalOpen} onOpenChange={toggleSortModal} />
      <CancelReasonModal
        isOpen={isCancelReasonModalOpen}
        onOpenChange={(isOpen) => !isOpen && closeCancelReasonModal()}
      />
    </div>
  );
};

export default GolfCourseListPage;

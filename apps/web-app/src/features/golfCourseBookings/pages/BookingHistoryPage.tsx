import BookingCard from '@/features/golfCourseBookings/components/BookingCard';
import { useGolfStore, type GolfState } from '@/shared/store/createStore';
import { Button, Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui';
import { useQuery } from '@tanstack/react-query';
import { fetchGolfCourseBookings } from '@/features/golfCourseBookings/api/queries';
import type { Booking } from '../domain/types';
import { useUserStore } from '@/shared/store/userStore';
import { Outlet, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/shared/components/layout/PageHeader';

const BookingHistoryPage = () => {
  const navigate = useNavigate();
  const initialTab = useGolfStore((state: GolfState) => state.initialHistoryTab);

  const user = useUserStore((state) => state.user);

  const {
    data: categorizedBookings,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['golfCourseBookings', user?.id],
    queryFn: () => fetchGolfCourseBookings(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시
    select: (data: Booking[]) => {
      return {
        scheduled: data.filter((b) => b.status === 1),
        cancelled: data.filter((b) => b.status === 2),
      };
    },
  });

  const { scheduled, cancelled } = categorizedBookings || { scheduled: [], cancelled: [] };

  return (
    <>
      <div className="absolute inset-0 bg-gray-100 z-30 font-sans overflow-y-auto">
        <PageHeader title="예약내역" />

        {isLoading ? (
          <div className="absolute inset-0 z-40 flex items-center justify-center">
            예약 내역을 불러오는 중...
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 p-8">데이터를 불러오는데 실패했습니다</div>
        ) : (
          <Tabs defaultValue={initialTab}>
            <TabsList>
              <TabsTrigger value="rounds">라운드 내역</TabsTrigger>
              <TabsTrigger value="cancelled">취소 라운드</TabsTrigger>
            </TabsList>
            <main className="p-4">
              <TabsContent value="rounds">
                {scheduled.length > 0 ? (
                  <div>
                    {scheduled.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onViewDetails={() => navigate(`/golf-courses/booking/${booking.id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState onActionClick={() => navigate('/golf-courses')} />
                )}
              </TabsContent>
              <TabsContent value="cancelled">
                {cancelled.length > 0 ? (
                  <div>
                    {cancelled.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onViewDetails={() => navigate(`/golf-courses/booking/${booking.id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState onActionClick={() => navigate('/golf-courses', { replace: true })} />
                )}
              </TabsContent>
            </main>
          </Tabs>
        )}
      </div>
      <Outlet />
    </>
  );
};

const EmptyState = ({ onActionClick }: { onActionClick: () => void }) => (
  <div className="text-center pt-20">
    <h2 className="text-xl font-bold text-gray-800">예약 내역이 비어있습니다</h2>
    <p className="mt-2 text-gray-500 leading-relaxed">
      약 500여개 골프장이 당신을 기다리고 있어요.
      <br />
      지금 바로 예약하러 가볼까요?
    </p>
    <Button onClick={onActionClick} className="mt-6 bg-blue-500 hover:bg-blue-600">
      <span className="mr-2 text-lg">→</span> 예약리스트 보러가기
    </Button>
  </div>
);

export default BookingHistoryPage;

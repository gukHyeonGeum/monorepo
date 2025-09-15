import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
  Navigate,
} from 'react-router-dom';
import PrivateRoute from '@/app/routes/privateRoute';
import { Toaster } from '@/shared/components/ui/sonner';
import { PageHeader } from '@/shared/components/layout/PageHeader';

// ----- 레이아웃 (전역 헤더/푸터 등) -----
function AppLayout() {
  return (
    <>
      {/* 전역 헤더가 있다면 여기에 */}
      {/* <main style={{ minHeight: '100vh' }}> */}
      <Outlet />
      {/* </main> */}
      {/* 전역 푸터가 있다면 여기에 */}
      <GlobalAlertModal />
      <Toaster />
      <ScrollRestoration />
    </>
  );
}

// ----- 로그인 페이지 (예시) -----
function LoginPage() {
  return (
    <>
      <PageHeader title="로그인" />
      <div style={{ padding: 24 }}>
        <h2>로그인 페이지</h2>
        <p>로그인이 필요한 서비스입니다.</p>
        {/* 실제로는 여기에 로그인 폼이 들어갑니다. */}
      </div>
    </>
  );
}

// ----- 에러 바운더리 (라우트 오류 처리) -----
function RouteErrorBoundary() {
  return (
    <div style={{ padding: 24 }}>
      <h2>문제가 발생했습니다.</h2>
      <p>잠시 후 다시 시도해주세요.</p>
    </div>
  );
}

// ----- Not Found -----
function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h2>페이지를 찾을 수 없습니다.</h2>
    </div>
  );
}

const GlobalAlertModal = lazy(() => import('@/shared/components/layout/GlobalAlertModal'));

const GolfCourseListPage = lazy(() => import('@/features/golfCourses/pages/GolfCourseListPage'));
const BookingHistoryPage = lazy(
  () => import('@/features/golfCourseBookings/pages/BookingHistoryPage')
);
const BookingDetailPage = lazy(
  () => import('@/features/golfCourseBookings/pages/BookingDetailPage')
);
const BookingCancellationCompletePage = lazy(
  () => import('@/features/golfCourseBookings/pages/BookingCancellationCompletePage')
);
const ReservationPage = lazy(() => import('@/features/golfCourseBookings/pages/ReservationPage'));
const GolfCourseTimeDetailPage = lazy(
  () => import('@/features/golfCourses/pages/GolfCourseTimeDetailPage')
);
const SearchPage = lazy(() => import('@/features/golfCourses/pages/SearchPage'));

// ----- 라우터 정의 -----
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      errorElement: <RouteErrorBoundary />,
      children: [
        {
          path: 'golf-courses',
          children: [
            {
              index: true,
              element: (
                <Suspense fallback={null}>
                  <GolfCourseListPage />
                </Suspense>
              ),
            },
            {
              path: ':golfCourseId/:bookDt/detail',
              element: (
                <Suspense fallback={null}>
                  <GolfCourseTimeDetailPage />
                </Suspense>
              ),
            },
            {
              path: 'search',
              element: (
                <Suspense fallback={null}>
                  <SearchPage />
                </Suspense>
              ),
            },
            {
              element: <PrivateRoute />,
              children: [
                {
                  path: 'booking',
                  element: (
                    <Suspense fallback={null}>
                      <BookingHistoryPage />
                    </Suspense>
                  ),
                  children: [
                    {
                      path: ':bookingId',
                      element: (
                        <Suspense fallback={null}>
                          <BookingDetailPage />
                        </Suspense>
                      ),
                    },
                  ],
                },
                {
                  path: ':golfCourseId/:bookDt/reservation/:teeTimeSeq',
                  element: (
                    <Suspense fallback={null}>
                      <ReservationPage />
                    </Suspense>
                  ),
                },
                {
                  path: 'booking/cancellation-complete',
                  element: (
                    <Suspense fallback={null}>
                      <BookingCancellationCompletePage />
                    </Suspense>
                  ),
                },
                {
                  path: 'auth',
                  element: <Navigate to="/golf-courses" />,
                },
              ],
            },
          ],
        },
        {
          path: 'login',
          element: <LoginPage />,
        },
        {
          path: '*',
          element: <NotFound />,
        },
      ],
    },
  ],
  {
    basename: '/web-app',
  }
);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}

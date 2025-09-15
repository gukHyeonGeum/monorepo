import { CancellationIcon } from '@/shared/components/icons';
import { useGolfStore } from '@/shared/store/createStore';
import { Button } from '@/shared/components/ui';
import { useNavigate } from 'react-router-dom';

const BookingCancellationCompletePage = () => {
  const navigate = useNavigate();

  const handleViewHistory = () => {
    // 예약 내역 페이지의 '취소 라운드' 탭이 기본으로 선택되도록 상태를 설정합니다.
    useGolfStore.setState({ initialHistoryTab: 'cancelled' });
    navigate(-1);
  };

  return (
    <div className="absolute inset-0 bg-white z-50 font-sans flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <CancellationIcon className="w-24 h-24 text-orange-400" />
        <h1 className="mt-6 text-2xl font-bold text-gray-800">예약 취소가 완료되었습니다.</h1>
        <p className="mt-2 text-gray-500 leading-relaxed max-w-xs">
          취소 확정 시 티샷 알림톡으로 안내드릴 예정이며, 취소내역에서도 확인하실 수 있습니다.
        </p>
      </main>
      <footer className="w-full p-4">
        <Button onClick={handleViewHistory} variant="outline" size="lg" className="w-full">
          취소내역보기
        </Button>
      </footer>
    </div>
  );
};

export default BookingCancellationCompletePage;

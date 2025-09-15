import { toast } from 'sonner';
import type { ExternalToast } from 'sonner';

// 토스트 타입을 정의합니다. (성공, 에러, 정보 등)
type ToastType = 'success' | 'error' | 'info' | 'warning';

// sonner에서 지원하는 위치 타입을 가져옵니다.
type ToastPosition = ExternalToast['position'];

// 타입에 따른 배경색을 매핑합니다. TailwindCSS 클래스를 사용합니다.
const typeColorMap: Record<ToastType, string> = {
  success: 'bg-blue-500', // 성공은 파란색으로
  error: 'bg-red-500', // 에러는 빨간색으로
  info: 'bg-gray-800', // 정보는 어두운 회색으로
  warning: 'bg-yellow-500', // 경고는 노란색으로
};

interface ToastOptions {
  message: string;
  type?: ToastType;
  position?: ToastPosition;
  className?: string;
}

/**
 * 커스텀 스타일이 적용된 sonner 토스트를 표시하는 헬퍼 함수입니다.
 * @property {string} message - 토스트에 표시할 메시지
 * @property {ToastType} [type='info'] - 토스트 종류 (success, error, info, warning)
 * @property {ToastPosition} [position='bottom-center'] - 토스트가 표시될 위치
 * @property {string} className - 토스트에 추가 클래스 적용
 */
export const showToast = ({
  message,
  type = 'info',
  position = 'bottom-center',
  className,
}: ToastOptions) => {
  toast(message, {
    position,
    unstyled: true,
    classNames: {
      toast: `px-4 py-3 rounded-lg text-white font-semibold text-center shadow-lg ${typeColorMap[type]} ${className}`,
    },
  });
};

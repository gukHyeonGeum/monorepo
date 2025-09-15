import { useUserStore } from '@/shared/store/userStore';
import { useCallback } from 'react';
import { showToast } from '@/shared/utils/toast';

/**
 * 인증이 필요한 액션을 실행하기 위한 훅.
 * 인증 상태를 확인하고, 비인증 시 로그인 페이지로 리디렉션합니다.
 */
export const useRequireAuth = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  return useCallback(
    (callback: () => void) => {
      if (isAuthenticated) {
        callback();
      } else {
        showToast({
          message: `로그인이 필요한 서비스 입니다.`,
          type: 'error',
        });
      }
    },
    [isAuthenticated]
  );
};

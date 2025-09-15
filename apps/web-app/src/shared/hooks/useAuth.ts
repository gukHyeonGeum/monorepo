import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { fetchUsers } from '@/features/users/api/queries';
import { useUserStore } from '@/shared/store/userStore';

export const useAuth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { setUser, clearUser, isAuthenticated } = useUserStore();

  const urlToken = searchParams.get('token');
  const localToken = localStorage.getItem('auth-token');

  // URL에 토큰이 있으면 localStorage에 저장하고 URL에서 제거합니다.
  useEffect(() => {
    if (urlToken) {
      localStorage.setItem('auth-token', urlToken);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      searchParams.delete('token');
      setSearchParams(searchParams, { replace: true });
    }
  }, [urlToken, searchParams, setSearchParams, queryClient]);

  const token = urlToken || localToken;

  const { data, isError, isSuccess } = useQuery({
    queryKey: ['user', token],
    queryFn: () => fetchUsers(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지
    retry: false,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data);
    }
  }, [isSuccess, data, setUser]);

  useEffect(() => {
    if (isError) {
      clearUser();
      localStorage.removeItem('authToken');
    }
  }, [isError, clearUser]);

  const isAuthenticating = !!token && !isAuthenticated && !isError;

  return { isAuthenticated, isAuthenticating };
};

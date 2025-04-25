// hooks/useAuth.ts
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();

  const login = async (username: string, password: string) => {
    dispatch(loginStart());

    try {
      const response = await fetch('http://localhost:8000/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Неверные учетные данные');
      }

      const data = await response.json();
      dispatch(loginSuccess(data.access));
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  return { login };
};
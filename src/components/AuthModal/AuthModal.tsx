// components/AuthModal/AuthModal.tsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import { RootState } from '../../store';
import styles from './AuthModal.module.scss';

const AuthModal = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    form: ''
  });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      username: '',
      password: '',
      form: ''
    };

    if (!username.trim()) {
      newErrors.username = 'Логин обязателен';
      valid = false;
    } else if (username.length < 3) {
      newErrors.username = 'Логин слишком короткий';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Пароль обязателен';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(loginStart());
    setErrors(prev => ({...prev, form: ''}));

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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
      dispatch(loginFailure(errorMessage));
      setErrors(prev => ({...prev, form: errorMessage}));
    }
  };

  return (
    <div className={styles['auth-modal']}>
      <div className={styles['auth-modal__content']}>
        <h2 className={styles['auth-modal__title']}>Авторизация</h2>
        <form onSubmit={handleSubmit} className={styles['auth-modal__form']} noValidate>
          <div className={styles['auth-modal__form-group']}>
            <label htmlFor="username">Логин</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors(prev => ({...prev, username: ''}));
              }}
              required
              className={errors.username ? styles['error-input'] : ''}
            />
            {errors.username && <div className={styles['field-error']}>{errors.username}</div>}
          </div>
          <div className={styles['auth-modal__form-group']}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors(prev => ({...prev, password: ''}));
              }}
              required
              className={errors.password ? styles['error-input'] : ''}
            />
            {errors.password && <div className={styles['field-error']}>{errors.password}</div>}
          </div>
          {(error || errors.form) && (
            <div className={styles['auth-modal__error']}>
              {errors.form || error}
            </div>
          )}
          <button
            type="submit"
            className={styles['auth-modal__submit']}
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
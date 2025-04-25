// components/AuthModal/AuthModal.tsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { validateAuthForm, AuthErrors } from '../../utils/authValidation';
import { FaUser, FaLock, FaSignInAlt, FaSpinner } from 'react-icons/fa';
import styles from './AuthModal.module.scss';

const AuthModal = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<AuthErrors>({
    username: '',
    password: '',
    form: '',
  });

  const { loading, error } = useSelector((state: RootState) => state.auth);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { valid, errors: validationErrors } = validateAuthForm(username, password);
    setErrors(validationErrors);

    if (!valid) return;

    const { error: loginError } = await login(username, password);
    if (loginError) {
      setErrors((prev) => ({ ...prev, form: loginError }));
    }
  };

  const handleInputChange = (field: keyof AuthErrors) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (field === 'username') setUsername(value);
    if (field === 'password') setPassword(value);
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className={styles['auth-modal']}>
      <div className={styles['auth-modal__content']}>
        <h2 className={styles['auth-modal__title']}>Авторизация</h2>
        <form onSubmit={handleSubmit} className={styles['auth-modal__form']} noValidate>
          <div className={styles['auth-modal__form-group']}>
            <label htmlFor="username">Логин</label>
            <div className={styles['input-wrapper']}>
            <FaUser className={`${styles['input-icon']} ${errors.username ? styles['error-icon'] : ''}`} />
              <input
                type="text"
                id="username"
                value={username}
                onChange={handleInputChange('username')}
                required
                className={errors.username ? styles['error-input'] : ''}
                placeholder="Введите ваш логин"
              />
            </div>
            {errors.username && <div className={styles['field-error']}>{errors.username}</div>}
          </div>
          <div className={styles['auth-modal__form-group']}>
            <label htmlFor="password">Пароль</label>
            <div className={styles['input-wrapper']}>
              <FaLock className={`${styles['input-icon']} ${errors.password ? styles['error-icon'] : ''}`} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={handleInputChange('password')}
                required
                className={errors.password ? styles['error-input'] : ''}
                placeholder="Введите ваш пароль"
              />
            </div>
            {errors.password && <div className={styles['field-error']}>{errors.password}</div>}
          </div>
          {(error || errors.form) && <div className={styles['auth-modal__error']}>{errors.form || error}</div>}
          <button type="submit" className={styles['auth-modal__submit']} disabled={loading}>
            {loading ? (
              <>
                <FaSpinner className={styles['submit-spinner']} />
                Вход...
              </>
            ) : (
              <>
                <FaSignInAlt />
                Войти
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;

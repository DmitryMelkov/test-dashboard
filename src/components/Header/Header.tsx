// components/Header/Header.tsx
import { FaSignOutAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import styles from './Header.module.scss';

interface HeaderProps {
  theme: 'light' | 'dark';
}

const Header = ({ theme }: HeaderProps) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className={`${styles['header']} ${styles[`header--${theme}`]}`}>
      <div className={styles['header__logo']}>
        <span className={styles['header__logo-text']}>Dashboard</span>
      </div>

      <button
        className={styles['header__logout']}
        onClick={handleLogout}
        aria-label="Выйти из системы"
      >
        <FaSignOutAlt className={styles['header__logout-icon']} />
      </button>
    </header>
  );
};

export default Header;
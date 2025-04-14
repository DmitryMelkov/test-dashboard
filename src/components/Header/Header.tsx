import { FaSignOutAlt } from 'react-icons/fa';
import styles from './Header.module.scss';

interface HeaderProps {
  theme: 'light' | 'dark';
  onLogout?: () => void;
}

const Header = ({ theme, onLogout }: HeaderProps) => {
  return (
    <header className={`${styles['header']} ${styles[`header--${theme}`]}`}>
      <div className={styles['header__logo']}>
        <span className={styles['header__logo-text']}>Dashboard</span>
      </div>

      <button
        className={styles['header__logout']}
        onClick={onLogout}
        aria-label="Выйти из системы"
      >
        <FaSignOutAlt className={styles['header__logout-icon']} />
      </button>
    </header>
  );
};

export default Header;
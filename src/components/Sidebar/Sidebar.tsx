import { useState } from 'react';
import { FaChartLine, FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  theme: 'light' | 'dark'; // Типизируем пропс
}

const Sidebar = ({ theme }: SidebarProps) => {
  const [isKpdOpen, setIsKpdOpen] = useState(false);

  return (
    <aside className={`${styles['sidebar']} ${styles[`sidebar--${theme}`]}`}>
      {/* Добавляем класс `sidebar--dark` или `sidebar--light` */}
      <div className={styles['sidebar__logo']}>Логотип</div>

      <nav className={styles['sidebar__nav']}>
        <ul className={`${styles['sidebar__list']}`}>
          <li className={`${styles['sidebar__item']}`}>
            <button className={`${styles['sidebar__item-btn']}`} onClick={() => setIsKpdOpen(!isKpdOpen)}>
              <FaChartLine className={styles['sidebar__icon']} />
              <span className={styles['sidebar__nav-text']}>КПД</span>
              {isKpdOpen ? (
                <FaChevronLeft className={styles['sidebar__arrow']} />
              ) : (
                <FaChevronDown className={styles['sidebar__arrow']} />
              )}
            </button>
          </li>
        </ul>

        {isKpdOpen && (
          <ul className={styles['sidebar__submenu']}>
            <li className={`${styles['sidebar__submenu-item']}`}>
              <Link to="/dashboard" className={styles['sidebar__submenu-link']}>
                Дашборд
              </Link>
            </li>
            <li className={`${styles['sidebar__submenu-item']}`}>
              <Link to="/efficiency" className={styles['sidebar__submenu-link']}>
                Эффективность работы
              </Link>
            </li>
          </ul>
        )}
      </nav>

      <div className={styles['sidebar__theme-toggle']}>
        <ThemeToggle />
      </div>
    </aside>
  );
};

export default Sidebar;

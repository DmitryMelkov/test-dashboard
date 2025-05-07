import { useEffect, useState } from 'react';
import { FaChartLine, FaGasPump, FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  theme: 'light' | 'dark';
}

const Sidebar = ({ theme }: SidebarProps) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Определяем активные пути
  const isDashboardActive = location.pathname === '/dashboard';
  const isEfficiencyActive = location.pathname === '/efficiency';
  const isFuelNormsActive = location.pathname === '/financial-dashboard';

  // Автоматически открывать подменю если активен один из его пунктов
  useEffect(() => {
    if (isDashboardActive || isEfficiencyActive) {
      setOpenMenu('kpd');
    } else if (isFuelNormsActive) {
      setOpenMenu('financial');
    }
  }, [isDashboardActive, isEfficiencyActive, isFuelNormsActive]);

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <aside className={`${styles['sidebar']} ${styles[`sidebar--${theme}`]}`}>
      <nav className={styles['sidebar__nav']}>
        <ul className={styles['sidebar__list']}>
          {/* Пункт КПД с подменю */}
          <li className={styles['sidebar__item-container']}>
            <div className={styles['sidebar__item']}>
              <button
                className={styles['sidebar__item-btn']}
                onClick={() => toggleMenu('kpd')}
              >
                <FaChartLine className={styles['sidebar__icon']} />
                <span className={styles['sidebar__nav-text']}>КПД</span>
                {openMenu === 'kpd' ? (
                  <FaChevronLeft className={styles['sidebar__arrow']} />
                ) : (
                  <FaChevronDown className={styles['sidebar__arrow']} />
                )}
              </button>
            </div>

            {openMenu === 'kpd' && (
              <ul className={styles['sidebar__submenu']}>
                <li className={styles['sidebar__submenu-item']}>
                  <Link
                    to="/dashboard"
                    className={`${styles['sidebar__submenu-link']} ${isDashboardActive ? styles['sidebar__submenu-link--active'] : ''}`}
                  >
                    Дашборд
                  </Link>
                </li>
                <li className={styles['sidebar__submenu-item']}>
                  <Link
                    to="/efficiency"
                    className={`${styles['sidebar__submenu-link']} ${isEfficiencyActive ? styles['sidebar__submenu-link--active'] : ''}`}
                  >
                    Эффективность работы
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Пункт Топливная аналитика с подменю */}
          <li className={styles['sidebar__item-container']}>
            <div className={styles['sidebar__item']}>
              <button
                className={styles['sidebar__item-btn']}
                onClick={() => toggleMenu('financial')}
              >
                <FaGasPump className={styles['sidebar__icon']} />
                <span className={styles['sidebar__nav-text']}>Финансовая аналитика</span>
                {openMenu === 'financial' ? (
                  <FaChevronLeft className={styles['sidebar__arrow']} />
                ) : (
                  <FaChevronDown className={styles['sidebar__arrow']} />
                )}
              </button>
            </div>

            {openMenu === 'financial' && (
              <ul className={styles['sidebar__submenu']}>
                <li className={styles['sidebar__submenu-item']}>
                  <Link
                    to="/financial-dashboard"
                    className={`${styles['sidebar__submenu-link']} ${isFuelNormsActive ? styles['sidebar__submenu-link--active'] : ''}`}
                  >
                    Дашборд
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <div className={styles['sidebar__theme-toggle']}>
        <ThemeToggle />
      </div>
    </aside>
  );
};

export default Sidebar;
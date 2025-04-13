import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Layout.module.scss';
import { RootState } from '../../store';

const Layout = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <div className={`${styles['layout']} ${styles[`layout--${theme}`]}`}>
      <Sidebar theme={theme} /> {/* Передаем тему в Sidebar */}
      <main className={styles['main']}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
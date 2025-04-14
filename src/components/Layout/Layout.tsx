import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import styles from './Layout.module.scss';
import { RootState } from '../../store';

const Layout = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  const handleLogout = () => {
    // Здесь будет логика выхода
    console.log('Logout clicked');
    // Например: dispatch(logoutAction());
  };

  return (
    <div className={`${styles['layout']} ${styles[`layout--${theme}`]}`}>
      <Header theme={theme} onLogout={handleLogout} />
      <div className={`${styles['content']}`}>
        <Sidebar theme={theme} />
        <main className={styles['main']}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

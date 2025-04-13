import { Link } from 'react-router-dom';
import styles from './Dashboard.module.scss';

const Dashboard = () => {
  return (
    <div className={styles['dashboard']}>
      <div className={styles['dashboard__breadcrumbs']}>
        <Link to="/" className={styles['dashboard__breadcrumbs-link']}>КПД</Link>
        <span className={styles['dashboard__breadcrumbs-separator']}>/</span>
        <span className={styles['dashboard__breadcrumbs-current']}>Дашборд</span>
      </div>
      <h1 className={styles['dashboard__title']}>Дашборд</h1>
      <p className={styles['dashboard__content']}>Контент дашборда будет здесь</p>
    </div>
  );
};

export default Dashboard;
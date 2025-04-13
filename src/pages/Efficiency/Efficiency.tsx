import { Link } from 'react-router-dom';
import styles from './Efficiency.module.scss';

const Efficiency = () => {
  return (
    <div className={styles['efficiency']}>
      <div className={styles['efficiency__breadcrumbs']}>
        <Link to="/" className={styles['efficiency__breadcrumbs-link']}>КПД</Link>
        <span className={styles['efficiency__breadcrumbs-separator']}>/</span>
        <span className={styles['efficiency__breadcrumbs-current']}>Эффективность работы</span>
      </div>
      <h1 className={styles['efficiency__title']}>Эффективность работы</h1>
      <p className={styles['efficiency__content']}>Контент страницы эффективности будет здесь</p>
    </div>
  );
};

export default Efficiency;
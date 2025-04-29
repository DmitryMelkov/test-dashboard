import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import styles from './Efficiency.module.scss';

const Efficiency = () => {
  return (
    <div className={styles['efficiency']}>
      <Breadcrumbs segments={[{ label: 'КПД' }, { label: 'Эффективность работы' }]} />
      <h1 className={styles['efficiency__title']}>Эффективность работы</h1>
      <p className={styles['efficiency__content']}>Контент страницы эффективности будет здесь</p>
    </div>
  );
};

export default Efficiency;

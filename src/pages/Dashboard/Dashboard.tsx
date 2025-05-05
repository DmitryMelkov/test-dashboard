import { RootState } from '../../store';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { useSelector } from 'react-redux';
import styles from './Dashboard.module.scss';
import VehicleUsageDoughnut from '../../components/VehicleUsageDoughnut/VehicleUsageDoughnut';
import Loader from '../../ui/loader/Loader';
import { useReportData } from '../../hooks/useReportData';

const Dashboard = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);
   const { reportData, sortedReportData } = useReportData();


  return (
    <div className={`${styles['dashboard']} ${styles[`dashboard--${theme}`]}`}>
      <Breadcrumbs segments={[{ label: 'КПД' }, { label: 'Дашборд' }]} theme={theme} />

      {reportData ? (
        <>
          <div className={styles['dashboard__header']}>
            <h2 className={styles['dashboard__title']}>Графики</h2>
          </div>

          <div className={styles['dashboard__charts-container']}>

            <div className={`${styles['efficiency__chart']} ${styles['dashboard__chart--douhnut']}`}>
              <VehicleUsageDoughnut data={reportData} />
            </div>

          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Dashboard;

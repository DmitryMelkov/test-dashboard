// pages/Dashboard/Dashboard.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import styles from './Dashboard.module.scss';
import VehicleTimeChart from '../../components/VehicleTimeChart/VehicleTimeChart';

interface ReportItem {
  id: number;
  date: string;
  terminal_id: number;
  idle_time: number;
  motohours: number;
  trip_time: number;
  millage: number;
  consumption_total: number;
  drained: number;
}

const Dashboard = () => {
  const [reportData, setReportData] = useState<ReportItem[] | null>(null);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const fetchReport = async () => {
    if (!accessToken) return;

    try {
      const url = new URL('http://localhost:8000/api/report');
      url.searchParams.append('start_from', '2025-04-01');
      url.searchParams.append('end_to', '2025-04-23');

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Произошла ошибка при запросе отчета:', error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchReport();
    }
  }, [accessToken]);

  return (
    <div className={styles['dashboard']}>
      <div className={styles['dashboard__breadcrumbs']}>
        <Link to="/" className={styles['dashboard__breadcrumbs-link']}>
          КПД
        </Link>
        <span className={styles['dashboard__breadcrumbs-separator']}>/</span>
        <span className={styles['dashboard__breadcrumbs-current']}>Дашборд</span>
      </div>
      <h1 className={styles['dashboard__title']}>Дашборд</h1>
      {reportData ? (
        <div className={styles['dashboard__chart-container']}>
          <VehicleTimeChart data={reportData} />
        </div>
      ) : (
        <p>Загрузка данных отчета...</p>
      )}
    </div>
  );
};

export default Dashboard;
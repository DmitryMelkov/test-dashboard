import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import styles from './Dashboard.module.scss';
import VehicleTimeChart from '../../components/VehicleTimeChart/VehicleTimeChart';
import Button from '../../ui/Button/Button';

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
  const theme = useSelector((state: RootState) => state.theme.mode);
  const [reportData, setReportData] = useState<ReportItem[] | null>(null);
  const [timeRange, setTimeRange] = useState<'10-days' | '20-days' | 'month'>('10-days');
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const fetchReport = async (range: '10-days' | '20-days' | 'month') => {
    if (!accessToken) return;

    try {
      const url = new URL('http://localhost:8000/api/report');
      let startDate: Date;

      switch (range) {
        case '10-days':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 10);
          break;
        case '20-days':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 20);
          break;
        case 'month':
          startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1);
          break;
      }

      const endDate = new Date();

      url.searchParams.append('start_from', startDate.toISOString().split('T')[0]);
      url.searchParams.append('end_to', endDate.toISOString().split('T')[0]);

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
      fetchReport(timeRange);
    }
  }, [accessToken, timeRange]);

  return (
    <div className={`${styles.dashboard} ${styles[`dashboard--${theme}`]}`}>
      <div className={styles['dashboard__breadcrumbs']}>
        <Link to="/" className={styles['dashboard__breadcrumbs-link']}>
          КПД
        </Link>
        <span className={styles['dashboard__breadcrumbs-separator']}>/</span>
        <span className={styles['dashboard__breadcrumbs-current']}>Дашборд</span>
      </div>
      <h1 className={styles['dashboard__title']}>Дашборд</h1>

      <div className={styles['dashboard__buttons']}>
        <Button active={timeRange === '10-days'} onClick={() => setTimeRange('10-days')} theme={theme}>
          Последние 10 дней
        </Button>
        <Button active={timeRange === '20-days'} onClick={() => setTimeRange('20-days')} theme={theme}>
          Последние 20 дней
        </Button>
        <Button active={timeRange === 'month'} onClick={() => setTimeRange('month')} theme={theme}>
          Месяц
        </Button>
      </div>

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

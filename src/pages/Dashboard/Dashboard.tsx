import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.scss';

const Dashboard = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any | null>(null);

  // Функция для выполнения POST-запроса на авторизацию
  const fetchToken = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'TDG',
          password: '123456fgh',
        }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка авторизации: ${response.status}`);
      }

      const data = await response.json();
      console.log('Получен токен:', data.access);
      setAccessToken(data.access); // Сохраняем токен в состоянии
    } catch (error) {
      console.error('Произошла ошибка при авторизации:', error);
    }
  };

  // Функция для выполнения GET-запроса к отчетам
  const fetchReport = async () => {
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
      console.log('Ответ сервера:', data);
      setReportData(data);
    } catch (error) {
      console.error('Произошла ошибка при запросе отчета:', error);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

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
      {accessToken ? (
        <p>Токен получен: {accessToken}</p>
      ) : (
        <p>Ожидание авторизации...</p>
      )}
      {reportData ? (
        <div>
          <h2>Данные отчета:</h2>
          <pre>{JSON.stringify(reportData, null, 2)}</pre>
        </div>
      ) : (
        <p>Загрузка данных отчета...</p>
      )}
    </div>
  );
};

export default Dashboard;
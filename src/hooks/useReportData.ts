import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { CarReport } from '../types/CarReport';

export const useReportData = () => {
  const [reportData, setReportData] = useState<CarReport[] | null>(null);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  // Сортируем данные по idle_time
  const sortedReportData = useMemo(() => {
    if (!reportData) return [];
    return [...reportData].sort((a, b) => b.car_data.idle_time - a.car_data.idle_time);
  }, [reportData]);

  // Функция для загрузки данных
  const fetchReport = async () => {
    if (!accessToken) return;

    try {
      // Имитация задержки загрузки (2 секунды)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const url = new URL('http://localhost:8000/api/report');
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

  

  return { reportData, sortedReportData, fetchReport };
};
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import styles from './Dashboard.module.scss';
import VehicleTimeChart from '../../components/VehicleTimeChart/VehicleTimeChart';
import Button from '../../ui/Button/Button';
import CarSelectionModal from '../../components/CarSelectionModal/CarSelectionModal';

interface CarReport {
  car_name: string;
  wln_id: number;
  car_data: {
    id: number;
    date: string;
    wln_id: number;
    motohours: number;
    millage: number;
    consumption_total: number;
    drained: number;
    filled_real: number;
    filled_bill: number;
    idle_time: number;
  };
}

const Dashboard = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const [reportData, setReportData] = useState<CarReport[] | null>(null);
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [tempSelectedCars, setTempSelectedCars] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const fetchReport = async () => {
    if (!accessToken) return;

    try {
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

      // Выбираем топ-5 машин с наибольшим временем простоя по умолчанию
      const topIdleCars = [...data]
        .sort((a, b) => b.car_data.idle_time - a.car_data.idle_time)
        .slice(0, 5)
        .map((car) => car.car_name);
      setSelectedCars(topIdleCars);
      setTempSelectedCars(topIdleCars);
    } catch (error) {
      console.error('Произошла ошибка при запросе отчета:', error);
    }
  };

  const handleOpenModal = () => {
    setTempSelectedCars(selectedCars);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleApplySelection = () => {
    setSelectedCars(tempSelectedCars);
    setOpenModal(false);
  };

  const handleCarToggle = (carName: string) => {
    setTempSelectedCars((prev) =>
      prev.includes(carName) ? prev.filter((name) => name !== carName) : [...prev, carName]
    );
  };

  const handleSelectAll = () => {
    if (reportData) {
      if (tempSelectedCars.length === reportData.length) {
        setTempSelectedCars([]);
      } else {
        setTempSelectedCars(reportData.map((car) => car.car_name));
      }
    }
  };

  const filteredData = reportData ? reportData.filter((car) => selectedCars.includes(car.car_name)) : [];

  useEffect(() => {
    if (accessToken) {
      fetchReport();
    }
  }, [accessToken]);

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

      {reportData ? (
        <>
          <Button onClick={handleOpenModal} className={styles['dashboard__select-button']}>
            Выбрать машины для отображения ({selectedCars.length})
          </Button>

          <CarSelectionModal
            open={openModal}
            onClose={handleCloseModal}
            onApply={handleApplySelection}
            reportData={reportData}
            selectedCars={tempSelectedCars}
            onToggleCar={handleCarToggle}
            onSelectAll={handleSelectAll}
          />

          {selectedCars.length > 0 ? (
            <div className={styles['dashboard__chart-container']}>
              <VehicleTimeChart data={filteredData} />
            </div>
          ) : (
            <p>Выберите хотя бы одну машину для отображения</p>
          )}
        </>
      ) : (
        <p>Загрузка данных отчета...</p>
      )}
    </div>
  );
};

export default Dashboard;
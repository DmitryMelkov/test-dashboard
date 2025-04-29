import { useState, useMemo, useEffect } from 'react';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs'; // Импортируем компонент
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import styles from './Dashboard.module.scss';
import VehicleTimeChart from '../../components/VehicleTimeChart/VehicleTimeChart';
import Button from '../../ui/Button/Button';
import CarSelectionModal from '../../components/CarSelectionModal/CarSelectionModal';
import { useReportData } from '../../hooks/useReportData';
import Loader from '../../ui/loader/Loader';

const Dashboard = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [tempSelectedCars, setTempSelectedCars] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const { reportData, sortedReportData } = useReportData();

  // Фильтруем данные по выбранным машинам
  const filteredData = useMemo(() => {
    if (!reportData) return [];
    return reportData.filter((car) => selectedCars.includes(car.car_name));
  }, [reportData, selectedCars]);

  useEffect(() => {
    if (sortedReportData) {
      const topIdleCars = sortedReportData.slice(0, 5).map((car) => car.car_name);
      setSelectedCars(topIdleCars);
      setTempSelectedCars(topIdleCars);
    }
  }, [sortedReportData]);

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

  return (
    <div className={`${styles.dashboard} ${styles[`dashboard--${theme}`]}`}>
      <Breadcrumbs segments={[{ label: 'КПД' }, { label: 'Дашборд' }]} theme={theme} />
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
            reportData={sortedReportData}
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
        <Loader />
      )}
    </div>
  );
};

export default Dashboard;

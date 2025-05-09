import { useState, useMemo, useEffect } from 'react';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import styles from './Efficiency.module.scss';
import VehicleTimeChart from '../../components/Charts/VehicleTimeChart/VehicleTimeChart';
import Button from '../../ui/Button/Button';
import CarSelectionModal from '../../components/CarSelectionModal/CarSelectionModal';
import { useReportData } from '../../hooks/useReportData';
import Loader from '../../ui/loader/Loader';
import ReportTable from '../../components/ReportTable/ReportTable';
import VehicleActivityChart from '../../components/Charts/VehicleActivityChart/VehicleActivityChart';
import useVehicleStats from '../../hooks/useVehicleStats';
import TableModal from '../../components/ReportTable/TableModal/TableModal';

const Efficiency = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [tempSelectedCars, setTempSelectedCars] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const { reportData, sortedReportData } = useReportData();
  const { vehicleStats, loading: statsLoading, error: statsError } = useVehicleStats();
  // В компоненте Efficiency добавим состояние для модального окна
  const [openTableModal, setOpenTableModal] = useState(false);

  // Фильтруем данные по выбранным машинам (только для графика)
  const filteredChartData = useMemo(() => {
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
    <div className={`${styles['efficiency']} ${styles[`efficiency--${theme}`]}`}>
      <Breadcrumbs segments={[{ label: 'КПД' }, { label: 'Эффективность работы' }]} theme={theme} />

      <TableModal
        open={openTableModal}
        onClose={() => setOpenTableModal(false)}
        data={vehicleStats}
        title="Подробная статистика по технике"
      />

      <CarSelectionModal
        open={openModal}
        onClose={handleCloseModal}
        onApply={handleApplySelection}
        reportData={sortedReportData}
        selectedCars={tempSelectedCars}
        onToggleCar={handleCarToggle}
        onSelectAll={handleSelectAll}
        sortKey="idle_time"
        unit="ч"
        title="Выбор машин для графика времени"
      />

      {reportData ? (
        <>
          <div className={styles['efficiency__header']}>
            <h2 className={styles['efficiency__title']}>Графики</h2>
          </div>

          <div className={styles['efficiency__charts-container']}>
            {selectedCars.length > 0 ? (
              <div className={styles['efficiency__chart']}>
                <div className={`${styles['efficiency__select-button-container']}`}>
                  <Button onClick={handleOpenModal} className={styles['efficiency__select-button']}>
                    Выбрать машины ({selectedCars.length})
                  </Button>
                </div>

                <VehicleTimeChart data={filteredChartData} />
              </div>
            ) : (
              <p>Выберите хотя бы одну машину для отображения на графике</p>
            )}
            <div className={styles['efficiency__chart']}>
              <VehicleActivityChart data={reportData} />
            </div>
          </div>

          {!statsLoading && !statsError && (
            <>
              <div className={`${styles['efficiency__header']}`}>
                <h2 className={styles['efficiency__subtitle']}>Подробная статистика по технике</h2>
                <Button onClick={() => setOpenTableModal(true)}>Открыть в модальном окне</Button>
              </div>
              <div className={styles['efficiency__table-container']}>
                <ReportTable data={vehicleStats} />
              </div>
            </>
          )}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Efficiency;

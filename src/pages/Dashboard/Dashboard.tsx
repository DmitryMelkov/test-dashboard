import { RootState } from '../../store';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { useSelector } from 'react-redux';
import styles from './Dashboard.module.scss';
import Loader from '../../ui/loader/Loader';
import { useReportData } from '../../hooks/useReportData';
import Button from '../../ui/Button/Button';
import VehicleTimeChart from '../../components/VehicleTimeChart/VehicleTimeChart';
import { useEffect, useMemo, useState } from 'react';
import CarSelectionModal from '../../components/CarSelectionModal/CarSelectionModal';
import VehicleActivityChart from '../../components/VehicleActivityChart/VehicleActivityChart';
import VehicleMileageChart from '../../components/VehicleMileageChart/VehicleMileageChart';
import UsageDoughnut from '../../components/UsageDoughnut/UsageDoughnut';

const Dashboard = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const [selectedTimeCars, setSelectedTimeCars] = useState<string[]>([]);
  const [selectedMileageCars, setSelectedMileageCars] = useState<string[]>([]);
  const [tempSelectedCars, setTempSelectedCars] = useState<string[]>([]);
  const [openTimeModal, setOpenTimeModal] = useState(false);
  const [openMileageModal, setOpenMileageModal] = useState(false);
  const { reportData, sortedReportData } = useReportData();

  // Фильтруем данные для каждого графика
  const filteredTimeData = useMemo(() => {
    if (!reportData) return [];
    return reportData.filter((car) => selectedTimeCars.includes(car.car_name));
  }, [reportData, selectedTimeCars]);

  const filteredMileageData = useMemo(() => {
    if (!reportData) return [];
    return reportData.filter((car) => selectedMileageCars.includes(car.car_name));
  }, [reportData, selectedMileageCars]);

  useEffect(() => {
    if (sortedReportData) {
      // Для графика времени - топ 5 по времени простоя
      const topIdleCars = sortedReportData
        .sort((a, b) => b.car_data.idle_time - a.car_data.idle_time)
        .slice(0, 5)
        .map((car) => car.car_name);

      // Для графика пробега - топ 5 по пробегу
      const topMileageCars = sortedReportData
        .sort((a, b) => b.car_data.millage - a.car_data.millage)
        .slice(0, 5)
        .map((car) => car.car_name);

      setSelectedTimeCars(topIdleCars);
      setSelectedMileageCars(topMileageCars);
    }
  }, [sortedReportData]);

  // Общие функции для работы с модалкой
  const handleCloseModal = () => {
    setOpenTimeModal(false);
    setOpenMileageModal(false);
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

  // Функции применения выбора для каждого графика
  const handleApplyTimeSelection = () => {
    setSelectedTimeCars(tempSelectedCars);
    setOpenTimeModal(false);
  };

  const handleApplyMileageSelection = () => {
    setSelectedMileageCars(tempSelectedCars);
    setOpenMileageModal(false);
  };

  return (
    <div className={`${styles['dashboard']} ${styles[`dashboard--${theme}`]}`}>
      <Breadcrumbs segments={[{ label: 'КПД' }, { label: 'Дашборд' }]} theme={theme} />

      {reportData ? (
        <>
          <div className={styles['dashboard__header']}>
            <h2 className={styles['dashboard__title']}>Графики</h2>
          </div>

          {/* Модалка для выбора машин графика времени */}
          <CarSelectionModal
            open={openTimeModal}
            onClose={handleCloseModal}
            onApply={handleApplyTimeSelection}
            reportData={sortedReportData}
            selectedCars={tempSelectedCars}
            onToggleCar={handleCarToggle}
            onSelectAll={handleSelectAll}
            sortKey="idle_time"
            unit="ч"
            title="Выбор машин для графика времени"
          />

          {/* Модалка для выбора машин графика пробега */}
          <CarSelectionModal
            open={openMileageModal}
            onClose={handleCloseModal}
            onApply={handleApplyMileageSelection}
            reportData={sortedReportData}
            selectedCars={tempSelectedCars}
            onToggleCar={handleCarToggle}
            onSelectAll={handleSelectAll}
            sortKey="millage"
            unit="км"
            title="Выбор машин для графика пробега"
          />

          <div className={styles['dashboard__charts-container']}>
            {/* График времени */}
            <div className={`${styles['dashboard__chart']} ${styles['dashboard__chart--time']}`}>
              <div className={`${styles['dashboard__select-button-container']}`}>
                <Button
                  onClick={() => {
                    setTempSelectedCars(selectedTimeCars);
                    setOpenTimeModal(true);
                  }}
                  className={styles['dashboard__select-button']}
                >
                  Выбрать машины ({selectedTimeCars.length})
                </Button>
              </div>
              <VehicleTimeChart data={filteredTimeData} />
            </div>

            {/* График пробега */}
            <div className={`${styles['dashboard__chart']} ${styles['dashboard__chart--mileage']}`}>
              <div className={`${styles['dashboard__select-button-container']}`}>
                <Button
                  onClick={() => {
                    setTempSelectedCars(selectedMileageCars);
                    setOpenMileageModal(true);
                  }}
                  className={styles['dashboard__select-button']}
                >
                  Выбрать машины ({selectedMileageCars.length})
                </Button>
              </div>
              <VehicleMileageChart data={filteredMileageData} />
            </div>

            <div className={`${styles['dashboard__chart']} ${styles['dashboard__chart--douhnut']}`}>
              <ul className={`${styles['dashboard__chart-list']}`}>
                <li className={`${styles['dashboard__chart-item']}`}>
                  <span className={`${styles['dashboard__chart-span']}`}>Кол-во ТС:</span>
                  <span className={`${styles['dashboard__chart-span-val']}`}>1000</span>
                </li>
                <li className={`${styles['dashboard__chart-item']} ${styles['dashboard__chart-item--kpd']}`}>
                  <span className={`${styles['dashboard__chart-span']}`}>КПД:</span>
                  <span className={`${styles['dashboard__chart-span-val']}`}>50%</span>
                </li>
                <li className={`${styles['dashboard__chart-item']} ${styles['dashboard__chart-item--kip']}`}>
                  <span className={`${styles['dashboard__chart-span']}`}>КИП:</span>
                  <span className={`${styles['dashboard__chart-span-val']}`}>51.8%</span>
                </li>
              </ul>
              <UsageDoughnut
                data={[
                  { label: 'Моточасы', value: 70 },
                  { label: 'Простой', value: 50 },
                ]}
                title="Использование ТС"
                unit="ч"
                legendPosition="bottom"
              />
            </div>
            <div className={`${styles['dashboard__chart']} dashboard__chart--activity`}>
              <VehicleActivityChart data={reportData} />
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

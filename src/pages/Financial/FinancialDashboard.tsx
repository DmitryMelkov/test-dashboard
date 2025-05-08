import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import styles from './FinancialDashboard.module.scss';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import UsageDoughnut from '../../components/UsageDoughnut/UsageDoughnut';
import useFinancialStats from '../../hooks/useFinancialStats';
import Loader from '../../ui/loader/Loader';
import { FinancialStat } from '../../types/financialStats';

type LossesDataItem = {
  label: string;
  value: number;
};

const FinancialDashboard = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const { data, loading, error } = useFinancialStats();

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  // Универсальная функция для подсчёта потерь по указанным ключам
  const calculateLosses = (
    keys: { label: string; field: keyof FinancialStat }[]
  ): LossesDataItem[] => {
    return keys.map(({ label, field }) => {
      const total = data.reduce((sum, item) => {
        const value = item[field];
        const numValue =
          typeof value === 'number' ? value : parseFloat(value as string);
        return Number.isNaN(numValue) ? sum : sum + numValue;
      }, 0);

      return { label, value: total };
    });
  };

  // Конфигурации для диаграмм
  const lossesConfig1 = [
    { label: 'Потери на днях простоя', field: 'downtime_losses' as const },
    { label: 'Потери на простое в ремонте', field: 'repair_downtime_losses' as const },
    { label: 'Потери на времени вне смен', field: 'off_shift_time_losses' as const },
  ];

  const lossesConfig2 = [
    { label: 'Сливы топлива', field: 'fuel_drainage_loss' as const },
    { label: 'Недоливы топлива', field: 'underfilling_loss' as const },
    { label: 'Простой на холостом ходу', field: 'idle_running_cost' as const },
  ];

  const lossesData = calculateLosses(lossesConfig1);
  const lossesData2 = calculateLosses(lossesConfig2);

  return (
    <div className={`${styles['financial-dashboard']} ${styles[`financial-dashboard--${theme}`]}`}>
      <Breadcrumbs segments={[{ label: 'Финансовая аналитика' }, { label: 'Дашборд' }]} theme={theme} />
      <h1>Финансовая аналитика</h1>

      <div className={styles['financial-dashboard__chart-container']}>
        <div className={styles['financial-dashboard__chart']}>
          <UsageDoughnut data={lossesData} title="Распределение потерь" unit="р" legendPosition="bottom" cutout="70%" />
        </div>
        <div className={styles['financial-dashboard__chart']}>
          <UsageDoughnut data={lossesData2} title="Потери по типам" unit="р" legendPosition="bottom" cutout="70%" />
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;

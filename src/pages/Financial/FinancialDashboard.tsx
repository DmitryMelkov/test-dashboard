import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import styles from './FinancialDashboard.module.scss';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import UsageDoughnut from '../../components/UsageDoughnut/UsageDoughnut';
import useFinancialStats from '../../hooks/useFinancialStats';
import Loader from '../../ui/loader/Loader';
import { FinancialStat } from '../../types/financialStats';
import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import BarChart, { BarChartDataset } from '../../components/BarChart/BarChart';

type LossesDataItem = {
  label: string;
  value: number;
};

interface GroupedFinancialData {
  date: string;
  fuel_drainage_loss: number;
  underfilling_loss: number;
  idle_running_cost: number;
}

// Функция для подсчёта потерь по указанным ключам
const calculateLosses = (
  data: FinancialStat[],
  keys: { label: string; field: keyof FinancialStat }[]
): LossesDataItem[] => {
  return keys.map(({ label, field }) => {
    const total = data.reduce((sum, item) => {
      const value = item[field];
      const numValue = typeof value === 'number' ? value : parseFloat(value as unknown as string);
      return Number.isNaN(numValue) ? sum : sum + numValue;
    }, 0);
    return { label, value: total };
  });
};

// Группировка данных по дате и суммирование потерь
const groupDataByDate = (data: FinancialStat[]): GroupedFinancialData[] => {
  const grouped: Record<string, GroupedFinancialData> = {};

  data.forEach((item) => {
    const date = item.date;
    if (!grouped[date]) {
      grouped[date] = {
        date,
        fuel_drainage_loss: 0,
        underfilling_loss: 0,
        idle_running_cost: 0,
      };
    }

    grouped[date].fuel_drainage_loss += Number(item.fuel_drainage_loss) || 0;
    grouped[date].underfilling_loss += Number(item.underfilling_loss) || 0;
    grouped[date].idle_running_cost += Number(item.idle_running_cost) || 0;
  });

  return Object.values(grouped).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const FinancialDashboard = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const { data, loading, error } = useFinancialStats();
  const [activeTab, setActiveTab] = useState(0);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

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
  const lossesConfig3 = [
    { label: 'Расход на ЗП за период', field: 'salary_expenses' as const },
    { label: 'Расход на топливо', field: 'fuel_expenses' as const },
    { label: 'Амортизация', field: 'depreciation' as const },
    { label: 'Запчасти', field: 'spare_parts' as const },
  ];

  const lossesData = calculateLosses(data, lossesConfig1);
  const lossesData2 = calculateLosses(data, lossesConfig2);
  const lossesData3 = calculateLosses(data, lossesConfig3);

  // Подготовка данных для гистограммы по датам
  const datasets: BarChartDataset<GroupedFinancialData>[] = [
    {
      label: 'Сливы топлива',
      field: 'fuel_drainage_loss',
    },
    {
      label: 'Недоливы топлива',
      field: 'underfilling_loss',
    },
    {
      label: 'Простой на холостом ходу',
      field: 'idle_running_cost',
    },
  ];

  const groupedData = groupDataByDate(data);

  return (
    <div className={`${styles['financial-dashboard']} ${styles[`financial-dashboard--${theme}`]}`}>
      <Breadcrumbs segments={[{ label: 'Финансовая аналитика' }, { label: 'Дашборд' }]} theme={theme} />

      <div className={`${styles['financial-dashboard__chart-container']}`}>
        <Box className={styles['financial-dashboard__tabs-container']}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={(_e, newValue) => setActiveTab(newValue)}
              aria-label="basic tabs example"
              TabIndicatorProps={{
                style: {
                  backgroundColor: theme === 'dark' ? '#ffffff' : '#1890ff',
                },
              }}
              sx={{
                '& .MuiTab-root': {
                  color: theme === 'dark' ? '#cccccc' : '#333',
                },
                '& .MuiTab-root.Mui-selected': {
                  color: theme === 'dark' ? '#ffffff' : '#1890ff',
                },
              }}
            >
              <Tab className={styles['financial-dashboard__tab-btn']} label="Распределение потерь" />
              <Tab className={styles['financial-dashboard__tab-btn']} label="Потери по типам" />
              <Tab className={styles['financial-dashboard__tab-btn']} label="Расходы" />
            </Tabs>
          </Box>

          <div className={styles['financial-dashboard__charts-doughnut']}>
            {activeTab === 0 && (
              <div className={styles['financial-dashboard__chart-doughnut']}>
                <UsageDoughnut data={lossesData} unit="Р" legendPosition="bottom" cutout="70%" />
              </div>
            )}
            {activeTab === 1 && (
              <div className={styles['financial-dashboard__chart-doughnut']}>
                <UsageDoughnut data={lossesData2} unit="Р" legendPosition="bottom" cutout="70%" />
              </div>
            )}
            {activeTab === 2 && (
              <div className={styles['financial-dashboard__chart-doughnut']}>
                <UsageDoughnut data={lossesData3} unit="Р" legendPosition="bottom" cutout="70%" />
              </div>
            )}
          </div>
        </Box>
        <div className={styles['financial-dashboard__chart-bar']}>
          <BarChart<GroupedFinancialData>
            data={groupedData}
            datasets={datasets}
            title="Суммарные потери по дням"
            unit="Р"
            legendPosition="bottom"
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;

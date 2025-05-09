import { FinancialStat } from '../types/financialStats';

export type LossesDataItem = {
  label: string;
  value: number;
};

export interface GroupedFinancialData {
  date: string;
  fuel_drainage_loss: number;
  underfilling_loss: number;
  idle_running_cost: number;
}

export const calculateLosses = (
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

export const groupDataByDate = (data: FinancialStat[]): GroupedFinancialData[] => {
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

  return Object.values(grouped).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};
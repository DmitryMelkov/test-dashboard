import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import styles from './ReportTable.module.scss';
import { VehicleStats } from '../../types/VehicleStats';

interface ReportTableProps {
  data: VehicleStats[];
}

const ReportTable = ({ data }: ReportTableProps) => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  const columns = [
    // { key: 'vehicle_id', header: '№' },
    { key: 'vehicle_name', header: 'Объект' },
    { key: 'vehicle_group', header: 'Группа объекта' },
    { key: 'vehicle_type', header: 'Вид объекта' },
    { key: 'vehicle_age', header: 'Возраст объекта' },
    { key: 'shift_days', header: 'Кол-во смен, дней' },
    { key: 'idle_shift_days', header: 'Кол-во смен простоя, дней' },
    { key: 'mileage_km', header: 'Пробег, км' },
    { key: 'motohours', header: 'Время работы ДВС, м/час' },
    { key: 'daily_mileage', header: 'Коэф использования: Средний пробег в день, км' },
    { key: 'daily_motohours', header: 'Коэф использования: Средние м/ч в день' },
    { key: 'working_hours', header: 'Время работы в период смен, ч' },
    { key: 'moving_hours', header: 'Время движения, ч' },
    { key: 'efficiency_transport_hours', header: 'КПД транс, ч' },
    { key: 'efficiency_special_hours', header: 'КПД Спец, Ч' },
    { key: 'engine_on_idle_hours', header: 'Простой на ХХ, ч' },
    { key: 'engine_off_idle_hours', header: 'Простой с выкл ДВС, ч' },
    { key: 'non_shift_hours', header: 'Время вне смен, ч' },
    { key: 'additional_equipment_hours', header: 'Время ДО, ч' },
    { key: 'moving_percent', header: 'Движение в %' },
    { key: 'efficiency_percent', header: 'КПД, %' },
    { key: 'engine_on_idle_percent', header: 'Простой на ХХ, %' },
    { key: 'idle_in_shift_percent', header: 'Простой в смену, %' },
    { key: 'non_shift_percent', header: 'Время вне смен, %' },
    { key: 'additional_equipment_percent', header: 'Время ДО, %' },
    { key: 'mileage_per_motohour', header: 'Пробег/часы' },
    { key: 'engine_idle_rpm_hours', header: 'ХХ, ч' },
    { key: 'engine_load_rpm_hours', header: 'Время на норм оборотах, ч' },
    { key: 'engine_idle_rpm_percent', header: 'ХХ, %' },
  ];

  return (
    <div className={`${styles['report-table']} ${theme === 'dark' ? styles['report-table--dark'] : ''}`}>
      <div className={styles['report-table__container']}>
        <table className={styles['report-table__table']}>
          <thead className={styles['report-table__header']}>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={styles['report-table__cell']}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={styles['report-table__body']}>
            {data.map((vehicle) => (
              <tr key={vehicle.vehicle_id} className={styles['report-table__row']}>
                {columns.map((column) => {
                  const value = vehicle[column.key as keyof VehicleStats];
                  return (
                    <td key={`${vehicle.vehicle_id}-${column.key}`} className={styles['report-table__cell']}>
                      {value === null || value === undefined ? '-' : value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { CarReport } from '../../types/CarReport';
import styles from './ReportTable.module.scss';

interface ReportTableProps {
  data: CarReport[];
}

const ReportTable = ({ data }: ReportTableProps) => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <div className={`${styles['report-table']} ${theme === 'dark' ? styles['report-table--dark'] : ''}`}>
      <div className={styles['report-table__container']}>
        <table className={styles['report-table__table']}>
          <thead className={styles['report-table__header']}>
            <tr>
              <th className={styles['report-table__cell']}>Машина</th>
              <th className={styles['report-table__cell']}>Дата</th>
              <th className={styles['report-table__cell']}>Моточасы</th>
              <th className={styles['report-table__cell']}>Пробег (км)</th>
              <th className={styles['report-table__cell']}>Расход топлива (л)</th>
              <th className={styles['report-table__cell']}>Время простоя (ч)</th>
              <th className={styles['report-table__cell']}>Заправлено (л)</th>
            </tr>
          </thead>
          <tbody className={styles['report-table__body']}>
            {data.map((car) => (
              <tr key={`${car.car_name}-${car.car_data.date}`} className={styles['report-table__row']}>
                <td className={styles['report-table__cell']}>{car.car_name}</td>
                <td className={`${styles['report-table__cell']} ${styles['report-table__cell--date']}`}>
                  {car.car_data.date}
                </td>
                <td className={styles['report-table__cell']}>{car.car_data.motohours.toFixed(2)}</td>
                <td className={styles['report-table__cell']}>{car.car_data.millage.toFixed(2)}</td>
                <td className={styles['report-table__cell']}>{car.car_data.consumption_total.toFixed(2)}</td>
                <td className={styles['report-table__cell']}>{car.car_data.idle_time.toFixed(2)}</td>
                <td className={styles['report-table__cell']}>{car.car_data.filled_real.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;

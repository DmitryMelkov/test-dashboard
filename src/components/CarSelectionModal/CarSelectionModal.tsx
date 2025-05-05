import { FC } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel, Box, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import Button from '../../ui/Button/Button';
import styles from './CarSelectionModal.module.scss';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';

interface CarSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  reportData: any[];
  selectedCars: string[];
  onToggleCar: (carName: string) => void;
  onSelectAll: () => void;
  sortKey: string; // 'idle_time' или 'millage'
  unit: string; // 'ч' или 'км'
  title: string;
}

const CarSelectionModal: FC<CarSelectionModalProps> = ({
  open,
  onClose,
  onApply,
  reportData,
  selectedCars,
  onToggleCar,
  onSelectAll,
  sortKey,
  unit,
  title,
}) => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  // Функция для получения значения параметра
  const getCarValue = (car: any) => {
    return car.car_data[sortKey] || 0;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className={`${styles['modal']} ${styles[`modal--${theme}`]}`}
      PaperProps={{
        className: `${styles['modal-paper']} ${styles[`modal-paper--${theme}`]}`
      }}
    >
      <DialogTitle className={`${styles['modal-title']} ${styles[`modal-title--${theme}`]}`}>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          className={styles['modal-close-button']}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        className={`${styles['modal-content']} ${styles[`modal-content--${theme}`]}`}
      >
        <Box sx={{ mb: 2 }}>
          <Button onClick={onSelectAll}>
            {selectedCars.length === reportData.length ? 'Снять все' : 'Выбрать все'}
          </Button>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            maxHeight: '60vh',
            overflow: 'auto',
            paddingLeft: '10px'
          }}
          className={`${styles['modal-cars-container']} ${styles[`modal-cars-container--${theme}`]}`}
        >
          {reportData
            .sort((a, b) => getCarValue(b) - getCarValue(a)) // Сортировка по убыванию
            .map((car) => (
              <FormControlLabel
                key={car.car_name}
                control={
                  <Checkbox
                    checked={selectedCars.includes(car.car_name)}
                    onChange={() => onToggleCar(car.car_name)}
                    className={`${styles['modal-checkbox']} ${styles[`modal-checkbox--${theme}`]}`}
                  />
                }
                label={`${car.car_name} (${getCarValue(car)}${unit})`}
                className={`${styles['modal-label']} ${styles[`modal-label--${theme}`]}`}
              />
            ))}
        </Box>
      </DialogContent>
      <DialogActions className={`${styles['modal-actions']} ${styles[`modal-actions--${theme}`]}`}>
        <Button onClick={onApply}>
          Применить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CarSelectionModal;
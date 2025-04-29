import { FC } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel, Box, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import Button from '../../ui/Button/Button';

interface CarSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  reportData: any[];
  selectedCars: string[];
  onToggleCar: (carName: string) => void;
  onSelectAll: () => void;
}

const CarSelectionModal: FC<CarSelectionModalProps> = ({
  open,
  onClose,
  onApply,
  reportData,
  selectedCars,
  onToggleCar,
  onSelectAll,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Выберите машины для отображения
        <IconButton
          aria-label="close"
          onClick={onClose}
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
      <DialogContent dividers>
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
        >
          {reportData
            .sort((a, b) => b.car_data.idle_time - a.car_data.idle_time)
            .map((car) => (
              <FormControlLabel
                key={car.car_name}
                control={
                  <Checkbox
                    checked={selectedCars.includes(car.car_name)}
                    onChange={() => onToggleCar(car.car_name)}
                  />
                }
                label={`${car.car_name} (${car.car_data.idle_time}ч)`}
              />
            ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onApply}>
          Применить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CarSelectionModal;
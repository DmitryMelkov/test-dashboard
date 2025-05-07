import { FC } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import styles from './TableModal.module.scss';
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import ReportTable from '../ReportTable';

interface TableModalProps {
  open: boolean;
  onClose: () => void;
  data: any[];
  title: string;
}

const TableModal: FC<TableModalProps> = ({ open, onClose, data, title }) => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      className={`${styles['modal']} ${styles[`modal--${theme}`]}`}
      PaperProps={{
        className: `${styles['modal-paper']} ${styles[`modal-paper--${theme}`]}`,
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
      <DialogContent dividers className={`${styles['modal-content']} ${styles[`modal-content--${theme}`]}`}>
        <div>
          <ReportTable data={data} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TableModal;

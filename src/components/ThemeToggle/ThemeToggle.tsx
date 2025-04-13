import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../store/themeSlice';
import styles from './ThemeToggle.module.scss';
import { RootState } from '../../store';

const ThemeToggle = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();

  return (
    <div className={styles['theme-toggle']}>
      <label className={styles['theme-toggle__switch']}>
        <input
          type="checkbox"
          className={styles['theme-toggle__input']}
          checked={theme === 'dark'}
          onChange={() => dispatch(toggleTheme())}
        />
        <span className={styles['theme-toggle__slider']}></span>
      </label>
      <span className={styles['theme-toggle__label']}>
        {theme === 'light' ? 'Темная тема' : 'Светлая тема'}
      </span>
    </div>
  );
};

export default ThemeToggle;
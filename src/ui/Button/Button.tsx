// components/Button/Button.tsx
import { FC, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  active?: boolean;
  theme?: 'light' | 'dark';
}

const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  active = false,
  theme = 'light',
  className = '',
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    active ? styles['button--active'] : '',
    styles[`button--${theme}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
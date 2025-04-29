import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.scss';
import React from 'react';

interface Breadcrumb {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  segments: Breadcrumb[];
  theme?: 'light' | 'dark';
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ segments, theme = 'light' }) => {
  return (
    <div className={`${styles.breadcrumbs} ${styles[`breadcrumbs--${theme}`]}`}>
      {segments.map((segment, index) => (
        <React.Fragment key={index}>
          {segment.path ? (
            <Link to={segment.path} className={styles['breadcrumbs-link']}>
              {segment.label}
            </Link>
          ) : (
            <span className={styles['breadcrumbs-current']}>{segment.label}</span>
          )}
          {index < segments.length - 1 && (
            <span className={styles['breadcrumbs-separator']}>/</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
import styles from './Loader.module.scss';

export default function Loader() {
  return (
    <div className={`${styles.loaderContainer}`}>
      <div className={styles.reactLogo} style={{ width: 100, height: 100 }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348" className={styles.reactSvg}>
          <defs>
            {/* Линейный градиент для орбит */}
            <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#1890ff', stopOpacity: 1 }} /> {/* clear-chill */}
              <stop offset="100%" style={{ stopColor: '#40a9ff', stopOpacity: 1 }} /> {/* adamantine-blue */}
            </linearGradient>

            {/* Радиальный градиент для центральной точки */}
            <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{ stopColor: '#000000', stopOpacity: 1 }} /> {/* black */}
              <stop offset="100%" style={{ stopColor: '#1890ff', stopOpacity: 1 }} /> {/* clear-chill */}
            </radialGradient>
          </defs>

          {/* Центральная точка */}
          <circle cx="0" cy="0" r="2.05" fill="url(#coreGradient)" className={styles.centerDot} />

          {/* Орбиты */}
          <ellipse
            rx="11"
            ry="4.2"
            stroke="url(#orbitGradient)"
            strokeWidth="1"
            fill="none"
            className={styles.orbit1}
          />
          <ellipse
            rx="11"
            ry="4.2"
            stroke="url(#orbitGradient)"
            strokeWidth="1"
            fill="none"
            transform="rotate(60)"
            className={styles.orbit2}
          />
          <ellipse
            rx="11"
            ry="4.2"
            stroke="url(#orbitGradient)"
            strokeWidth="1"
            fill="none"
            transform="rotate(120)"
            className={styles.orbit3}
          />
        </svg>
      </div>
      <p className={styles.loaderText}>Идет загрузка, пожалуйста подождите</p>
    </div>
  );
}

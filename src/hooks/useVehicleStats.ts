import { useState, useEffect } from 'react';
import { VehicleStats } from '../types/VehicleStats';

const useVehicleStats = () => {
  const [vehicleStats, setVehicleStats] = useState<VehicleStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicleStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/vehicle-stats');
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных');
        }
        const data = await response.json();
        console.log(data);

        setVehicleStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleStats();
  }, []);

  return { vehicleStats, loading, error };
};

export default useVehicleStats;
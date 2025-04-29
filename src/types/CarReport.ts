export interface CarReport {
  car_name: string;
  wln_id: number;
  car_data: {
    id: number;
    date: string;
    wln_id: number;
    motohours: number;
    millage: number;
    consumption_total: number;
    drained: number;
    filled_real: number;
    filled_bill: number;
    idle_time: number;
  };
}

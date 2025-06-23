export interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface TemperatureReading {
  _id: string;
  deviceId: string;
  temperature: number;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

import React from "react";
import { TemperatureReading } from "../types";

interface SensorCardProps {
  reading: TemperatureReading;
}

const SensorCard: React.FC<SensorCardProps> = ({ reading }) => {
  const getStatusInfo = (temp: number) => {
    // Faixa ideal para vacinas: 2°C a 8°C
    if (temp >= 2 && temp <= 8) {
      return {
        color: "#4CAF50",
        text: "✅ Normal",
        description: "Temperatura ideal para vacinas",
      };
    }
    if ((temp >= 1.5 && temp < 2) || (temp > 8 && temp <= 8.5)) {
      return {
        color: "#FF9800",
        text: "⚠️ Atenção",
        description: "Próximo ao limite - monitorar",
      };
    }
    return {
      color: "#F44336",
      text: "🚨 Crítico",
      description: "Fora da faixa segura para vacinas",
    };
  };

  const statusInfo = getStatusInfo(reading.temperature);

  return (
    <div
      className="sensor-card"
      style={{ borderLeft: `5px solid ${statusInfo.color}` }}
    >
      <h3>🌡️ Sensor {reading.deviceId}</h3>
      <div className="temperature">{reading.temperature.toFixed(1)}°C</div>

      <div className="status-container">
        <div className="status" style={{ color: statusInfo.color }}>
          {statusInfo.text}
        </div>
        <div className="status-description">{statusInfo.description}</div>
      </div>

      <div className="vaccine-range">
        <small>Faixa ideal: 2°C - 8°C</small>
      </div>

      <div className="timestamp">
        {new Date(reading.timestamp).toLocaleString("pt-BR")}
      </div>
    </div>
  );
};

export default SensorCard;

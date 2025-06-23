import React, { useEffect, useState } from "react";
import NotificationPanel from "../components/NotificationPanel";
import { fetchTemperatureData } from "../services/api";
import { TemperatureReading } from "../types";
import SensorCard from "./SensorCard";

const Dashboard: React.FC = () => {
  const [readings, setReadings] = useState<TemperatureReading[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  // Função para verificar alertas baseado nas temperaturas
  const checkTemperatureAlerts = (readings: TemperatureReading[]) => {
    const newAlerts: any[] = [];

    readings.forEach((reading) => {
      const temp = reading.temperature;
      const deviceName = reading.deviceId;

      // Faixa ideal para vacinas: 2°C a 8°C
      if (temp < 2) {
        newAlerts.push({
          id: `${reading._id}_cold`,
          type: "critical",
          deviceId: deviceName,
          temperature: temp,
          message: `🚨 CRÍTICO: Temperatura muito baixa (${temp}°C)`,
          description: "Vacinas podem congelar e perder eficácia",
          timestamp: new Date(reading.timestamp),
        });
      } else if (temp > 8) {
        newAlerts.push({
          id: `${reading._id}_hot`,
          type: "critical",
          deviceId: deviceName,
          temperature: temp,
          message: `🚨 CRÍTICO: Temperatura muito alta (${temp}°C)`,
          description: "Vacinas podem perder potência e eficácia",
          timestamp: new Date(reading.timestamp),
        });
      } else if (temp < 2.5 || temp > 7.5) {
        newAlerts.push({
          id: `${reading._id}_warning`,
          type: "warning",
          deviceId: deviceName,
          temperature: temp,
          message: `⚠️ ATENÇÃO: Temperatura próxima ao limite (${temp}°C)`,
          description: "Monitorar de perto - pode afetar as vacinas",
          timestamp: new Date(reading.timestamp),
        });
      }
    });

    setAlerts(newAlerts);
  };

  useEffect(() => {
    const getTemperatureData = async () => {
      try {
        setLoading(true);
        const data = await fetchTemperatureData();
        setReadings(data);
        checkTemperatureAlerts(data);
        setError(null);
      } catch (err) {
        setError("Falha ao carregar dados de temperatura");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getTemperatureData();

    // Atualizar a cada 30 segundos
    const interval = setInterval(getTemperatureData, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div>🔄 Carregando dados dos sensores...</div>
          <p style={{ marginTop: "10px", fontSize: "1rem", opacity: 0.8 }}>
            Conectando com dispositivos IoT
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">
          <div>⚠️ {error}</div>
          <p style={{ marginTop: "10px", fontSize: "1rem", opacity: 0.9 }}>
            Verifique a conexão com o backend ou se o dispositivo ESP32 está
            ligado
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header do Dashboard com informações e notificações */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>📊 Monitoramento de Vacinas</h1>
          <p className="dashboard-subtitle">
            Sistema de controle de temperatura em tempo real
          </p>
        </div>

        {/* Badge de notificações */}
        <div className="notifications-badge">
          {alerts.length > 0 ? (
            <div className="alert-badge has-alerts">
              <span className="badge-icon">🔔</span>
              <span className="badge-count">{alerts.length}</span>
              <span className="badge-text">Alertas</span>
            </div>
          ) : (
            <div className="alert-badge no-alerts">
              <span className="badge-icon">✅</span>
              <span className="badge-text">Tudo Normal</span>
            </div>
          )}
        </div>
      </div>

      {/* Painel de Notificações */}
      <NotificationPanel alerts={alerts} />

      {/* Informações sobre faixa ideal */}
      <div className="temperature-info">
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Faixa Ideal:</span>
            <span className="ideal-range">2°C - 8°C</span>
          </div>
          <div className="info-item">
            <span className="info-label">Status:</span>
            <span className="status-legend">
              🟢 Normal | 🟡 Atenção | 🔴 Crítico
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Atualização:</span>
            <span className="update-time">A cada 30 segundos</span>
          </div>
        </div>
      </div>

      {readings.length === 0 ? (
        <div className="no-data-state">
          <div className="no-data-icon">📡</div>
          <h2>Aguardando Dados</h2>
          <p>
            Nenhum dado de temperatura foi recebido ainda.
            <br />
            Verifique se o dispositivo ESP32 está ligado e conectado à rede
            WiFi.
          </p>
          <div className="connection-status">
            <div className="status-item">
              <span className="status-dot connecting"></span>
              <span>Tentando conectar...</span>
            </div>
          </div>
          <p className="last-update">
            ⏱️ Última tentativa: {new Date().toLocaleString("pt-BR")}
          </p>
        </div>
      ) : (
        <div className="sensors-grid">
          {readings.map((reading) => (
            <SensorCard key={reading._id} reading={reading} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import NotificationPanel from "../components/NotificationPanel";
import { fetchTemperatureData } from "../services/api";
import { TemperatureReading } from "../types";
import SensorCard from "./SensorCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

// Memoized Chart component to prevent unnecessary re-renders
const TemperatureChart = React.memo(
  ({ options, data }: { options: any; data: any }) => {
    console.log("TemperatureChart render:", { data, options: !!options });
    return (
      <div style={{ height: "400px", width: "100%" }}>
        <Line options={options} data={data} />
      </div>
    );
  }
);
TemperatureChart.displayName = "TemperatureChart";

const Dashboard: React.FC = () => {
  const [readings, setReadings] = useState<TemperatureReading[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]); // Static fallback data to prevent constant re-renders
  const fallbackData = useMemo(() => {
    const now = Date.now();
    return [
      {
        _id: "fallback-1",
        deviceId: "ESP32-Demo",
        createdAt: new Date(now - 120000).toISOString(),
        timestamp: new Date(now - 120000).toISOString(),
        updatedAt: new Date(now - 120000).toISOString(),
        temperature: 4,
      },
      {
        _id: "fallback-2",
        deviceId: "ESP32-Demo",
        createdAt: new Date(now - 60000).toISOString(),
        timestamp: new Date(now - 60000).toISOString(),
        updatedAt: new Date(now - 60000).toISOString(),
        temperature: 6,
      },
      {
        _id: "fallback-3",
        deviceId: "ESP32-Demo",
        createdAt: new Date(now).toISOString(),
        timestamp: new Date(now).toISOString(),
        updatedAt: new Date(now).toISOString(),
        temperature: 5,
      },
    ];
  }, []);
  // Chart options - memoized to prevent re-renders
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 0 },
      plugins: {
        legend: { position: "top" as const },
        title: { display: false },
        annotation: {
          annotations: {
            lowerLimit: {
              type: "line" as const,
              yMin: 2,
              yMax: 2,
              borderColor: "#f44336",
              borderWidth: 2,
              label: {
                content: "2°C",
                display: true,
                position: "start" as const,
                backgroundColor: "#f44336",
              },
            },
            upperLimit: {
              type: "line" as const,
              yMin: 8,
              yMax: 8,
              borderColor: "#f44336",
              borderWidth: 2,
              label: {
                content: "8°C",
                display: true,
                position: "start" as const,
                backgroundColor: "#f44336",
              },
            },
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: "Hora" },
          type: "category" as const,
        },
        y: {
          title: { display: true, text: "Temperatura (°C)" },
          type: "linear" as const,
          min: 0,
          max: 22,
          ticks: {
            stepSize: 2,
          },
        },
      },
      interaction: {
        intersect: false,
      },
      elements: {
        point: {
          radius: 4,
        },
      },
    }),
    []
  ); // Chart data - only recalculated when readings change
  const chartData = useMemo(() => {
    const points =
      readings.length > 0 ? [...readings].slice(0, 10).reverse() : fallbackData;

    console.log("Chart data calculation:", {
      readingsLength: readings.length,
      pointsLength: points.length,
      points: points.slice(0, 3), // Log first 3 points for debugging
    });

    const result = {
      labels: points.map((r) => {
        const date =
          typeof r.createdAt === "string" ? new Date(r.createdAt) : r.createdAt;
        return date.toLocaleTimeString();
      }),
      datasets: [
        {
          label: "Temperatura (°C)",
          data: points.map((r) => r.temperature),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.1,
        },
      ],
    };

    console.log("Chart data result:", result);
    return result;
  }, [readings, fallbackData]);
  // Memoized function to check temperature alerts
  const checkTemperatureAlerts = useCallback(
    (readings: TemperatureReading[]) => {
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
    },
    []
  );

  useEffect(() => {
    const getTemperatureData = async () => {
      try {
        setLoading(true);
        const data = await fetchTemperatureData();

        // Ordenar por createdAt do mais recente para o mais antigo
        const sortedData: TemperatureReading[] = data.sort(
          (a: TemperatureReading, b: TemperatureReading) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setReadings(sortedData);
        checkTemperatureAlerts(sortedData);
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
  }, [checkTemperatureAlerts]);

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
      </div>{" "}
      {/* Chart showing temperature over time */}
      <div className="chart-section">
        <div className="chart-card">
          <h2>Temperatura ao longo do tempo</h2>
          <TemperatureChart options={chartOptions} data={chartData} />
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

import React, { useState } from "react";

interface Alert {
  id: string;
  type: "critical" | "warning";
  deviceId: string;
  temperature: number;
  message: string;
  description: string;
  timestamp: Date;
}

interface NotificationPanelProps {
  alerts: Alert[];
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ alerts }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const activeAlerts = alerts.filter(
    (alert) => !dismissedAlerts.includes(alert.id)
  );
  const criticalAlerts = activeAlerts.filter(
    (alert) => alert.type === "critical"
  );
  const warningAlerts = activeAlerts.filter(
    (alert) => alert.type === "warning"
  );

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts((prev) => [...prev, alertId]);
  };

  const clearAllAlerts = () => {
    setDismissedAlerts(alerts.map((alert) => alert.id));
  };

  // Sempre mostra o painel, mas com estados diferentes
  const hasAlerts = activeAlerts.length > 0;

  return (
    <div
      className={`notification-panel ${hasAlerts ? "has-alerts" : "no-alerts"}`}
    >
      <div className="alert-summary" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="alert-header">
          <span className="alert-title">🔔 Central de Notificações</span>
          {hasAlerts ? (
            <div className="alert-counts">
              {criticalAlerts.length > 0 && (
                <span className="critical-count">
                  🚨 {criticalAlerts.length} Crítico
                  {criticalAlerts.length > 1 ? "s" : ""}
                </span>
              )}
              {warningAlerts.length > 0 && (
                <span className="warning-count">
                  ⚠️ {warningAlerts.length} Aviso
                  {warningAlerts.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          ) : (
            <div className="no-alerts-status">
              <span className="status-text">✅ Nenhuma notificação</span>
            </div>
          )}
        </div>
        <button className="expand-btn">
          {isExpanded ? "▲ Recolher" : "▼ Expandir"}
        </button>
      </div>

      {isExpanded && (
        <div className="alerts-detail">
          {hasAlerts ? (
            <>
              <div className="alerts-header">
                <h4>📋 Detalhes dos Alertas</h4>
                <button onClick={clearAllAlerts} className="clear-all-btn">
                  🗑️ Limpar Todas
                </button>
              </div>

              <div className="alerts-list">
                {activeAlerts.map((alert) => (
                  <div key={alert.id} className={`alert-item ${alert.type}`}>
                    <div className="alert-main">
                      <div className="alert-message">{alert.message}</div>
                      <div className="alert-device">
                        🔧 Sensor: {alert.deviceId}
                      </div>
                      <div className="alert-description">
                        {alert.description}
                      </div>
                      <div className="alert-time">
                        🕒 {alert.timestamp.toLocaleString("pt-BR")}
                      </div>
                    </div>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="dismiss-btn"
                      title="Dispensar alerta"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-alerts-content">
              <div className="no-alerts-icon">🌡️</div>
              <h4>Sistema Monitorando</h4>
              <p>
                Todas as temperaturas estão dentro da faixa ideal para vacinas
                (2°C - 8°C)
              </p>
              <div className="monitoring-status">
                <div className="status-item">
                  <span className="status-dot normal"></span>
                  <span>Monitoramento ativo</span>
                </div>
                <div className="status-item">
                  <span className="status-dot normal"></span>
                  <span>Alertas em tempo real</span>
                </div>
              </div>
              <p className="last-check">
                🕒 Última verificação: {new Date().toLocaleString("pt-BR")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;

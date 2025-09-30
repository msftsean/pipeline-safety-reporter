import { useState, useEffect } from 'react'
import './App.css'

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    api: string;
    database: string;
    storage: string;
  };
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHealth(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health status');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Connecting to Pipeline Safety Reporter API...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>🚨 Connection Error</h2>
          <p>{error}</p>
          <button onClick={fetchHealth} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🚨 Pipeline Safety Reporter</h1>
        <p className="subtitle">Emergency pipeline incident reporting system</p>
      </header>

      <main className="main">
        <div className="status-card">
          <h2>System Status</h2>
          {health && (
            <div className="status-info">
              <div className="status-item">
                <span className="label">Status:</span>
                <span className={`status ${health.status}`}>{health.status}</span>
              </div>
              <div className="status-item">
                <span className="label">Version:</span>
                <span>{health.version}</span>
              </div>
              <div className="status-item">
                <span className="label">Environment:</span>
                <span>{health.environment}</span>
              </div>
              <div className="status-item">
                <span className="label">Uptime:</span>
                <span>{Math.round(health.uptime)}s</span>
              </div>
            </div>
          )}
        </div>

        <div className="services-card">
          <h2>Service Health</h2>
          {health?.services && (
            <div className="services-grid">
              <div className="service-item">
                <span className="service-name">API</span>
                <span className={`service-status ${health.services.api}`}>
                  {health.services.api}
                </span>
              </div>
              <div className="service-item">
                <span className="service-name">Database</span>
                <span className={`service-status ${health.services.database}`}>
                  {health.services.database}
                </span>
              </div>
              <div className="service-item">
                <span className="service-name">Storage</span>
                <span className={`service-status ${health.services.storage}`}>
                  {health.services.storage}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="actions-card">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn primary" disabled>
              📍 Report Pipeline Issue
            </button>
            <button className="action-btn secondary" disabled>
              🗺️ View Safety Map
            </button>
            <button className="action-btn" onClick={fetchHealth}>
              🔄 Refresh Status
            </button>
          </div>
          <p className="note">
            <strong>Emergency Notice:</strong> For immediate emergencies, call 911. 
            This system is for safety incident reporting and documentation.
          </p>
        </div>
      </main>

      <footer className="footer">
        <p>Built with safety-first principles for community pipeline incident reporting</p>
        <p>Version {health?.version} • {health?.timestamp}</p>
      </footer>
    </div>
  );
}

export default App;
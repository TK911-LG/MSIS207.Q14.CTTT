/** @jsx createElement */
import { createElement, useState } from './jsx-runtime';
import { DataService } from './data-service';
import { Card } from './components.tsx';
import { Chart } from './chart.tsx';

const dataService = new DataService();
let updateInterval: any = null;

export const Dashboard = () => {
  const [getData, setData] = useState(dataService.getData());
  const [getChartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [getIsRealTime, setIsRealTime] = useState(false);

  const handleChartTypeChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    setChartType(select.value as 'bar' | 'line' | 'pie');
  };

  const handleRefreshData = () => {
    dataService.reset();
    setData(dataService.getData());
  };

  const handleToggleRealTime = () => {
    const isEnabled = !getIsRealTime();
    setIsRealTime(isEnabled);

    if (isEnabled && !updateInterval) {
      updateInterval = dataService.startRealTimeUpdates(2000);
      dataService.subscribe((newData) => {
        setData(newData);
      });
    } else if (!isEnabled && updateInterval) {
      updateInterval();
      updateInterval = null;
    }
  };

  const currentData = getData();
  const currentChartType = getChartType();
  const isRealTimeEnabled = getIsRealTime();

  const stats = [
    { title: 'Average Value', value: Math.round(dataService.getAverage()), color: '#667eea' },
    { title: 'Maximum Value', value: Math.round(dataService.getMax()), color: '#10b981' },
    { title: 'Minimum Value', value: Math.round(dataService.getMin()), color: '#ef4444' },
    { title: 'Data Points', value: currentData.length, color: '#f59e0b' },
  ];

  return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>📊 Analytics Dashboard</h1>
          <p style={{ color: '#6b7280', fontSize: '16px', marginTop: '10px' }}>
            Real-time data visualization and monitoring
          </p>

          <div className="dashboard-controls">
            <label style={{ fontWeight: '600', marginRight: '8px' }}>Chart Type: </label>
            <select value={currentChartType} onChange={handleChartTypeChange}>
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="pie">Pie</option>
            </select>

            <button onClick={handleRefreshData}>🔄 Refresh Data</button>

            <button
                onClick={handleToggleRealTime}
                style={{ background: isRealTimeEnabled ? '#ef4444' : '#10b981' }}
            >
              {isRealTimeEnabled ? '⏸ Stop Real-Time' : '▶️ Start Real-Time'}
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          {stats.map((stat) => (
              <Card
                  className="stat-card"
                  style={{ borderLeft: `4px solid ${stat.color}` }}
              >
                <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                  {stat.title}
                </h3>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color }}>
                  {stat.value}
                </div>
              </Card>
          ))}
        </div>

        <div style={{ marginTop: '30px' }}>
          <Chart
              data={currentData}
              type={currentChartType}
              width={800}
              height={400}
              title={`${currentChartType.charAt(0).toUpperCase() + currentChartType.slice(1)} Chart - Data Overview`}
          />
        </div>
      </div>
  );
};

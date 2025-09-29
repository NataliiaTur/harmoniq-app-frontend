// components/TeacherAnalyticsDashboard.jsx
import { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip } from 'recharts';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

export const TeacherAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  
  useEffect(() => {
    fetch('/api/analytics/teacher/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setAnalytics);
  }, []);
  
  if (!analytics) return <div>Завантаження...</div>;
  
  // Дані для графіків
  const trafficData = Object.entries(analytics.trafficSources).map(([key, value]) => ({
    name: key,
    value
  }));
  
  return (
    <div className="analytics-dashboard">
      <h1>Аналітика ваших матеріалів</h1>
      
      <div className="metrics-grid">
        <MetricCard title="Відвідувачів" value={analytics.totalVisitors} />
        <MetricCard title="Переглядів" value={analytics.totalPageViews} />
        <MetricCard title="В кошик" value={analytics.cartAdditions} />
        <MetricCard title="Покупок" value={analytics.purchases} />
        <MetricCard title="Конверсія" value={`${analytics.conversionRate}%`} />
        <MetricCard title="Час на сайті" value={`${Math.round(analytics.avgSessionDuration / 60)} хв`} />
      </div>
      
      <div className="charts">
        <div>
          <h3>Джерела трафіку</h3>
          <PieChart width={400} height={300}>
            <Pie data={trafficData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {trafficData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        
        <div>
          <h3>Популярні матеріали</h3>
          {/* Графік популярних статей */}
        </div>
      </div>
      
      <UserJourneyVisualizer />
    </div>
  );
};
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/authSlice/authSelectors';
import { Container } from '../../components/Container/Container';
import s from './AnalyticsPage.module.css';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LoaderPage } from '../../components/Loader/LoaderPage/LoaderPage';
import { api } from '../../redux/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AnalyticsPage = () => {
  const user = useSelector(selectUser);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching analytics with:', {
        userId: user?._id,
        hasToken: !!api.defaults.headers.common.Authorization,
        tokenPreview: api.defaults.headers.common.Authorization?.substring(0, 40)
    });

      const params = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const response = await api.get('/analytics/teacher/dashboard', { params });
      console.log('✅ Analytics fetched:', response.data);

      setAnalytics(response.data);
    } catch (error) {
      console.error('Analytics fetch error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      fullError: error
    });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  if (loading) return <LoaderPage />;
  if (!analytics) return <Container><p>Немає даних для відображення</p></Container>;

  // Підготовка даних для графіків
  const trafficData = Object.entries(analytics.trafficSources).map(([key, value]) => ({
    name: key === 'direct' ? 'Прямий перехід' : key,
    value,
  }));

  const deviceData = Object.entries(analytics.deviceBreakdown).map(([key, value]) => ({
    name: key === 'mobile' ? 'Мобільний' : key === 'desktop' ? 'Десктоп' : 'Планшет',
    value,
  }));

  const topArticlesData = analytics.topArticles.slice(0, 5).map((article) => ({
    name: article.title.length > 30 ? article.title.substring(0, 30) + '...' : article.title,
    views: article.views,
    favorites: article.addedToFavorites,
  }));

  return (
    <div className={s.analyticsPage}>
      <Container>
        <h1 className={s.title}>Аналітика моїх матеріалів</h1>

        {/* Інфоблок дашборду */}
        <div className={s.infoHeader}>
          <h2>Що показує дашборд:</h2>
          <ul className={s.infoList}>
            <li><strong>Відвідувачів</strong> – кількість унікальних сесій, де переглядали ваші статті</li>
            <li><strong>Переглядів сторінок</strong> – загальна кількість переходів між сторінками</li>
            <li><strong>В обрані</strong> – скільки разів ваші статті додали в обрані</li>
            <li><strong>Нових підписників</strong> – скільки разів на вас підписались за період</li>
            <li><strong>Конверсія</strong> – відсоток відвідувачів, які додали статтю в обрані</li>
            <li><strong>Середній час на сайті</strong> – скільки часу користувачі проводять на сайті</li>
            <li><strong>Джерела трафіку</strong> – звідки приходять відвідувачі (direct, Instagram, Facebook тощо)</li>
            <li><strong>Пристрої</strong> – з яких пристроїв заходять (мобільний, десктоп, планшет)</li>
            <li><strong>Топ статей</strong> – найпопулярніші ваші матеріали за переглядами</li>
          </ul>
        </div>

        {/* Фільтр за датами */}
        <div className={s.filters}>
          <div className={s.filterGroup}>
            <label>Від:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
          </div>
          <div className={s.filterGroup}>
            <label>До:</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
          <button onClick={fetchAnalytics} className={s.filterBtn}>
            Застосувати
          </button>
        </div>

        {/* Загальні метрики */}
        <div className={s.metricsGrid}>
          <MetricCard
            title="Відвідувачів"
            value={analytics.totalVisitors}
            icon="👥"
          />
          <MetricCard
            title="Переглядів сторінок"
            value={analytics.totalPageViews}
            icon="📄"
          />
          <MetricCard
            title="В обрані"
            value={analytics.favoritesCount}
            icon="⭐"
          />
          <MetricCard 
          title="Нових підписників"
          value={analytics.followersCount}
          icon="👤" />
          <MetricCard
            title="Конверсія"
            value={`${analytics.conversionRate}%`}
            icon="📈"
          />
          <MetricCard
            title="Середній час на сайті"
            value={`${Math.round(analytics.avgSessionDuration / 60)} хв`}
            icon="⏱️"
          />
        </div>

        {/* Графіки */}
        <div className={s.chartsGrid}>
          {/* Джерела трафіку */}
          <div className={s.chartCard}>
            <h3>Джерела трафіку</h3>
            {trafficData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trafficData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {trafficData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p>Немає даних</p>
            )}
          </div>

          {/* Пристрої */}
          <div className={s.chartCard}>
            <h3>Пристрої користувачів</h3>
            {deviceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p>Немає даних</p>
            )}
          </div>
        </div>

        {/* Топ статей */}
        <div className={s.chartCard}>
          <h3>Топ-5 популярних статей</h3>
          {topArticlesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topArticlesData}>
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#8884d8" name="Перегляди" />
                <Bar dataKey="favorites" fill="#82ca9d" name="В обрані" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>Немає даних</p>
          )}
        </div>

        {/* Детальна таблиця статей */}
        <div className={s.articlesTable}>
          <h3>Детальна статистика по статтях</h3>
          <table>
            <thead>
              <tr>
                <th>Стаття</th>
                <th>Перегляди</th>
                <th>В обрані</th>
                <th>Конверсія</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topArticles.map((article) => (
                <tr key={article.title}>
                  <td>
                    <div className={s.articleCell}>
                      {article.img && (
                        <img src={article.img} alt={article.title} className={s.articleImg} />
                      )}
                      <span>{article.title}</span>
                    </div>
                  </td>
                  <td>{article.views}</td>
                  <td>{article.addedToFavorites}</td>
                  <td>
                    {article.views > 0
                      ? ((article.addedToFavorites / article.views) * 100).toFixed(1)
                      : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
};

const MetricCard = ({ title, value, icon }) => (
  <div className={s.metricCard}>
    <div className={s.metricIcon}>{icon}</div>
    <div className={s.metricContent}>
      <p className={s.metricTitle}>{title}</p>
      <p className={s.metricValue}>{value}</p>
    </div>
  </div>
);

export default AnalyticsPage;
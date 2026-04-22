import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, Syringe, Activity, Database, TrendingUp, Map, Search, ChevronRight } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

const COLORS = ['#66fcf1', '#8a2be2', '#45a29e', '#ff007f', '#ffd700'];

function App() {
  const [loading, setLoading] = useState(true);
  const [desc, setDesc] = useState(null);
  const [genderData, setGenderData] = useState(null);
  const [firstDoseRaw, setFirstDoseRaw] = useState({});
  const [secondDoseRaw, setSecondDoseRaw] = useState({});
  const [trend, setTrend] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [descRes, genderRes, firstRes, secondRes, trendRes] = await Promise.all([
          fetch(`${API_BASE}/describe`),
          fetch(`${API_BASE}/gender-vaccination`),
          fetch(`${API_BASE}/statewise-first-dose`),
          fetch(`${API_BASE}/statewise-second-dose`),
          fetch(`${API_BASE}/ml/predict-trend`)
        ]);

        const db = await descRes.json();
        const gender = await genderRes.json();
        const fDose = await firstRes.json();
        const sDose = await secondRes.json();
        const tr = await trendRes.json();

        setDesc(db);
        setGenderData(gender);
        setFirstDoseRaw(fDose);
        setSecondDoseRaw(sDose);
        setTrend(tr);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data: ", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Initializing Deep Engine Models & Analytics...</p>
      </div>
    );
  }

  const formatNumber = (num) => {
    if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr';
    if (num >= 100000) return (num / 100000).toFixed(2) + ' L';
    return num.toLocaleString('en-IN');
  };

  // Process data for charts
  const firstDoseArrayAll = Object.keys(firstDoseRaw).map(k => ({ name: k, total: firstDoseRaw[k] })).sort((a,b)=>b.total - a.total);
  const secondDoseArrayAll = Object.keys(secondDoseRaw).map(k => ({ name: k, total: secondDoseRaw[k] })).sort((a,b)=>b.total - a.total);
  
  const top10First = firstDoseArrayAll.slice(0, 10);
  const top10Second = secondDoseArrayAll.slice(0, 10);

  const fullTrendData = trend && trend.historical ? [
    ...trend.historical.map(d => ({ date: d.date, actual: d.actual, prediction: null })),
    ...trend.predictions.map(d => ({ date: d.date, actual: null, prediction: d.prediction }))
  ] : [];

  const pieData = [
    { name: 'Male', value: genderData?.males || 0 },
    { name: 'Female', value: genderData?.females || 0 }
  ];

  // For States Table
  const filteredStates = firstDoseArrayAll.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // For Describe Table
  const describeRows = desc?.describe ? Object.keys(desc.describe).map(column => ({
    column,
    count: desc.describe[column]['count'],
    mean: desc.describe[column]['mean'],
    std: desc.describe[column]['std'],
    min: desc.describe[column]['min'],
    max: desc.describe[column]['max'],
  })) : [];

  const renderContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="fade-in">
          <div className="stats-grid">
            <div className="glass-card">
              <div className="stat-title"><Users size={18} /> Males Vaccinated</div>
              <div className="stat-value">{formatNumber(genderData?.males || 0)}</div>
            </div>
            <div className="glass-card">
              <div className="stat-title"><Users size={18} color="#ff007f" /> Females Vaccinated</div>
              <div className="stat-value">{formatNumber(genderData?.females || 0)}</div>
            </div>
            <div className="glass-card">
              <div className="stat-title"><Syringe size={18} color="#8a2be2" /> Total Records</div>
              <div className="stat-value">{desc?.shape[0]?.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="glass-card chart-full">
              <h2 className="chart-header" style={{display: 'flex', justifyContent: 'space-between'}}>
                <span><TrendingUp size={20} style={{marginRight: 8, verticalAlign: 'text-bottom'}}/> ML Regression: Vaccination Trend</span>
                <span style={{fontSize: '0.9rem', color: '#8a2be2', fontWeight: 400}}>30-Day Predictive Forecast</span>
              </h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fullTrendData}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#66fcf1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#66fcf1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8a2be2" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8a2be2" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#8892b0" minTickGap={50} tick={{fill: '#8892b0', fontSize: 12}} />
                    <YAxis stroke="#8892b0" tickFormatter={formatNumber} tick={{fill: '#8892b0', fontSize: 12}} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(11, 12, 16, 0.95)', border: '1px solid #45a29e', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value, name) => [formatNumber(value), name.charAt(0).toUpperCase() + name.slice(1)]}
                    />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ color: '#fff' }}/>
                    <Area type="monotone" dataKey="actual" name="Historical Doses" stroke="#66fcf1" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
                    <Area type="monotone" dataKey="prediction" name={trend?.best_model ? `${trend.best_model} Forecast` : "AI Forecast"} stroke="#8a2be2" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPrediction)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card">
              <h2 className="chart-header">Gender Distribution Matrix</h2>
              <div className="chart-container" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => formatNumber(value)} contentStyle={{ backgroundColor: 'rgba(11, 12, 16, 0.9)', border: 'none', borderRadius: '8px' }}/>
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card">
              <h2 className="chart-header">Top 10 Volume - First Dose</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={top10First} margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#8892b0" angle={-45} textAnchor="end" height={80} tick={{fontSize: 11}} />
                    <YAxis stroke="#8892b0" tickFormatter={formatNumber} tick={{fontSize: 11}} />
                    <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} formatter={(value) => [formatNumber(value), 'First Dose']} contentStyle={{backgroundColor: '#0b0c10', borderColor: '#45a29e'}}/>
                    <Bar dataKey="total" fill="#45a29e" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'states') {
      return (
        <div className="fade-in glass-card" style={{minHeight: '600px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 2rem 0'}}>
            <h2 className="chart-header" style={{margin: 0}}><Map size={24} style={{verticalAlign: 'middle', marginRight: 10}}/> Statewise Full Index</h2>
            <div className="search-bar">
              <Search size={18} color="#8892b0" style={{position: 'absolute', left: 12, top: 12}} />
              <input 
                type="text" 
                placeholder="Search State..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>State / Territory</th>
                  <th style={{textAlign: 'right'}}>First Dose Total</th>
                  <th style={{textAlign: 'right'}}>Second Dose Total</th>
                  <th style={{textAlign: 'right'}}>Overall Coverage Progress</th>
                </tr>
              </thead>
              <tbody>
                {filteredStates.map((state, index) => {
                  const sDose = secondDoseRaw[state.name] || 0;
                  const ratio = Math.min(((sDose / state.total) * 100), 100).toFixed(1);
                  return (
                    <tr key={state.name}>
                      <td><div className="rank-badge">{index + 1}</div></td>
                      <td style={{fontWeight: 500, color: '#fff'}}>{state.name}</td>
                      <td style={{textAlign: 'right', color: '#66fcf1'}}>{state.total.toLocaleString('en-IN')}</td>
                      <td style={{textAlign: 'right', color: '#8a2be2'}}>{sDose.toLocaleString('en-IN')}</td>
                      <td style={{textAlign: 'right'}}>
                        <div className="progress-bar-container">
                          <div className="progress-bar-fill" style={{width: `${ratio}%`}}></div>
                        </div>
                        <span style={{fontSize: '0.8rem', color: '#8892b0'}}>{ratio}% Dual Dose</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'dataset') {
      return (
        <div className="fade-in glass-card">
          <h2 className="chart-header"><Database size={24} style={{verticalAlign: 'middle', marginRight: 10}}/> Dataset Statistical Describe Mode</h2>
          <p style={{color: '#8892b0', marginBottom: '2rem'}}>Comprehensive statistical breakdown generated from Pandas `df.describe()` algorithm on the raw CSV.</p>
          
          <div className="table-responsive">
            <table className="data-table describe-table">
              <thead>
                <tr>
                  <th>Data Feature (Column)</th>
                  <th style={{textAlign: 'right'}}>Valid Count</th>
                  <th style={{textAlign: 'right'}}>Mean Average</th>
                  <th style={{textAlign: 'right'}}>Std Deviation</th>
                  <th style={{textAlign: 'right'}}>Minimum</th>
                  <th style={{textAlign: 'right'}}>Maximum</th>
                </tr>
              </thead>
              <tbody>
                {describeRows.filter(r => r.count > 0).map((row, i) => (
                  <tr key={i}>
                    <td style={{color: '#66fcf1', fontWeight: 500}}>{row.column}</td>
                    <td style={{textAlign: 'right'}}>{formatNumber(row.count)}</td>
                    <td style={{textAlign: 'right'}}>{formatNumber(row.mean)}</td>
                    <td style={{textAlign: 'right'}}>{formatNumber(row.std)}</td>
                    <td style={{textAlign: 'right'}}>{formatNumber(row.min)}</td>
                    <td style={{textAlign: 'right', color: '#ff007f'}}>{formatNumber(row.max)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'models') {
      const top1 = trend?.best_model || 'Loading...';
      const top2 = trend?.second_best_model || 'Loading...';
      
      return (
        <div className="fade-in">
          <div className="stats-grid" style={{gridTemplateColumns: '1fr 1fr', marginBottom: '2rem'}}>
            <div className="glass-card">
              <div className="stat-title"><Activity size={18} color="#66fcf1" /> Best Model (Active Prediction)</div>
              <div className="stat-value" style={{fontSize: '1.5rem', color: '#66fcf1'}}>{top1}</div>
            </div>
            <div className="glass-card">
              <div className="stat-title"><Activity size={18} color="#8a2be2" /> Runner-Up Model</div>
              <div className="stat-value" style={{fontSize: '1.5rem', color: '#8a2be2'}}>{top2}</div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="glass-card chart-full">
              <h2 className="chart-header">
                <span style={{display:'flex', alignItems:'center'}}><TrendingUp size={20} style={{marginRight: 8}}/> Top 2 Models Predictive Comparison</span>
              </h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend?.top2_chart_data || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#8892b0" minTickGap={50} tick={{fill: '#8892b0', fontSize: 12}} />
                    <YAxis stroke="#8892b0" tickFormatter={formatNumber} tick={{fill: '#8892b0', fontSize: 12}} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(11, 12, 16, 0.95)', border: '1px solid #45a29e', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value, name) => [formatNumber(value), name]}
                    />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ color: '#fff' }}/>
                    <Line type="monotone" dataKey="actual" name="Historical Actual" stroke="#66fcf1" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey={top1} name={`${top1} (Best)`} stroke="#8a2be2" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    <Line type="monotone" dataKey={top2} name={`${top2} (2nd Best)`} stroke="#ff007f" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="glass-card" style={{marginTop: '2rem'}}>
            <h2 className="chart-header">Model Benchmark Results (R² Accuracy Score)</h2>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Model Name</th>
                    <th style={{textAlign: 'right'}}>Train Accuracy (R²)</th>
                    <th style={{textAlign: 'right'}}>Test Accuracy (R²)</th>
                  </tr>
                </thead>
                <tbody>
                  {(trend?.models_summary || []).slice().sort((a,b) => b.test_r2 - a.test_r2).map((m, idx) => (
                    <tr key={m.name}>
                      <td>
                        <div className="rank-badge" style={idx < 2 ? {backgroundColor: '#8a2be2', color: '#fff'} : {}}>
                          {idx + 1}
                        </div>
                      </td>
                      <td style={{fontWeight: 500, color: idx < 2 ? '#66fcf1' : '#fff'}}>
                        {m.name} {idx === 0 && ' (Winner)'}
                      </td>
                      <td style={{textAlign: 'right'}}>
                        {m.train_r2 !== undefined ? (m.train_r2 * 100).toFixed(2) + '%' : '-'}
                      </td>
                      <td style={{textAlign: 'right'}}>
                        {m.test_r2 !== undefined ? (m.test_r2 * 100).toFixed(2) + '%' : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <div>
          <h1>Aura Covid Analytics SDK</h1>
          <p>Institutional-grade ML insights on comprehensive demographic inoculation.</p>
        </div>
        <div className="glass-card header-stats" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(102, 252, 241, 0.05)', border: '1px solid rgba(102, 252, 241, 0.2)' }}>
            <div className="tab-pill" onClick={() => setActiveTab('overview')} data-active={activeTab === 'overview'}>Overview Hub</div>
            <div className="tab-pill" onClick={() => setActiveTab('states')} data-active={activeTab === 'states'}>Statewise Index</div>
            <div className="tab-pill" onClick={() => setActiveTab('dataset')} data-active={activeTab === 'dataset'}>Dataset Deep Dive</div>
            <div className="tab-pill" onClick={() => setActiveTab('models')} data-active={activeTab === 'models'}>ML Tuning</div>
        </div>
      </header>

      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;

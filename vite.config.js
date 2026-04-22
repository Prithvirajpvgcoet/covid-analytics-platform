:root {
  --bg-color: #0b0c10;
  --panel-bg: rgba(31, 40, 51, 0.6);
  --panel-border: rgba(69, 162, 158, 0.2);
  --text-main: #c5c6c7;
  --text-heading: #ffffff;
  --accent-1: #66fcf1;
  --accent-2: #45a29e;
  --accent-3: #8a2be2;
  --accent-4: #ff007f;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Outfit', sans-serif;
  background-color: var(--bg-color);
  background-image: 
    radial-gradient(circle at 15% 50%, rgba(102, 252, 241, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 85% 30%, rgba(138, 43, 226, 0.05) 0%, transparent 50%);
  color: var(--text-main);
  min-height: 100vh;
  overflow-x: hidden;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: rgba(11, 12, 16, 0.5);
}
::-webkit-scrollbar-thumb {
  background: rgba(69, 162, 158, 0.5);
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent-1);
}

.dashboard-container {
  padding: 2rem 4rem;
  max-width: 1600px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
  animation: fadeInDown 0.8s ease-out;
}

.header h1 {
  font-size: 2.5rem;
  color: var(--text-heading);
  font-weight: 700;
  letter-spacing: -0.5px;
  background: linear-gradient(to right, var(--accent-1), #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header p {
  font-size: 1.1rem;
  color: var(--accent-2);
  opacity: 0.9;
  margin-top: 0.5rem;
}

.tab-pill {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  color: var(--text-main);
}
.tab-pill:hover {
  background: rgba(255, 255, 255, 0.05);
}
.tab-pill[data-active="true"] {
  background: var(--accent-1);
  color: #000;
  box-shadow: 0 0 15px rgba(102, 252, 241, 0.4);
}

.glass-card {
  background: var(--panel-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--panel-border);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.glass-card:hover {
  border-color: rgba(102, 252, 241, 0.5);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-title {
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--accent-2);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.stat-value {
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--text-heading);
  text-shadow: 0 0 20px rgba(102, 252, 241, 0.2);
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (min-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr 1fr;
  }
  .chart-full {
    grid-column: span 2;
  }
}

.chart-container {
  height: 400px;
  width: 100%;
  margin-top: 1rem;
}

.chart-header {
  font-size: 1.25rem;
  color: var(--text-heading);
  margin-bottom: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.search-bar {
  position: relative;
  width: 300px;
}
.search-bar input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  background: rgba(0,0,0,0.3);
  border: 1px solid var(--panel-border);
  border-radius: 8px;
  color: #fff;
  font-family: inherit;
  outline: none;
  transition: all 0.2s;
}
.search-bar input:focus {
  border-color: var(--accent-1);
  box-shadow: 0 0 10px rgba(102, 252, 241, 0.2);
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid var(--panel-border);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th {
  background: rgba(0, 0, 0, 0.4);
  padding: 1rem;
  color: var(--accent-2);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 1px;
  border-bottom: 1px solid var(--panel-border);
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  font-size: 0.95rem;
}

.data-table tbody tr:hover td {
  background: rgba(102, 252, 241, 0.03);
}

.rank-badge {
  background: rgba(138, 43, 226, 0.2);
  color: #c5a0ff;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  border: 1px solid rgba(138, 43, 226, 0.4);
}

.progress-bar-container {
  width: 150px;
  height: 6px;
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
  margin-top: 4px;
  margin-bottom: 4px;
  margin-left: auto;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-1), var(--accent-3));
  border-radius: 3px;
  transition: width 1s ease-out;
}

.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.loading-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: var(--accent-1);
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(102, 252, 241, 0.1);
  border-radius: 50%;
  border-top-color: var(--accent-1);
  border-left-color: var(--accent-3);
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

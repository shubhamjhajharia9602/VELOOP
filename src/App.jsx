import { useCallback, useEffect, useRef, useState } from 'react';

import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';

import CurrentLevel from './components/levels/CurrentLevel';
import XPProgress from './components/levels/XPProgress';
import LevelRoadmap from './components/levels/LevelRoadmap';

import Rewards from './components/rewards/Rewards';
import PlayEarn from './components/playearn/PlayEarn';

import AuthPage from './pages/AuthPage';
import LevelUpModal from './components/levels/LevelUpModal';
import { levels } from './data/tempData';
import { apiRequest } from './services/api';

import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('velopUser')) || null;
    } catch {
      return null;
    }
  });

  const [currentXP, setCurrentXP] = useState(0);
  const [xpHistory, setXpHistory] = useState([]);
  const [activeSection, setActiveSection] = useState('overview');

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingXP, setLoadingXP] = useState(false);
  const [error, setError] = useState('');
  const [levelUp, setLevelUp] = useState(null);
  const previousLevelRef = useRef(null);

  const isLoggedIn = Boolean(
    localStorage.getItem('velopToken') && user
  );

  const loadXP = useCallback(async () => {
    if (!localStorage.getItem('velopToken')) return;

    setLoadingXP(true);

    try {
      const data = await apiRequest('/xp');

      const nextXP = Number(data.totalXP ?? data.total_xp ?? data.currentXP ?? 0);
      const sortedLevels = [...levels].sort((a, b) => a.xp - b.xp);
      const reachedLevel = sortedLevels.reduce(
        (current, level) => (nextXP >= level.xp ? level : current),
        sortedLevels[0]
      );

      if (
        previousLevelRef.current &&
        reachedLevel &&
        reachedLevel.level > previousLevelRef.current.level
      ) {
        setLevelUp(reachedLevel);
      }
      if (reachedLevel) previousLevelRef.current = reachedLevel;
      setCurrentXP(nextXP);

      setXpHistory(
        Array.isArray(data.history) ? data.history : []
      );

      setError('');
    } catch {
      setError('Unable to load your XP progress right now. Please try again.');
    } finally {
      setLoadingXP(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadXP();
    }
  }, [isLoggedIn, loadXP]);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem('velopUser', JSON.stringify(loggedInUser));
    setActiveSection('overview');
  };

  const handleLogout = () => {
    localStorage.removeItem('velopToken');
    localStorage.removeItem('velopUser');

    setUser(null);
    setCurrentXP(0);
    setXpHistory([]);
    setActiveSection('overview');
    setError('');
    setLevelUp(null);
    previousLevelRef.current = null;
  };

  const handleNavigate = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const handleSearch = (query) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return;

    const sectionMap = [
      { keywords: ['overview', 'dashboard', 'home'], section: 'overview' },
      { keywords: ['level', 'current level'], section: 'level' },
      { keywords: ['roadmap', 'all levels', 'progress'], section: 'levels' },
      { keywords: ['reward', 'rewards', 'prize'], section: 'rewards' },
      { keywords: ['play', 'earn', 'activity', 'game'], section: 'playEarn' },
    ];

    const match = sectionMap.find(({ keywords }) =>
      keywords.some((keyword) => keyword.includes(normalizedQuery))
    );

    if (match) {
      handleNavigate(match.section);
    }
  };

  if (!isLoggedIn) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const displayName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.email?.split('@')[0] ||
    'VELOOPER';

  const renderOverview = () => (
    <>
      <div className="dashboard-welcome">
        <div>
          <p className="dashboard-eyebrow">YOUR JOURNEY CONTINUES</p>
          <h1>
            Welcome back, {displayName}!
          </h1>
          <p className="dashboard-subtitle">
            Keep earning XP and make progress toward your next level.
          </p>
        </div>

        <div className="dashboard-xp-summary">
          <span>Total XP</span>
          <strong>{currentXP.toLocaleString()}</strong>
        </div>
      </div>

      {error && (
        <div className="dashboard-error" role="alert">
          {error}
          <button type="button" onClick={loadXP}>
            Retry
          </button>
        </div>
      )}

      {loadingXP && (
        <p className="dashboard-loading">Refreshing your XP...</p>
      )}

      <div className="dashboard-main-grid">
        <CurrentLevel currentXP={currentXP} />
        <XPProgress currentXP={currentXP} />
      </div>

      <section className="dashboard-section">
        <LevelRoadmap currentXP={currentXP} />
      </section>

      <section className="dashboard-section">
        <Rewards currentXP={currentXP} />
      </section>

      <section className="dashboard-section">
        <PlayEarn onXPUpdated={loadXP} />
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-eyebrow">YOUR ACTIVITY</p>
            <h2>Recent XP History</h2>
          </div>

          <button
            className="dashboard-text-button"
            type="button"
            onClick={() => handleNavigate('playEarn')}
          >
            Earn more XP
          </button>
        </div>

        <div className="xp-history-card">
          {xpHistory.length > 0 ? (
            xpHistory.slice(0, 5).map((item, index) => (
              <div
                className="xp-history-row"
                key={item.id ?? `${item.activity}-${index}`}
              >
                <div className="xp-history-icon">⚡</div>

                <div className="xp-history-details">
                  <strong>
                    {item.activity || 'XP Earned'}
                  </strong>
                  <span>
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString()
                      : 'Activity completed'}
                  </span>
                </div>

                <strong className="xp-history-amount">
                  +{Number(item.xp_earned ?? item.xpEarned ?? 0)} XP
                </strong>
              </div>
            ))
          ) : (
            <div className="xp-history-empty">
              <span className="xp-history-empty-icon">⚡</span>
              <h3>No XP activity yet</h3>
              <p>
                Complete an available activity to start building your XP.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'level':
        return (
          <section className="dashboard-page-section">
            <div className="dashboard-section-heading">
              <div>
                <p className="dashboard-eyebrow">YOUR PROGRESS</p>
                <h1>Current Level</h1>
              </div>
            </div>

            <div className="dashboard-main-grid">
              <CurrentLevel currentXP={currentXP} />
              <XPProgress currentXP={currentXP} />
            </div>
          </section>
        );

      case 'levels':
        return (
          <section className="dashboard-page-section">
            <div className="dashboard-section-heading">
              <div>
                <p className="dashboard-eyebrow">LEVEL UP</p>
                <h1>Level Roadmap</h1>
              </div>
            </div>

            <LevelRoadmap currentXP={currentXP} />
          </section>
        );

      case 'rewards':
        return (
          <section className="dashboard-page-section">
            <div className="dashboard-section-heading">
              <div>
                <p className="dashboard-eyebrow">YOUR MILESTONES</p>
                <h1>Rewards</h1>
              </div>
            </div>

            <Rewards currentXP={currentXP} />
          </section>
        );

      case 'playEarn':
      case 'earnXP':
        return (
          <section className="dashboard-page-section">
            <PlayEarn onXPUpdated={loadXP} />
          </section>
        );

      case 'overview':
      default:
        return renderOverview();
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        currentXP={currentXP}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="app-main">
        <Topbar
          currentXP={currentXP}
          onLogout={handleLogout}
          onMenuClick={() => setSidebarOpen(true)}
          onSearch={handleSearch}
        />

        <main className="dashboard-content">
          {renderSection()}
        </main>
      </div>
      <LevelUpModal level={levelUp} onClose={() => setLevelUp(null)} />
    </div>
  );
}

export default App;

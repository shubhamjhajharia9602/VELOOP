import {
  LayoutDashboard,
  Trophy,
  Gift,
  Gamepad2,
  Zap,
  ChevronRight,
  X,
} from 'lucide-react';

import styles from './Sidebar.module.css';

const navigationItems = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Your dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'levels',
    label: 'Levels',
    description: 'Track your progress',
    icon: Trophy,
  },
  {
    id: 'rewards',
    label: 'Rewards',
    description: 'Explore rewards',
    icon: Gift,
  },
  {
    id: 'playEarn',
    label: 'Play & Earn',
    description: 'Earn experience points',
    icon: Gamepad2,
  },
];

function getUserName() {
  try {
    const savedUser = localStorage.getItem('velopUser');

    if (savedUser) {
      const user = JSON.parse(savedUser);
      return user.name || user.username || 'VELOOPER';
    }
  } catch {
    // Use the default name if user data is unavailable.
  }

  return 'VELOOPER';
}

function Sidebar({
  activeSection = 'overview',
  onNavigate = () => {},
  currentXP = 0,
  isOpen = false,
  onClose = () => {},
}) {
  const userName = getUserName();

  const handleNavigation = (section) => {
    onNavigate(section);
    onClose();
  };

  return (
    <>
      <div
        className={`${styles.sidebarOverlay} ${
          isOpen ? styles.visible : ''
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`${styles.sidebar} ${
          isOpen ? styles.sidebarOpen : ''
        }`}
      >
        <div className={styles.sidebarHeader}>
          <button
            type="button"
            className={styles.sidebarBrand}
            onClick={() => handleNavigation('overview')}
            aria-label="Go to dashboard overview"
          >
            <span className={styles.sidebarLogo}>V</span>

            <span className={styles.sidebarBrandText}>
              <span className={styles.sidebarBrandName}>VELOOP</span>
              <span className={styles.sidebarBrandTagline}>
                Level up your journey
              </span>
            </span>
          </button>

          <button
            type="button"
            className={styles.sidebarClose}
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.sidebarProfile}>
          <div className={styles.sidebarAvatar}>
            {userName.charAt(0).toUpperCase()}
          </div>

          <div className={styles.sidebarProfileInfo}>
            <span className={styles.sidebarProfileLabel}>
              WELCOME BACK
            </span>
            <span className={styles.sidebarProfileName}>
              {userName}
            </span>
          </div>

          <span className={styles.sidebarOnlineIndicator} />
        </div>

        <div className={styles.sidebarXpCard}>
          <div className={styles.sidebarXpTop}>
            <span className={styles.sidebarXpIcon}>
              <Zap size={17} />
            </span>
            <span className={styles.sidebarXpLabel}>
              TOTAL EXPERIENCE
            </span>
          </div>

          <div className={styles.sidebarXpValue}>
            {Number(currentXP || 0).toLocaleString('en-IN')}
            <span> XP</span>
          </div>

          <div className={styles.sidebarXpFooter}>
            <span>Keep progressing</span>
            <Trophy size={15} />
          </div>
        </div>

        <nav
          className={styles.sidebarNavigation}
          aria-label="Main navigation"
        >
          <p className={styles.sidebarSectionLabel}>MAIN MENU</p>

          <div className={styles.sidebarNavList}>
            {navigationItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                activeSection === item.id ||
                (item.id === 'levels' &&
                  activeSection === 'level') ||
                (item.id === 'playEarn' &&
                  ['play-earn', 'earnXP', 'earn-xp'].includes(
                    activeSection
                  ));

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.sidebarNavItem} ${
                    isActive ? styles.active : ''
                  }`}
                  onClick={() => handleNavigation(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={styles.sidebarNavIcon}>
                    <Icon size={19} />
                  </span>

                  <span className={styles.sidebarNavCopy}>
                    <span className={styles.sidebarNavLabel}>
                      {item.label}
                    </span>
                    <span className={styles.sidebarNavDescription}>
                      {item.description}
                    </span>
                  </span>

                  {isActive && (
                    <ChevronRight
                      size={17}
                      className={styles.sidebarNavArrow}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.sidebarBottomDecoration}>
            <div className={styles.sidebarBottomIcon}>
              <Zap size={20} />
            </div>

            <p>Every XP counts!</p>

            <span>
              Keep exploring and level up your VELOOP journey.
            </span>

            <button
              type="button"
              onClick={() => handleNavigation('playEarn')}
            >
              Explore activities
              <ChevronRight size={15} />
            </button>
          </div>

          <div className={styles.sidebarFooter}>
            <span className={styles.sidebarFooterDot} />
            <span>VELOOP Dashboard</span>
            <span className={styles.sidebarFooterVersion}>v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

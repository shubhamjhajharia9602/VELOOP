import { useState } from 'react';
import {
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  UserRound,
  Settings,
  Zap,
} from 'lucide-react';

import styles from './Topbar.module.css';

function Topbar({
  currentXP = 0,
  onLogout,
  onMenuClick,
  onSearch,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearch = (event) => {
    event.preventDefault();

    if (onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleLogout = () => {
    setShowProfileMenu(false);

    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className={styles.pageHeading}>
          <span className={styles.pageEyebrow}>YOUR GAMIFICATION HUB</span>
          <h1>Dashboard</h1>
        </div>
      </div>

      <div className={styles.topbarRight}>
        <form
          className={styles.searchForm}
          onSubmit={handleSearch}
          role="search"
        >
          <Search size={18} className={styles.searchIcon} />

          <input
            type="search"
            placeholder="Search VELOOP..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label="Search VELOOP"
          />

          {searchQuery && (
            <button
              type="button"
              className={styles.clearSearch}
              onClick={() => {
                setSearchQuery('');
                onSearch?.('');
              }}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </form>

        <div className={styles.xpBadge}>
          <Zap size={17} />
          <span>{Number(currentXP).toLocaleString()} XP</span>
        </div>

        <div className={styles.dropdownWrapper}>
          <button
            type="button"
            className={`${styles.iconButton} ${
              showNotifications ? styles.iconButtonActive : ''
            }`}
            onClick={() => {
              setShowNotifications((previous) => !previous);
              setShowProfileMenu(false);
            }}
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            <Bell size={20} />
            <span className={styles.notificationDot} />
          </button>

          {showNotifications && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <h3>Notifications</h3>

                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  aria-label="Close notifications"
                >
                  <X size={17} />
                </button>
              </div>

              <div className={styles.notificationItem}>
                <span className={styles.notificationIcon}>
                  <Zap size={17} />
                </span>

                <div>
                  <p className={styles.notificationTitle}>
                    Keep earning XP!
                  </p>
                  <p className={styles.notificationText}>
                    Complete your daily check-in to earn XP.
                  </p>
                </div>
              </div>

              <div className={styles.notificationFooter}>
                Stay active and keep progressing.
              </div>
            </div>
          )}
        </div>

        <div className={styles.dropdownWrapper}>
          <button
            type="button"
            className={styles.profileButton}
            onClick={() => {
              setShowProfileMenu((previous) => !previous);
              setShowNotifications(false);
            }}
            aria-label="Open profile menu"
            aria-expanded={showProfileMenu}
          >
            <span className={styles.profileAvatar}>
              <UserRound size={19} />
            </span>

            <span className={styles.profileChevron}>
              {showProfileMenu ? (
                <X size={15} />
              ) : (
                <Settings size={15} />
              )}
            </span>
          </button>

          {showProfileMenu && (
            <div className={styles.dropdown}>
              <div className={styles.profileDropdownHeader}>
                <span className={styles.profileAvatarLarge}>
                  <UserRound size={22} />
                </span>

                <div>
                  <p className={styles.profileDropdownTitle}>VELOOP Member</p>
                  <p className={styles.profileDropdownSubtitle}>
                    {Number(currentXP).toLocaleString()} total XP
                  </p>
                </div>
              </div>

              <button
                type="button"
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                <LogOut size={17} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;

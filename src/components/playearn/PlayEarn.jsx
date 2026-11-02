import { useEffect, useRef, useState } from 'react';
import {
  CalendarCheck,
  UserRound,
  Check,
  Video,
  Users,
  Target,
  Gift,
  Zap,
  ArrowUpRight,
  Coins,
  Trophy,
  RotateCcw,
  Clock,
  Gamepad2,
} from 'lucide-react';

import styles from './PlayEarn.module.css';
import { apiRequest } from '../../services/api';

const activities = [
  {
    id: 'daily-checkin',
    title: 'Daily Check-in',
    description: 'Visit VELOOP every day.',
    xp: 10,
    icon: CalendarCheck,
    type: 'daily',
  },
  {
    id: 'complete-profile',
    title: 'Complete Your Profile',
    description: 'Keep your profile information updated.',
    xp: null,
    icon: UserRound,
    type: 'coming-soon',
  },
  {
    id: 'explore-rewards',
    title: 'Explore Rewards',
    description: 'Discover your available milestones.',
    xp: null,
    icon: Gift,
    type: 'explore',
  },
  {
    id: 'watch-earn',
    title: 'Watch & Earn',
    description: 'Eligible video activities will appear here.',
    xp: null,
    icon: Video,
    type: 'coming-soon',
  },
  {
    id: 'refer-earn',
    title: 'Refer & Earn',
    description: 'Referral rewards are not enabled yet.',
    xp: null,
    icon: Users,
    type: 'coming-soon',
  },
  {
    id: 'daily-challenge',
    title: 'Daily Challenge',
    description: 'New skill-based challenges are coming soon.',
    xp: null,
    icon: Target,
    type: 'coming-soon',
  },
];

const GAME_DURATION = 20;
const TARGET_COUNT = 5;

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function PlayEarn({ onXPUpdated }) {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinMessage, setCheckinMessage] = useState('');


  const [gameActive, setGameActive] = useState(false);
  const [gameTime, setGameTime] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [coinPosition, setCoinPosition] = useState({ top: 45, left: 50 });
  const [gameMessage, setGameMessage] = useState(
    'Catch 5 coins before time runs out!'
  );

  const [gameResult, setGameResult] = useState('');

  const gameTimerRef = useRef(null);

  useEffect(() => {
    const today = getToday();

    setCheckedIn(
      localStorage.getItem('velopDailyCheckInV2') === today
    );


    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    };
  }, []);

  const handleDailyCheckin = async () => {
    if (checkedIn || checkinLoading) return;

    setCheckinLoading(true);
    setCheckinMessage('');

    try {
      const result = await apiRequest('/xp/checkin', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      localStorage.setItem('velopDailyCheckInV2', getToday());
      setCheckedIn(true);

      if (onXPUpdated) await onXPUpdated();
      setCheckinMessage(
        `Daily check-in successful! You earned ${result.xpEarned ?? 10} XP.`
      );
    } catch (error) {
      if (error.message && error.message.toLowerCase().includes('already checked in')) {
        localStorage.setItem('velopDailyCheckInV2', getToday());
        setCheckedIn(true);
        setCheckinMessage('You have already checked in today. Your XP is saved.');
        if (onXPUpdated) await onXPUpdated();
      } else {
        setCheckinMessage(
          error.message || 'Unable to complete check-in. Please try again.'
        );
      }
    } finally {
      setCheckinLoading(false);
    }
  };

  const handleProfileActivity = () => {
    setCheckinMessage('Profile completion rewards are coming soon and are not enabled yet.');
  };

  const handleExploreRewards = () => {
    setCheckinMessage(
      'Explore the Rewards section to see your XP milestones.'
    );
  };

  const moveCoin = () => {
    setCoinPosition({
      top: 10 + Math.random() * 75,
      left: 8 + Math.random() * 84,
    });
  };


  const startGame = () => {
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }

    setScore(0);
    setGameResult('');
    setGameTime(GAME_DURATION);
    setGameMessage('Catch 5 coins before time runs out!');
    setGameActive(true);
    moveCoin();

    let remaining = GAME_DURATION;

    gameTimerRef.current = setInterval(() => {
      remaining -= 1;
      setGameTime(remaining);

      if (remaining <= 0) {
        clearInterval(gameTimerRef.current);
        gameTimerRef.current = null;

        setGameActive(false);
        setGameResult('Time is up. No demo reward this round — catch 5 coins to qualify.');
        setGameMessage('Challenge complete!');
      }
    }, 1000);
  };

  const handleCoinClick = () => {
    if (!gameActive) return;

    const newScore = score + 1;
    setScore(newScore);

    if (newScore >= TARGET_COUNT) {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
        gameTimerRef.current = null;
      }

      setGameActive(false);
      const alreadyRewarded = localStorage.getItem('velopCoinGameRewardDate') === getToday();
      setGameResult(
        alreadyRewarded
          ? 'Great score! Today’s demo reward has already been used.'
          : 'Challenge complete! Demo reward: +25 XP. This is a prototype reward and is not added to your account.'
      );
      if (!alreadyRewarded) {
        localStorage.setItem('velopCoinGameRewardDate', getToday());
      }
      setGameMessage('Challenge complete!');

      return;
    }

    moveCoin();
  };

  return (
    <section className={styles.playEarnSection}>
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.sectionEyebrow}>DAILY ACTIVITIES</span>
          <h2>Play & Earn</h2>
          <p>Complete activities and build your VELOOP streak.</p>
        </div>

        <div className={styles.headerBadge}>
          <Zap size={16} />
          <span>Earn XP</span>
        </div>
      </div>

      {checkinMessage && (
        <div className={styles.activityMessage} role="status">
          <span>{checkinMessage}</span>

          <button
            type="button"
            onClick={() => setCheckinMessage('')}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      <div className={styles.activitiesGrid}>
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <article
              key={activity.id}
              className={styles.activityCard}
            >
              <div className={styles.activityTop}>
                <div className={styles.activityIcon}>
                  <Icon size={22} />
                </div>

                <div className={styles.activityXP}>
                  {activity.xp ? <><Zap size={14} /><span>+{activity.xp} XP</span></> : <span>{activity.type === 'explore' ? 'Explore' : 'Coming Soon'}</span>}
                </div>
              </div>

              <h3>{activity.title}</h3>
              <p className={styles.activityDescription}>
                {activity.description}
              </p>

              {activity.type === 'daily' ? (
                <button
                  type="button"
                  className={styles.activityButton}
                  onClick={handleDailyCheckin}
                  disabled={checkedIn || checkinLoading}
                >
                  {checkedIn ? (
                    <>
                      <Check size={16} />
                      Checked In
                    </>
                  ) : checkinLoading ? (
                    'Checking in...'
                  ) : (
                    <>
                      <CalendarCheck size={16} />
                      Check In
                    </>
                  )}
                </button>
              ) : activity.type === 'coming-soon' ? (
                <button
                  type="button"
                  className={styles.activityButton}
                  onClick={handleProfileActivity}
                >
                  Coming Soon
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.activityButton}
                  onClick={handleExploreRewards}
                >
                  Explore Rewards
                  <ArrowUpRight size={16} />
                </button>
              )}
            </article>
          );
        })}
      </div>

      <div className={styles.gameSection}>
        <div className={styles.gameHeader}>
          <div className={styles.gameTitleGroup}>
            <div className={styles.gameIcon}>
              <Gamepad2 size={23} />
            </div>

            <div>
              <span className={styles.sectionEyebrow}>MINI GAME</span>
              <h3>Catch the Coins</h3>
              <p>Catch 5 coins in 20 seconds.</p>
            </div>
          </div>

          <div className={styles.gameStats}>
            <div className={styles.gameStat}>
              <Clock size={15} />
              <span>{gameTime}s</span>
            </div>

            <div className={styles.gameStat}>
              <Trophy size={15} />
              <span>
                {score}/{TARGET_COUNT}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.gameBoard}>
          {!gameActive ? (
            <div className={styles.gameStart}>
              <div className={styles.gameStartIcon}>
                <Coins size={35} />
              </div>

              <h4>{gameMessage}</h4>
              {gameResult && (
                <p className={styles.gameResult} role="status">{gameResult}</p>
              )}

              <button
                type="button"
                className={styles.gameButton}
                onClick={startGame}
              >
                {score > 0 ? (
                  <>
                    <RotateCcw size={16} />
                    Play Again
                  </>
                ) : (
                  <>
                    <Gamepad2 size={16} />
                    Start Game
                  </>
                )}
              </button>
            </div>
          ) : (
            <>
              <p className={styles.gameInstruction}>
                Click the coins as quickly as you can!
              </p>

              <button
                type="button"
                className={styles.coinTarget}
                style={{
                  top: `${coinPosition.top}%`,
                  left: `${coinPosition.left}%`,
                }}
                onClick={handleCoinClick}
                aria-label="Catch coin"
              >
                <Coins size={28} />
              </button>
            </>
          )}
        </div>

        <div className={styles.gameFooter}>
          <div>
            <Coins size={16} />
            <span>Fun mini-game</span>
          </div>

          <p>
            Rules: 20 seconds, catch 5 coins. One demo reward opportunity per day; the +25 XP result is a prototype only and does not change account XP.
          </p>
        </div>
      </div>
    </section>
  );
}

export default PlayEarn;

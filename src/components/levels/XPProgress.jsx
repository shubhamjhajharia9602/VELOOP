import { useMemo } from 'react';
import { Zap, TrendingUp, Target } from 'lucide-react';
import styles from './XPProgress.module.css';
import { levels } from '../../data/tempData';

function XPProgress({ currentXP = 0 }) {
  const xp = Math.max(0, Number(currentXP) || 0);

  const progressData = useMemo(() => {
    const sortedLevels = [...levels].sort(
      (a, b) => Number(a.xp) - Number(b.xp)
    );

    let currentLevel = sortedLevels[0] || {
      level: 1,
      name: 'Beginner',
      xp: 0,
    };

    let nextLevel = null;

    for (const level of sortedLevels) {
      if (xp >= Number(level.xp)) {
        currentLevel = level;
      } else {
        nextLevel = level;
        break;
      }
    }

    const nextThreshold = nextLevel ? Number(nextLevel.xp) : Number(currentLevel.xp) || 0;
    const xpNeeded = nextLevel ? Math.max(0, nextThreshold - xp) : 0;
    const progress = nextLevel
      ? Math.min(100, Math.max(0, (xp / Math.max(1, nextThreshold)) * 100))
      : 100;

    return { currentLevel, nextLevel, xpNeeded, progress, nextThreshold };
  }, [xp]);

  const {
    currentLevel,
    nextLevel,
    xpNeeded,
    progress,
    nextThreshold,
  } = progressData;

  return (
    <section className={styles.xpProgress} aria-labelledby="xp-progress-title">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div
            className={styles.iconWrapper}
            title="XP helps you progress through VELOOP Rewards levels. Rewards depend on the current level configuration."
            aria-label="XP information"
          >
            <Zap size={20} />
          </div>

          <div>
            <span className={styles.eyebrow}>YOUR JOURNEY</span>
            <h2 id="xp-progress-title" className={styles.title}>
              XP Progress
            </h2>
          </div>
        </div>

        <div className={styles.totalXP}>
          <span className={styles.totalLabel}>TOTAL XP</span>
          <strong>{xp.toLocaleString()}</strong>
        </div>
      </div>

      <div className={styles.levelSummary}>
        <div className={styles.levelInfo}>
          <span className={styles.levelCaption}>CURRENT LEVEL</span>
          <h3>{currentLevel.name}</h3>
          <span className={styles.levelNumber}>
            Level {currentLevel.level}
          </span>
        </div>

        <div className={styles.progressPercentage}>
          <TrendingUp size={17} />
          <strong>{Math.round(progress)}%</strong>
        </div>
      </div>

      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label="XP progress to next level"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className={styles.progressLabels}>
        <span>{xp.toLocaleString()} / {nextThreshold.toLocaleString()} XP</span>
        <span>
          {nextLevel
            ? `${xpNeeded.toLocaleString()} XP remaining`
            : 'Maximum level reached'}
        </span>
      </div>

      <div className={styles.bottomInfo}>
        <div className={styles.nextLevelInfo}>
          <div className={styles.targetIcon}>
            <Target size={18} />
          </div>

          <div>
            <span className={styles.nextLabel}>NEXT MILESTONE</span>
            <strong>
              {nextLevel ? nextLevel.name : 'Highest Level'}
            </strong>
          </div>
        </div>

        <div className={styles.remainingXP}>
          <strong>{xpNeeded.toLocaleString()}</strong>
          <span>XP remaining</span>
        </div>
      </div>

      {!nextLevel && (
        <div className={styles.completeMessage}>
          🎉 You have reached the highest available level!
        </div>
      )}
    </section>
  );
}

export default XPProgress;

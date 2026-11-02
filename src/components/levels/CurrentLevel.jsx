import { useMemo } from 'react';
import { Trophy, Zap, Target, TrendingUp, Gift, Info } from 'lucide-react';
import { levels } from '../../data/tempData';
import styles from './CurrentLevel.module.css';

function CurrentLevel({ currentXP = 0 }) {
  const xp = Math.max(0, Number(currentXP) || 0);

  const levelInfo = useMemo(() => {
    const sortedLevels = [...levels].sort((a, b) => a.xp - b.xp);

    let current = sortedLevels[0] || {
      level: 1,
      name: 'Beginner',
      xp: 0,
    };

    let next = null;

    for (let i = 0; i < sortedLevels.length; i += 1) {
      if (xp >= sortedLevels[i].xp) {
        current = sortedLevels[i];
      } else {
        next = sortedLevels[i];
        break;
      }
    }

    const nextThreshold = next ? Number(next.xp) : Number(current.xp) || 0;
    const xpNeeded = next ? Math.max(0, nextThreshold - xp) : 0;
    const progress = next
      ? Math.min(100, Math.max(0, (xp / Math.max(1, nextThreshold)) * 100))
      : 100;

    return { current, next, xpNeeded, progress, nextThreshold };
  }, [xp]);

  const { current, next, xpNeeded, progress, nextThreshold } = levelInfo;

  return (
    <section className={styles.currentLevel} aria-labelledby="current-level-title">
      <div className={styles.cardGlow} aria-hidden="true" />

      <div className={styles.cardHeader}>
        <div>
          <span className={styles.eyebrow}>
            YOUR PROGRESSION
          </span>

          <h2 id="current-level-title" className={styles.title}>
            Current Level
          </h2>
        </div>

        <div className={styles.trophyIcon} aria-hidden="true">
          <Trophy size={23} />
        </div>
      </div>

      <div className={styles.levelBody}>
        <div className={styles.levelBadge}>
          <div className={styles.badgeInner}>
            <Trophy size={29} strokeWidth={1.8} />
            <span className={styles.badgeLevel}>
              {current.level}
            </span>
          </div>
        </div>

        <div className={styles.levelDetails}>
          <span className={styles.levelLabel}>
            LEVEL {current.level}
          </span>

          <h3 className={styles.levelName}>
            {current.name}
          </h3>

          <p className={styles.levelDescription}>
            Keep earning XP to unlock your next level and its rewards.
          </p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Zap size={18} />
          </div>

          <div className={styles.statContent}>
            <span className={styles.statLabel}>
              Total XP
            </span>

            <strong className={styles.statValue}>
              {xp.toLocaleString()}
            </strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Target size={18} />
          </div>

          <div className={styles.statContent}>
            <span className={styles.statLabel}>
              Next Level
            </span>

            <strong className={styles.statValue}>
              {next ? `Level ${next.level}` : 'Max Level'}
            </strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp size={18} />
          </div>

          <div className={styles.statContent}>
            <span className={styles.statLabel}>
              XP Remaining
            </span>

            <strong className={styles.statValue}>
              {next ? xpNeeded.toLocaleString() : '0'}
            </strong>
          </div>
        </div>
      </div>

      {next && (
        <div className={styles.nextRewardCard}>
          <div className={styles.nextRewardIcon}><Gift size={22} /></div>
          <div className={styles.nextRewardCopy}>
            <span className={styles.nextRewardEyebrow}>NEXT LEVEL REWARD</span>
            <strong>{next.reward ? `${next.reward.amount} ${next.reward.type}` : 'Reward details coming soon'}</strong>
            <span>Reach Level {next.level} to unlock this reward.</span>
          </div>
          <span className={styles.rewardInfo} title="The displayed reward is associated with the next level according to the current demo reward configuration." aria-label="Reward information">
            <Info size={17} />
          </span>
        </div>
      )}

      <div className={styles.progressSection}>
        <div className={styles.progressHeading}>
          <span>Level Progress</span>

          <strong>
            {Math.round(progress)}%
          </strong>
        </div>

        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-label="Current level progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className={styles.progressFooter}>
          <span>
            {xp.toLocaleString()} / {nextThreshold.toLocaleString()} XP
          </span>

          <span>
            {next
              ? `${xpNeeded.toLocaleString()} XP to reach Level ${next.level}`
              : 'You have reached the highest available level!'}
          </span>
        </div>
      </div>

      {next && (
        <div className={styles.nextLevelNotice}>
          <div className={styles.nextLevelIcon}>
            <Trophy size={17} />
          </div>

          <div className={styles.nextLevelText}>
            <strong>
              Next milestone: {next.name}
            </strong>

            <span>
              Earn {xpNeeded.toLocaleString()} more XP to reach Level {next.level}.
            </span>
          </div>
        </div>
      )}

      {!next && (
        <div className={styles.maxLevelNotice}>
          🎉 Congratulations! You have reached the highest available level.
        </div>
      )}
    </section>
  );
}

export default CurrentLevel;

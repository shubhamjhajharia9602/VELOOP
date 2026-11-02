
import { useMemo } from 'react';
import { Check, Lock, Trophy, Crown, Zap, Gift } from 'lucide-react';
import { levels } from '../../data/tempData';
import styles from './LevelRoadmap.module.css';

function LevelRoadmap({ currentXP = 0 }) {
  const xp = Math.max(0, Number(currentXP) || 0);

  const roadmap = useMemo(() => {
    const sortedLevels = [...levels].sort(
      (a, b) => Number(a.xp) - Number(b.xp)
    );

    return sortedLevels.map((level, index) => {
      const threshold = Number(level.xp) || 0;
      const nextThreshold =
        index < sortedLevels.length - 1
          ? Number(sortedLevels[index + 1].xp) || threshold
          : null;

      let status = 'upcoming';

      if (xp >= threshold) {
        status = 'completed';
      }

      if (
        xp >= threshold &&
        nextThreshold !== null &&
        xp < nextThreshold
      ) {
        status = 'current';
      }

      return { ...level, status, threshold };
    });
  }, [xp]);

  if (!roadmap.length) {
    return (
      <section className={styles.roadmap}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>YOUR JOURNEY</span>
          <h2 className={styles.title}>Level Roadmap</h2>
        </div>
        <p className={styles.emptyMessage}>
          No level milestones are available yet.
        </p>
      </section>
    );
  }

  return (
    <section className={styles.roadmap} aria-labelledby="roadmap-title">
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>YOUR JOURNEY</span>
          <h2 id="roadmap-title" className={styles.title}>
            Level Roadmap
          </h2>
          <p className={styles.subtitle}>
            Track your progress and discover upcoming milestones.
          </p>
        </div>

        <div className={styles.headerIcon} aria-hidden="true">
          <Trophy size={23} />
        </div>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryNumber}>
            {roadmap.filter((level) => level.status !== 'upcoming').length}
          </span>
          <span className={styles.summaryLabel}>Levels reached</span>
        </div>

        <div className={styles.summaryDivider} />

        <div className={styles.summaryItem}>
          <span className={styles.summaryNumber}>{roadmap.length}</span>
          <span className={styles.summaryLabel}>Total levels</span>
        </div>

        <div className={styles.summaryDivider} />

        <div className={styles.summaryItem}>
          <span className={styles.summaryNumber}>
            {xp.toLocaleString()}
          </span>
          <span className={styles.summaryLabel}>Your XP</span>
        </div>
      </div>

      <div className={styles.levelList}>
        {roadmap.map((level, index) => {
          const isCompleted = level.status === 'completed';
          const isCurrent = level.status === 'current';
          const isUpcoming = level.status === 'upcoming';

          return (
            <div
              className={`${styles.levelItem} ${
                isCompleted ? styles.completed : ''
              } ${isCurrent ? styles.current : ''} ${
                isUpcoming ? styles.upcoming : ''
              }`}
              key={`${level.level}-${level.xp}`}
            >
              <div className={styles.timeline}>
                <div className={styles.levelIcon}>
                  {isCompleted ? (
                    <Check size={19} strokeWidth={2.5} />
                  ) : isCurrent ? (
                    <Trophy size={19} />
                  ) : (
                    <Lock size={17} />
                  )}
                </div>

                {index < roadmap.length - 1 && (
                  <div className={styles.timelineLine} />
                )}
              </div>

              <div className={styles.levelCard}>
                <div className={styles.levelCardTop}>
                  <div className={styles.levelIdentity}>
                    <span className={styles.levelNumber}>
                      LEVEL {level.level}
                    </span>
                    <h3 className={styles.levelName}>{level.name}</h3>
                  </div>

                  <span
                    className={`${styles.statusBadge} ${
                      isCompleted
                        ? styles.completedBadge
                        : isCurrent
                          ? styles.currentBadge
                          : styles.upcomingBadge
                    }`}
                  >
                    {isCompleted
                      ? 'Reached'
                      : isCurrent
                        ? 'Current'
                        : 'Locked'}
                  </span>
                </div>

                <div className={styles.levelCardBottom}>
                  <div className={styles.xpRequirement}>
                    <Zap size={15} />
                    <span>
                      {level.threshold.toLocaleString()} XP required
                    </span>
                  </div>

                  {isCurrent && (
                    <span className={styles.currentHint}>Keep going!</span>
                  )}
                  {level.reward && (
                    <span className={styles.rewardRoadmap} title="Demo reward configuration">
                      <Gift size={14} /> {level.reward.amount} {level.reward.type}
                    </span>
                  )}

                  {isUpcoming && (
                    <span className={styles.lockHint}>
                      {(level.threshold - xp).toLocaleString()} XP to go
                    </span>
                  )}

                  {isCompleted && index === roadmap.length - 1 && (
                    <span className={styles.finalHint}>
                      <Crown size={14} />
                      Highest level reached
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default LevelRoadmap;

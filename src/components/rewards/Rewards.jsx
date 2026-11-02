import { useEffect, useState } from 'react';
import {
  Gift,
  Trophy,
  Crown,
  Lock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

import styles from './Rewards.module.css';
import { levels } from '../../data/tempData';

const rewardMilestones = levels
  .filter((level) => level.reward)
  .map((level) => ({
    id: level.level,
    title: `Level ${String(level.level).padStart(2, '0')} Reward`,
    description: `Demo reward for reaching ${level.name}.`,
    requiredXP: level.xp,
    icon: level.level % 3 === 0 ? Crown : level.level % 2 === 0 ? Trophy : Gift,
    rewardLabel: `${level.reward.amount} ${level.reward.type}`,
  }));

function Rewards({ currentXP = 0 }) {
  const [claimedRewards, setClaimedRewards] = useState([]);

  useEffect(() => {
    try {
      const savedRewards = localStorage.getItem('velopRewardsStateV2');

      if (savedRewards) {
        const parsedRewards = JSON.parse(savedRewards);

        if (Array.isArray(parsedRewards)) {
          setClaimedRewards(parsedRewards);
        }
      }
    } catch {
      setClaimedRewards([]);
    }
  }, []);

  const handleClaim = (reward) => {
    if (currentXP < reward.requiredXP) return;
    if (claimedRewards.includes(reward.id)) return;

    const updatedRewards = [...claimedRewards, reward.id];

    setClaimedRewards(updatedRewards);
    localStorage.setItem(
      'velopRewardsStateV2',
      JSON.stringify(updatedRewards)
    );
  };

  return (
    <section className={styles.rewardsSection}>
      <div className={styles.rewardsHeader}>
        <div>
          <span className={styles.sectionEyebrow}>YOUR ACHIEVEMENTS</span>
          <h2>Rewards & Milestones</h2>
          <p>Keep earning XP to unlock new milestones.</p>
        </div>

        <div className={styles.rewardCount}>
          <Gift size={18} />
          <span>
            {claimedRewards.length}/{rewardMilestones.length} Claimed
          </span>
        </div>
      </div>

      <div className={styles.rewardsGrid}>
        {rewardMilestones.map((reward) => {
          const Icon = reward.icon;
          const unlocked = currentXP >= reward.requiredXP;
          const claimed = claimedRewards.includes(reward.id);

          return (
            <article
              key={reward.id}
              className={`${styles.rewardCard} ${
                unlocked ? styles.rewardUnlocked : styles.rewardLocked
              }`}
            >
              <div className={styles.rewardCardTop}>
                <div className={styles.rewardIcon}>
                  <Icon size={25} />
                </div>

                <span
                  className={`${styles.rewardStatus} ${
                    claimed
                      ? styles.rewardClaimed
                      : unlocked
                        ? styles.rewardAvailable
                        : styles.rewardUnavailable
                  }`}
                >
                  {claimed ? (
                    <>
                      <CheckCircle2 size={13} />
                      Claimed
                    </>
                  ) : unlocked ? (
                    <>
                      <Sparkles size={13} />
                      Unlocked
                    </>
                  ) : (
                    <>
                      <Lock size={12} />
                      Locked
                    </>
                  )}
                </span>
              </div>

              <h3>{reward.title}</h3>
              <p className={styles.rewardDescription}>
                {reward.description}
              </p>
              <div className={styles.rewardAmount}>{reward.rewardLabel}</div>

              <div className={styles.rewardRequirement}>
                <span>Required XP</span>
                <strong>
                  {reward.requiredXP.toLocaleString()} XP
                </strong>
              </div>

              <div className={styles.rewardProgressTrack}>
                <div
                  className={styles.rewardProgressFill}
                  style={{
                    width: `${Math.min(
                      100,
                      (currentXP / reward.requiredXP) * 100
                    )}%`,
                  }}
                />
              </div>

              <button
                type="button"
                className={styles.claimButton}
                disabled={!unlocked || claimed}
                onClick={() => handleClaim(reward)}
              >
                {claimed
                  ? 'Already Claimed'
                  : unlocked
                    ? 'Claim Milestone'
                    : `${Math.max(
                        0,
                        reward.requiredXP - currentXP
                      ).toLocaleString()} XP to go`}

                {unlocked && !claimed && <ArrowRight size={16} />}
              </button>
            </article>
          );
        })}
      </div>

      <div className={styles.rewardDisclaimer}>
        <Sparkles size={16} />
        <p>
          Rewards shown here are development placeholders based on the sample brief.
          Claim status is stored in this browser only; no real-world reward is issued.
        </p>
      </div>
    </section>
  );
}

export default Rewards;

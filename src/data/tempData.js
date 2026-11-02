// Level/reward configuration is kept separate from the UI so the backend can
// replace these demo values when the official VELOOP configuration is available.
export const levels = [
  { level: 1, name: 'Starter', xp: 0, description: 'Your VELOOP journey begins here.', badge: 'starter', reward: null },
  { level: 2, name: 'Explorer', xp: 1000, description: 'Discover more of VELOOP.', badge: 'explorer', reward: { type: 'VEs', amount: 50 } },
  { level: 3, name: 'Achiever', xp: 2500, description: 'Your consistency is paying off.', badge: 'achiever', reward: { type: 'VEs', amount: 100 } },
  { level: 4, name: 'Pro', xp: 4000, description: 'You are building real momentum.', badge: 'pro', reward: { type: 'Gems', amount: 10 } },
  { level: 5, name: 'Rising Star', xp: 5000, description: 'Your progress is taking off.', badge: 'rising-star', reward: { type: 'Gems', amount: 25 } },
  { level: 6, name: 'Elite', xp: 8000, description: 'A major progression milestone.', badge: 'elite', reward: { type: 'VEs', amount: 500 } },
  { level: 7, name: 'Champion', xp: 12000, description: 'A top-tier VELOOP milestone.', badge: 'champion', reward: { type: 'Spins', amount: 2 } },
  { level: 8, name: 'Legend', xp: 18000, description: 'A standout level of progress.', badge: 'legend', reward: { type: 'VEs', amount: 750 } },
  { level: 9, name: 'Master', xp: 25000, description: 'A master of progression.', badge: 'master', reward: { type: 'Gems', amount: 50 } },
];

export const levelData = levels.map((level, index) => ({
  ...level,
  minXP: level.xp,
  maxXP: levels[index + 1] ? levels[index + 1].xp - 1 : Infinity,
  xpRequired: level.xp,
}));

// Development placeholders only; these are not official redeemable rewards.
export const rewards = levels.filter((level) => level.reward).map((level) => ({
  id: level.level,
  title: `Level ${String(level.level).padStart(2, '0')} Reward`,
  description: `Demo reward for reaching ${level.name}.`,
  requiredXP: level.xp,
  ...level.reward,
}));

export const activities = [
  { id: 'daily-checkin', title: 'Daily Check-in', description: 'Visit VELOOP every day.', xp: 10, type: 'daily' },
  { id: 'complete-profile', title: 'Complete Your Profile', description: 'Profile bonus is not enabled yet.', xp: null, type: 'coming-soon' },
  { id: 'explore-rewards', title: 'Explore Rewards', description: 'Discover your available milestones.', xp: null, type: 'explore' },
];

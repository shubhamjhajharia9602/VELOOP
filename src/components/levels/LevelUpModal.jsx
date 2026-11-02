import { useEffect } from 'react';
import { ArrowRight, Crown, Gift, Sparkles, Trophy, X } from 'lucide-react';
import styles from './LevelUpModal.module.css';

function LevelUpModal({ level, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!level) return null;

  const reward = level.reward;

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose?.();
    }}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="level-up-title">
        <button className={styles.closeButton} type="button" onClick={onClose} aria-label="Close level-up celebration">
          <X size={19} />
        </button>
        <div className={styles.sparkleOne}><Sparkles size={18} /></div>
        <div className={styles.badge}><Crown size={30} /><strong>{String(level.level).padStart(2, '0')}</strong></div>
        <span className={styles.eyebrow}>ACHIEVEMENT UNLOCKED</span>
        <h2 id="level-up-title">LEVEL UP!</h2>
        <p className={styles.subtitle}>You reached Level {String(level.level).padStart(2, '0')} — {level.name}</p>
        <div className={styles.reward}>
          <Gift size={21} />
          <div><span>Next milestone reward</span><strong>{reward ? `${reward.amount} ${reward.type}` : 'New rewards await'}</strong></div>
        </div>
        <p className={styles.disclaimer}>Level rewards shown are demo configuration and do not issue real-world items.</p>
        <button className={styles.continueButton} type="button" onClick={onClose}>Continue <ArrowRight size={17} /></button>
        <div className={styles.trophy}><Trophy size={19} /></div>
      </section>
    </div>
  );
}

export default LevelUpModal;

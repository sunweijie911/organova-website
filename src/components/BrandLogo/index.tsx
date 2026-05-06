import styles from './index.module.scss';

interface BrandLogoProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export function BrandLogo({ className, variant = 'light' }: BrandLogoProps) {
  const cls = [styles.brandLogo, className].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <img
        alt="OrgaNova"
        className={styles.logo}
        src={
          variant === 'dark'
            ? '/assets/icons/logo-light.svg'
            : '/assets/icons/logo-dark.svg'
        }
      />
    </div>
  );
}

import styles from './index.module.scss';

interface BrandLogoProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export function BrandLogo({ className, variant = 'light' }: BrandLogoProps) {
  const cls = [styles.brandLogo, className].filter(Boolean).join(' ');
  const imgCls = [styles.logo, variant === 'dark' ? styles.logoDark : '']
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls}>
      <img
        alt="OrgaNova"
        className={imgCls}
        src="/portal/images/home/icons/logo.svg"
      />
    </div>
  );
}

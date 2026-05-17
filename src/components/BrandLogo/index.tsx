import styles from './index.module.scss';

interface BrandLogoProps {
  className?: string;
  /**
   * 目标背景色。bg="light"（默认）显示深色 logo，bg="dark" 显示浅色 logo。
   * 用"背景色"而非"logo 颜色"命名，避免调用方混淆。
   */
  bg?: 'light' | 'dark';
}

export function BrandLogo({ className, bg = 'light' }: BrandLogoProps) {
  const cls = [styles.brandLogo, className].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <img
        alt="OrgaNova"
        className={styles.logo}
        src={
          bg === 'dark'
            ? '/assets/icons/logo-light.svg'
            : '/assets/icons/logo-dark.svg'
        }
      />
    </div>
  );
}

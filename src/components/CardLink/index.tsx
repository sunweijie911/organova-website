import { SvgIcon } from '@/components/SvgIcon';
import styles from './index.module.scss';

interface CardLinkProps {
  label: string;
  className?: string;
}

// "Read Full Case Study" 类链接：默认 #3A84FF，hover #1768EF 且箭头右移。
// 颜色与位移通过 CSS 变量驱动，既支持自身 hover，也可由父卡片 .card:hover 设置变量触发。
// 图标用 SvgIcon（mask 方案），颜色跟随链接 currentColor。
export function CardLink({ label, className }: CardLinkProps) {
  return (
    <span className={`${styles.cardLink} ${className ?? ''}`.trim()}>
      <span>{label}</span>
      <SvgIcon className={styles.arrow} name="chevron-right" size={16} />
    </span>
  );
}

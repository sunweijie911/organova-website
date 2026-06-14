import styles from './index.module.scss';

export type IconName =
  | 'arrow-right'
  | 'arrow-down'
  | 'arrow-up'
  | 'arrow-thin-right'
  | 'arrow-thin-left'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'select-arrow'
  | 'warning-circle'
  | 'sort'
  | 'info'
  | 'close'
  | 'trash'
  | 'check'
  | 'beaker'
  | 'cloud-db'
  | 'database'
  | 'dna'
  | 'flask'
  | 'link'
  | 'microscope'
  | 'shield'
  | 'target'
  | 'partnership-feasibility'
  | 'partnership-fee'
  | 'partnership-strategic'
  | 'partnership-codev';

interface SvgIconProps {
  name: IconName;
  size?: number;
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
}

export function SvgIcon({
  name,
  size = 24,
  width,
  height,
  color = 'currentColor',
  className,
}: SvgIconProps) {
  const w = width ?? size;
  const h = height ?? size;

  return (
    <span
      aria-hidden="true"
      className={`${styles.icon} ${className ?? ''}`}
      style={
        {
          '--icon-w': typeof w === 'number' ? `${w}px` : w,
          '--icon-h': typeof h === 'number' ? `${h}px` : h,
          '--icon-color': color,
          '--icon-url': `url('/assets/icons/icon-${name}.svg')`,
        } as React.CSSProperties
      }
    />
  );
}

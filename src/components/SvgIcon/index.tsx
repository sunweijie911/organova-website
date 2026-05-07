export type IconName =
  | 'arrow-right'
  | 'arrow-down'
  | 'arrow-up'
  | 'arrow-thin-right'
  | 'arrow-thin-left'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'sort'
  | 'info'
  | 'beaker'
  | 'cloud-db'
  | 'database'
  | 'dna'
  | 'flask'
  | 'link'
  | 'microscope'
  | 'shield'
  | 'target';

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
  const url = `/assets/icons/icon-${name}.svg`;

  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: 'inline-block',
        flexShrink: 0,
        width: typeof w === 'number' ? `${w}px` : w,
        height: typeof h === 'number' ? `${h}px` : h,
        backgroundColor: color,
        maskImage: `url('${url}')`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: `url('${url}')`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
    />
  );
}

'use client';

import { SvgIcon } from '@/components/SvgIcon';
import styles from './index.module.scss';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  ariaLabel?: string;
  className?: string;
}

/**
 * 通用 Select 下拉选择器 — Figma 545:6098 (Frame 74)
 * 0.5px #000 边框、圆角 2px、padding 8/10，Roboto 16 文本 + 右侧 chevron。
 * 基于原生 <select>（appearance:none）以保留无障碍与键盘交互，箭头用 SvgIcon 叠加。
 */
export function Select({
  value,
  options,
  onChange,
  ariaLabel,
  className,
}: SelectProps) {
  return (
    <span className={`${styles.wrapper} ${className ?? ''}`.trim()}>
      <select
        aria-label={ariaLabel}
        className={styles.select}
        onChange={(e) => onChange(e.target.value)}
        value={value}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <SvgIcon className={styles.chevron} name="chevron-down" size={12} />
    </span>
  );
}

'use client';

import styles from './index.module.scss';

export interface TabItem<T extends string = string> {
  key: T;
  label: string;
}

interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  activeKey: T;
  onChange: (key: T) => void;
  ariaLabel?: string;
  /** 外层颜色由调用方控制（深色 hero 传白色、浅色 hero 传黑色） */
  className?: string;
}

/**
 * 通用 Tab 导航 — FAQ 与 Publications 共用
 * 文本 Roboto 20px，默认 Light 300、选中 Medium 500；
 * 选中/未选中底部统一为虚线下划线（dotted）。颜色 inherit，由父容器决定深/浅。
 */
export function Tabs<T extends string = string>({
  items,
  activeKey,
  onChange,
  ariaLabel,
  className,
}: TabsProps<T>) {
  return (
    <nav
      aria-label={ariaLabel}
      className={`${styles.nav} ${className ?? ''}`.trim()}
    >
      {items.map(({ key, label }) => (
        <button
          className={`${styles.tab} ${activeKey === key ? styles.tabActive : ''}`}
          key={key}
          onClick={() => onChange(key)}
          type="button"
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

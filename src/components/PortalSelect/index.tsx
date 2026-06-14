'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { SvgIcon } from '@/components/SvgIcon';
import styles from './index.module.scss';

export interface PortalSelectOption {
  value: string;
  label: string;
}

interface PortalSelectProps {
  /** 字段标签 */
  label: string;
  /** 未选中时的占位文字 */
  placeholder: string;
  /** 选项：可传字符串数组或 {value,label} 数组 */
  options: (string | PortalSelectOption)[];
  /** 受控值 */
  value: string;
  /** 选择回调，直接回传 value */
  onChange: (value: string) => void;
  /** 错误提示文案，存在时进入错误态 */
  error?: string;
  /** 触发器 id，默认自动生成 */
  id?: string;
  /**
   * 视觉变体：
   * - `default`（默认）：60px 阴影卡片表单样式
   * - `compact`：年份筛选用的小边框盒 + 外置 Bold 标签（Figma 1199:6285/6900/6999）
   */
  variant?: 'default' | 'compact';
}

function normalize(opt: string | PortalSelectOption): PortalSelectOption {
  return typeof opt === 'string' ? { value: opt, label: opt } : opt;
}

/**
 * 门户自定义下拉框 —— 依 Figma Listbox Component（545:7425 / 1203:11500 / 1213:12204）。
 * 三态：
 * - 关闭态：白底卡片 + 右侧 `>` 灰箭头(#979BA5)；占位文字 #C4C6CC，选中值 #4D4F56
 * - 展开态：箭头转为 `v`；下拉列表卡片，选中项底色 #E1ECFF/字 #3A84FF，hover #F5F7FA
 * - 错误态：边框 1px #FF5656，下方警告图标 + 文案(#EA3636)
 */
export function PortalSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
  id: idProp,
  variant = 'default',
}: PortalSelectProps) {
  const reactId = useId();
  const id = idProp ?? reactId;
  const compact = variant === 'compact';
  const [open, setOpen] = useState(false);
  /* 弹出方向：默认向下，空间不足时向上 */
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom');
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const opts = options.map(normalize);
  const selected = opts.find((o) => o.value === value);

  /* 打开时：计算弹出方向、监听外部点击 / Esc / 滚动 / 缩放 */
  useEffect(() => {
    if (!open) {
      return;
    }

    /* 依据触发器上下可用空间决定向上还是向下弹出 */
    const computePlacement = () => {
      const triggerEl = triggerRef.current;
      const dropdownEl = dropdownRef.current;
      if (!triggerEl || !dropdownEl) {
        return;
      }
      const rect = triggerEl.getBoundingClientRect();
      const dropdownH = dropdownEl.offsetHeight;
      const gap = 8;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // 下方放不下且上方空间更充裕 → 向上弹
      setPlacement(
        spaceBelow < dropdownH + gap && spaceAbove > spaceBelow
          ? 'top'
          : 'bottom',
      );
    };

    const handlePointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    computePlacement();
    window.addEventListener('resize', computePlacement);
    window.addEventListener('scroll', computePlacement, true);
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('resize', computePlacement);
      window.removeEventListener('scroll', computePlacement, true);
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const triggerCls = [
    styles.trigger,
    compact ? styles.triggerCompact : '',
    open ? styles.triggerOpen : '',
    error ? styles.triggerError : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`${styles.field} ${compact ? styles.fieldCompact : ''}`.trim()}
      ref={rootRef}
    >
      <label
        className={`${styles.label} ${compact ? styles.labelCompact : ''}`.trim()}
        htmlFor={id}
        id={`${id}-label`}
      >
        {label}
      </label>

      <div className={styles.control}>
        <button
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-labelledby={`${id}-label`}
          className={triggerCls}
          id={id}
          onClick={() => setOpen((o) => !o)}
          ref={triggerRef}
          type="button"
        >
          <span className={selected ? styles.valueText : styles.placeholder}>
            {selected ? selected.label : placeholder}
          </span>
          <SvgIcon
            className={[
              styles.arrow,
              open && (placement === 'top' ? styles.arrowUp : styles.arrowOpen),
            ]
              .filter(Boolean)
              .join(' ')}
            color="#979BA5"
            name="select-arrow"
            size={14}
          />
        </button>

        {open && (
          <div
            aria-labelledby={`${id}-label`}
            className={[
              styles.dropdown,
              compact && styles.dropdownCompact,
              placement === 'top' && styles.dropdownTop,
            ]
              .filter(Boolean)
              .join(' ')}
            ref={dropdownRef}
            role="listbox"
            tabIndex={-1}
          >
            {opts.map((o) => (
              <button
                aria-selected={o.value === value}
                className={`${styles.item} ${o.value === value ? styles.itemSelected : ''}`}
                key={o.value}
                onClick={() => pick(o.value)}
                role="option"
                type="button"
              >
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className={styles.error}>
          <SvgIcon color="#EA3636" name="warning-circle" size={16} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

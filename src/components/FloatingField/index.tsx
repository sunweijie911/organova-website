import styles from './index.module.scss';

interface FloatingFieldProps {
  /** input/textarea 的 id，同时用于 label 关联 */
  id: string;
  /** 字段标签，空闲态充当占位文字、focus/填入态上浮为小标签 */
  label: string;
  /** 受控值 */
  value: string;
  /** 值变化回调，直接回传字符串（兼容 input 与 textarea） */
  onChange: (value: string) => void;
  /** input 类型，multiline 时忽略 */
  type?: string;
  required?: boolean;
  /** 是否多行（textarea） */
  multiline?: boolean;
  /** textarea 行数 */
  rows?: number;
  name?: string;
  /** 外层宽度/布局类（由各页面控制，组件本身不限定宽度） */
  className?: string;
}

/**
 * 浮动 label 线条输入框 —— contact 与 request-quote step2 共享。
 * 三态交互（依 Figma 757:9241，分隔线在顶部）：
 * - 空闲态：顶边虚线；label 以 24px 灰字充当占位文字停在输入位
 * - 输入时(focus)：顶边变实线；label 上浮缩为 10px
 * - 填入态(filled)：顶边保持实线；label 维持上浮；显示输入值 20px
 */
export function FloatingField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  multiline = false,
  rows = 4,
  name,
  className,
}: FloatingFieldProps) {
  const isFilled = value.length > 0;
  const fieldClass = [styles.field, isFilled ? styles.isFilled : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={fieldClass} htmlFor={id}>
      <span className={styles.floatingLabel}>{label}</span>
      {multiline ? (
        <textarea
          aria-label={label}
          className={`${styles.input} ${styles.textarea}`}
          id={id}
          name={name}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={rows}
          value={value}
        />
      ) : (
        <input
          aria-label={label}
          className={styles.input}
          id={id}
          name={name}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          type={type}
          value={value}
        />
      )}
    </label>
  );
}

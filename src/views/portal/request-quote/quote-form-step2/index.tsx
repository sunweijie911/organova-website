'use client';

import styles from './index.module.scss';

export type Step2Data = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  phone: string;
  additionalNotes: string;
};

interface QuoteFormStep2Props {
  data: Step2Data;
  isError: boolean;
  isPending: boolean;
  onChange: (
    key: keyof Step2Data,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

interface LineInputProps {
  id: string;
  label: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  value: string;
}

/* 带底部虚线的输入框组件（对应 Figma 中的 Frame 107 风格） */
function LineInput({
  id,
  label,
  onChange,
  placeholder,
  required,
  type = 'text',
  value,
}: LineInputProps) {
  return (
    <div className={styles.field}>
      <input
        className={styles.input}
        id={id}
        onChange={onChange}
        placeholder={placeholder || label}
        required={required}
        type={type}
        value={value}
      />
    </div>
  );
}

export default function QuoteFormStep2({
  data,
  isError,
  isPending,
  onChange,
  onBack,
  onSubmit,
}: QuoteFormStep2Props) {
  return (
    <form className={styles.formSection} onSubmit={onSubmit}>
      {/* 第一行：First Name + Last Name */}
      <div className={styles.row}>
        <LineInput
          id="firstName"
          label="First Name"
          onChange={onChange('firstName')}
          placeholder="First Name"
          required
          value={data.firstName}
        />
        <LineInput
          id="lastName"
          label="Last Name"
          onChange={onChange('lastName')}
          placeholder="Last Name"
          required
          value={data.lastName}
        />
      </div>

      {/* 第二行：Email Address（全宽） */}
      <div className={styles.rowFull}>
        <div className={styles.field}>
          <input
            className={styles.input}
            id="email"
            onChange={onChange('email')}
            placeholder="Email Address"
            required
            type="email"
            value={data.email}
          />
        </div>
      </div>

      {/* 第三行：Company + Job Title */}
      <div className={styles.row}>
        <LineInput
          id="company"
          label="Company"
          onChange={onChange('company')}
          placeholder="Company"
          required
          value={data.company}
        />
        <LineInput
          id="jobTitle"
          label="Job Title"
          onChange={onChange('jobTitle')}
          placeholder="Job Title"
          value={data.jobTitle}
        />
      </div>

      {/* 第四行：Phone (Optional)（全宽） */}
      <div className={styles.rowFull}>
        <div className={styles.field}>
          <input
            className={styles.input}
            id="phone"
            onChange={onChange('phone')}
            placeholder="Phone (Optional)"
            type="tel"
            value={data.phone}
          />
        </div>
      </div>

      {/* 第五行：Additional Notes（全宽，textarea） */}
      <div className={styles.rowFull}>
        <div className={styles.field}>
          <textarea
            className={`${styles.input} ${styles.textarea}`}
            id="additionalNotes"
            onChange={onChange('additionalNotes')}
            placeholder="Additional Notes / Project Details (Optional)"
            rows={4}
            value={data.additionalNotes}
          />
        </div>
      </div>

      {/* 错误提示 */}
      {isError && (
        <p className={styles.error}>Something went wrong. Please try again.</p>
      )}

      {/* 操作按钮区 */}
      <div className={styles.actions}>
        {/* Back 按钮 — 左侧，带反向箭头 */}
        <button className={styles.backBtn} onClick={onBack} type="button">
          <svg
            aria-hidden="true"
            fill="none"
            height="16"
            viewBox="0 0 26 16"
            width="26"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M25 8H3M9 1L2 8l7 7"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
          <span>Back</span>
        </button>

        {/* Submit 按钮 — 右侧，带箭头 */}
        <button className={styles.submitBtn} disabled={isPending} type="submit">
          <span>{isPending ? 'Submitting...' : 'Submit Project Brief'}</span>
          {!isPending && (
            <svg
              aria-hidden="true"
              fill="none"
              height="16"
              viewBox="0 0 26 16"
              width="26"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 8h22M17 1l7 7-7 7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}

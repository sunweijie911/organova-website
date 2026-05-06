'use client';

import { ArrowButton } from '@/components/ArrowButton';
import styles from './index.module.scss';

export type Step2Data = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  phone: string;
};

interface QuoteFormStep2Props {
  data: Step2Data;
  isError: boolean;
  isPending: boolean;
  onChange: (
    key: keyof Step2Data,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

interface LineInputProps {
  id: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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

      {/* 错误提示 */}
      {isError && (
        <p className={styles.error}>Something went wrong. Please try again.</p>
      )}

      {/* 操作按钮区 */}
      <div className={styles.actions}>
        {/* Back 按钮 — 左侧，箭头朝左 */}
        <ArrowButton
          iconPosition="left"
          iconVisible="always"
          onClick={onBack}
          type="button"
        >
          Back
        </ArrowButton>

        {/* Submit 按钮 — 右侧 */}
        <ArrowButton disabled={isPending} iconVisible="always" type="submit">
          {isPending ? 'Submitting...' : 'Submit Project Brief'}
        </ArrowButton>
      </div>
    </form>
  );
}

'use client';

import { ArrowButton } from '@/components/ArrowButton';
import { FloatingField } from '@/components/FloatingField';
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
  errorMessage?: string;
  isError: boolean;
  isPending: boolean;
  onChange: (key: keyof Step2Data) => (value: string) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function QuoteFormStep2({
  data,
  errorMessage,
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
        <FloatingField
          className={styles.fieldEqual}
          id="firstName"
          label="First Name"
          onChange={onChange('firstName')}
          required
          value={data.firstName}
        />
        <FloatingField
          className={styles.fieldEqual}
          id="lastName"
          label="Last Name"
          onChange={onChange('lastName')}
          required
          value={data.lastName}
        />
      </div>

      {/* 第二行：Email Address（全宽） */}
      <div className={styles.rowFull}>
        <FloatingField
          className={styles.fieldFull}
          id="email"
          label="Email Address"
          onChange={onChange('email')}
          required
          type="email"
          value={data.email}
        />
      </div>

      {/* 第三行：Company + Job Title */}
      <div className={styles.row}>
        <FloatingField
          className={styles.fieldEqual}
          id="company"
          label="Company"
          onChange={onChange('company')}
          required
          value={data.company}
        />
        <FloatingField
          className={styles.fieldEqual}
          id="jobTitle"
          label="Job Title"
          onChange={onChange('jobTitle')}
          value={data.jobTitle}
        />
      </div>

      {/* 第四行：Phone (Optional)（全宽） */}
      <div className={styles.rowFull}>
        <FloatingField
          className={styles.fieldFull}
          id="phone"
          label="Phone (Optional)"
          onChange={onChange('phone')}
          type="tel"
          value={data.phone}
        />
      </div>

      {/* 错误提示 */}
      {isError && (
        <p className={styles.error}>
          {errorMessage || 'Something went wrong. Please try again.'}
        </p>
      )}

      {/* 操作按钮区 — Back 在左，Submit 在右 */}
      <div className={styles.actions}>
        <ArrowButton iconPosition="left" onClick={onBack} type="button">
          Back
        </ArrowButton>

        <ArrowButton disabled={isPending} type="submit">
          {isPending ? 'Submitting...' : 'Submit Project Brief'}
        </ArrowButton>
      </div>
    </form>
  );
}

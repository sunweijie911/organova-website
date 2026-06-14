'use client';

import { useState } from 'react';
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

/* 必填字段（Job Title / Phone 为可选） */
const REQUIRED_FIELDS: (keyof Step2Data)[] = [
  'firstName',
  'lastName',
  'email',
  'company',
];

const REQUIRED_MESSAGE = 'This field is required.';
const EMAIL_MESSAGE = 'Please enter a valid email address.';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [errors, setErrors] = useState<
    Partial<Record<keyof Step2Data, string>>
  >({});

  /* 包裹父级 onChange：输入后清除该字段错误 */
  const handleChange = (key: keyof Step2Data) => (value: string) => {
    onChange(key)(value);
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  /* 校验必填 + 邮箱格式，通过才提交 */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Partial<Record<keyof Step2Data, string>> = {};
    for (const key of REQUIRED_FIELDS) {
      if (!data[key].trim()) {
        nextErrors[key] = REQUIRED_MESSAGE;
      }
    }
    if (!nextErrors.email && data.email && !EMAIL_RE.test(data.email)) {
      nextErrors.email = EMAIL_MESSAGE;
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    onSubmit(e);
  };

  return (
    <form className={styles.formSection} noValidate onSubmit={handleSubmit}>
      {/* 第一行：First Name + Last Name */}
      <div className={styles.row}>
        <FloatingField
          className={styles.fieldEqual}
          error={errors.firstName}
          id="firstName"
          label="First Name"
          onChange={handleChange('firstName')}
          required
          value={data.firstName}
        />
        <FloatingField
          className={styles.fieldEqual}
          error={errors.lastName}
          id="lastName"
          label="Last Name"
          onChange={handleChange('lastName')}
          required
          value={data.lastName}
        />
      </div>

      {/* 第二行：Email Address（全宽） */}
      <div className={styles.rowFull}>
        <FloatingField
          className={styles.fieldFull}
          error={errors.email}
          id="email"
          label="Email Address"
          onChange={handleChange('email')}
          required
          type="email"
          value={data.email}
        />
      </div>

      {/* 第三行：Company + Job Title */}
      <div className={styles.row}>
        <FloatingField
          className={styles.fieldEqual}
          error={errors.company}
          id="company"
          label="Company"
          onChange={handleChange('company')}
          required
          value={data.company}
        />
        <FloatingField
          className={styles.fieldEqual}
          id="jobTitle"
          label="Job Title"
          onChange={handleChange('jobTitle')}
          value={data.jobTitle}
        />
      </div>

      {/* 第四行：Phone (Optional)（全宽） */}
      <div className={styles.rowFull}>
        <FloatingField
          className={styles.fieldFull}
          id="phone"
          label="Phone (Optional)"
          onChange={handleChange('phone')}
          type="tel"
          value={data.phone}
        />
      </div>

      {/* 提交接口错误提示 */}
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

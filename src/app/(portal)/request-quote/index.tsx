'use client';

import { useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { api } from '@/lib/trpc/react';
import styles from './index.module.scss';
import QuoteFormStep1, { type Step1Data } from './quote-form-step1';
import QuoteFormStep2, { type Step2Data } from './quote-form-step2';
import StepIndicator from './step-indicator';
import ThankYou from './thank-you';

const INITIAL_S1: Step1Data = {
  cancerType: '',
  drugModality: '',
  studyType: '',
  numCompounds: '',
  turnaround: '',
};

const INITIAL_S2: Step2Data = {
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  jobTitle: '',
  phone: '',
};

export default function RequestQuoteView() {
  const [step, setStep] = useState<1 | 2>(1);
  const [s1, setS1] = useState<Step1Data>(INITIAL_S1);
  const [s2, setS2] = useState<Step2Data>(INITIAL_S2);
  const [submitted, setSubmitted] = useState(false);

  const submit = api.leads.submitRfq.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  /* Step 1 下拉框 onChange 工厂函数 */
  const handleS1Change =
    (k: keyof Step1Data) => (e: React.ChangeEvent<HTMLSelectElement>) =>
      setS1((p) => ({ ...p, [k]: e.target.value }));

  /* Step 2 输入框 onChange 工厂函数（FloatingField 回传字符串值） */
  const handleS2Change = (k: keyof Step2Data) => (value: string) =>
    setS2((p) => ({ ...p, [k]: value }));

  /* Step 1 提交 → 前往 Step 2 */
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  /* Step 2 提交 → 发送请求 */
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    submit.mutate({ ...s1, ...s2 });
  };

  /* 提交成功后显示 Thank You 页面 */
  if (submitted) {
    return <ThankYou />;
  }

  return (
    <div className={styles.page}>
      {/* 左上角品牌 logo — Figma: x:48 y:105 */}
      <BrandLogo />

      <div className={styles.content}>
        {/* 标题区 — Figma: 标题 y:402, 副标题 y:566 */}
        <header className={styles.header}>
          <h1 className={styles.title}>Tell Us About Your Program.</h1>
          <p className={styles.subtitle}>
            The more detail you provide, the faster we can design a study that
            fits your needs.
          </p>
        </header>

        {/* 步骤指示器 — Figma: x:651, y:683, width:618 */}
        <div className={styles.stepperWrapper}>
          <StepIndicator currentStep={step} />
        </div>

        {/* 表单区 — Figma: x:240, y:765 起 */}
        <div className={styles.formArea}>
          {step === 1 && (
            <QuoteFormStep1
              data={s1}
              onChange={handleS1Change}
              onSubmit={handleStep1Submit}
            />
          )}
          {step === 2 && (
            <QuoteFormStep2
              data={s2}
              errorMessage={submit.error?.message}
              isError={submit.isError}
              isPending={submit.isPending}
              onBack={() => setStep(1)}
              onChange={handleS2Change}
              onSubmit={handleStep2Submit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { api } from '@/lib/trpc/react';
import HeroBanner from './hero-banner';
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
  additionalNotes: '',
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

  /* Step 2 输入框 onChange 工厂函数 */
  const handleS2Change =
    (k: keyof Step2Data) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setS2((p) => ({ ...p, [k]: e.target.value }));

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
      {/* Hero 区：深色背景，大标题 */}
      <HeroBanner />

      {/* 表单主体区：白色背景 */}
      <section className={styles.formSection}>
        {/* 步骤进度指示器 */}
        <div className={styles.stepperWrapper}>
          <StepIndicator currentStep={step} />
        </div>

        {/* 表单内容区，随步骤切换 */}
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
              isError={submit.isError}
              isPending={submit.isPending}
              onBack={() => setStep(1)}
              onChange={handleS2Change}
              onSubmit={handleStep2Submit}
            />
          )}
        </div>
      </section>
    </div>
  );
}

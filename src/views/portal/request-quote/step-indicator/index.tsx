'use client';

import styles from './index.module.scss';

interface StepIndicatorProps {
  currentStep: 1 | 2;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className={styles.stepper}>
      {/* Step 1 */}
      <div className={styles.step}>
        <div className={styles.stepRow}>
          {/* 左侧空白区域（让步骤居中对齐） */}
          <div className={styles.colLeft} />
          {/* 步骤指示器圆圈 — 已填完时切到 done 态显示对勾 */}
          <div
            className={`${styles.indicator} ${currentStep > 1 ? styles.indicatorDone : styles.indicatorActive}`}
          >
            {currentStep > 1 ? (
              /* 已完成：对勾图标 */
              <svg
                aria-hidden="true"
                fill="none"
                height="10"
                viewBox="0 0 12 10"
                width="12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 5l3.5 3.5L11 1"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            ) : (
              /* 活跃中：实心圆点 */
              <div className={styles.activeDot} />
            )}
          </div>
          {/* 右侧连接线 */}
          <div
            className={`${styles.connectorLine} ${currentStep > 1 ? styles.connectorLineDone : ''}`}
          />
        </div>
        <div
          className={`${styles.stepLabel} ${currentStep >= 1 ? styles.stepLabelActive : styles.stepLabelDefault}`}
        >
          YOUR PROGRAM
        </div>
      </div>

      {/* Step 2 */}
      <div className={styles.step}>
        <div className={styles.stepRow}>
          {/* 左侧连接线 — Figma: Step2 Col1 是 IMAGE-SVG 连接线，与 Step1 右侧线衔接成完整一条 */}
          <div
            className={`${styles.connectorLine} ${currentStep > 1 ? styles.connectorLineDone : ''}`}
          />
          {/* 步骤指示器圆圈 */}
          <div
            className={`${styles.indicator} ${currentStep >= 2 ? styles.indicatorActive : styles.indicatorDefault}`}
          >
            {currentStep >= 2 && <div className={styles.activeDot} />}
          </div>
          {/* 右侧空白 */}
          <div className={styles.colRight} />
        </div>
        <div
          className={`${styles.stepLabel} ${currentStep >= 2 ? styles.stepLabelActive : styles.stepLabelDefault}`}
        >
          Your Contact
        </div>
      </div>
    </div>
  );
}
